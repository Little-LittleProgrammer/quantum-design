<script setup lang="ts">
import { ref } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { streamFetch as tauriStreamFetch } from './stream';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';

import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';
import { readTextFile, writeTextFile, create, readDir } from '@tauri-apps/plugin-fs';
import { openUrl, revealItemInDir, openPath } from '@tauri-apps/plugin-opener';
import { appDataDir } from '@tauri-apps/api/path';

const greetMsg = ref('');
const name = ref('');

// 流式请求相关状态
const streaming = ref(false);
const streamOutput = ref('');
const streamStatus = ref<number | null>(null);
// SSE 缓冲，按 "\n\n" 分块解析
let sseBuffer = '';

// 简单可配置项
const endpoint = ref('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation');
const apiKey = ref('');
const model = ref('qwen-plus');
const userPrompt = ref('你是谁？');

async function greet() {
    greetMsg.value = await invoke('greet', { name: name.value });
}

async function streamFetch() {
    if (!apiKey.value) {
        alert('请先填写 API Key');
        return;
    }
    streaming.value = true;
    streamOutput.value = '';
    streamStatus.value = null;

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.value}`,
        'X-DashScope-SSE': 'enable',
    } as Record<string, string>;

    const bodyObj = {
        model: model.value,
        input: {
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: userPrompt.value },
            ],
        },
        parameters: { result_format: 'message', incremental_output: true },
    };

    try {
        const response = await tauriStreamFetch(endpoint.value, {
            method: 'POST',
            headers,
            body: JSON.stringify(bodyObj),
        });
        streamStatus.value = response.status;
        const reader = response.body?.getReader();
        if (reader) {
            const decoder = new TextDecoder();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const text = decoder.decode(value, { stream: true } as any);
                processSseChunk(text);
            }
            // 处理残留未形成完整块的行（尽力而为）
            flushSseBuffer();
        }
    } catch (e) {
        streamOutput.value += `\n[error] ${e}`;
    } finally {
        streaming.value = false;
        try {
            // 你有发送通知的权限吗？
            let permissionGranted = await isPermissionGranted();
            console.log('permissionGranted', permissionGranted);

            // 如果没有，我们需要请求它
            if (!permissionGranted) {
                const permission = await requestPermission();
                permissionGranted = permission === 'granted';
            }
            const preview = streamOutput.value.slice(0, 80) || '请求已完成';
            await sendNotification({
                title: '流式请求完成',
                body: `${preview}${streamOutput.value.length > 80 ? '…' : ''}`,
            });
        } catch (err) {
            console.warn('发送通知失败', err);
        }
    }
}

function processSseChunk(chunk: string) {
    sseBuffer += chunk;
    // 优先按空行分块（\n\n 或 \r\n\r\n）
    while (true) {
        const idx = sseBuffer.indexOf('\n\n');
        const idxCRLF = sseBuffer.indexOf('\r\n\r\n');
        let cut = -1;
        let delimLen = 2;
        if (idx >= 0 && idxCRLF >= 0) {
            cut = Math.min(idx, idxCRLF);
            delimLen = cut === idx ? 2 : 4;
        } else if (idx >= 0) {
            cut = idx;
            delimLen = 2;
        } else if (idxCRLF >= 0) {
            cut = idxCRLF;
            delimLen = 4;
        }
        if (cut < 0) break;
        const block = sseBuffer.slice(0, cut);
        sseBuffer = sseBuffer.slice(cut + delimLen);
        handleSseBlock(block);
    }
}

function handleSseBlock(block: string) {
    // 忽略注释行，例如 ":HTTP_STATUS/200"
    const lines = block.split(/\r?\n/).filter(Boolean);
    const dataLines: string[] = [];
    for (const line of lines) {
        if (line.startsWith(':')) continue;
        if (line.startsWith('data:')) {
            dataLines.push(line.slice(5).trimStart());
        }
        // 其余如 id:/event: 可忽略
    }
    if (dataLines.length === 0) return;
    const dataPayload = dataLines.join('\n');
    if (dataPayload === '[DONE]') return;
    appendContentFromData(dataPayload);
}

function flushSseBuffer() {
    if (!sseBuffer) return;
    // 尝试逐行 data: 解析（容错）
    const lines = sseBuffer.split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
        if (line.startsWith('data:')) {
            const payload = line.slice(5).trimStart();
            if (payload && payload !== '[DONE]') appendContentFromData(payload);
        }
    }
    sseBuffer = '';
}

function appendContentFromData(payload: string) {
    try {
        const obj = JSON.parse(payload);
        // 针对 DashScope 的结构：output.choices[0].message.content
        const content = obj?.output?.choices?.[0]?.message?.content;
        if (typeof content === 'string') {
            streamOutput.value += content;
            return;
        }
        if (Array.isArray(content)) {
            for (const part of content) {
                if (typeof part === 'string') streamOutput.value += part;
                else if (part && typeof part.text === 'string') streamOutput.value += part.text;
            }
            return;
        }
        // 常见兜底
        if (typeof obj?.output_text === 'string') {
            streamOutput.value += obj.output_text;
            return;
        }
    } catch {
        // 非 JSON：直接追加，避免丢失信息
        streamOutput.value += payload;
    }
}

async function jsonFetch() {
    const res = await fetch('https://httpbin.org/json');
    const json = await res.json();
    console.log('jsonFetch', json);
}

async function checkFileExists() {
    const res = await exists('config.json', { baseDir: BaseDirectory.AppLocalData });
    console.log('checkFileExists', res);
}

// ====== 系统级功能演示 ======

async function demoOpenUrl() {
    await openUrl('https://tauri.app');
}

async function demoOpenAppConfigDir() {
    // 创建并打开应用数据目录下的一个文件，并处理未捕获的 Promise 异常
    try {
        await create('demo.txt', { baseDir: BaseDirectory.AppData });
        await writeTextFile('demo.txt', 'hello config', { baseDir: BaseDirectory.AppData });
        const entries = await readDir('.', { baseDir: BaseDirectory.AppData });
        console.log('AppData entries', entries);
    } catch (err) {
        console.error('操作文件时发生错误:', err);
        const message = err instanceof Error ? err.message : String(err);
        alert('操作文件时发生错误: ' + message);
    }
}

async function demoRevealInFinder() {
    // 在 Finder 中显示应用数据目录
    const dir = await appDataDir();
    await revealItemInDir(`${dir}demo.txt`);
}

async function demoRunCommand() {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }
    const res = await invoke<{ stdout?: string; stderr?: string }>('run_command', { program: 'uname', args: ['-a'] });
    const macosVersion = await invoke<{ stdout?: string; stderr?: string }>('run_command', { program: 'sw_vers', args: ['-productVersion'] });
    const systemProfiler = await invoke<{ stdout?: string; stderr?: string }>('run_command', { program: 'system_profiler', args: ['SPSoftwareDataType'] });
    console.log('demoRunCommand', res, macosVersion, systemProfiler);
    await sendNotification({ title: '系统信息', body: `${systemProfiler.stdout || systemProfiler.stderr}`.replace(/\n/g, ' ') });
}
</script>

<template>
    <div>
        <a-card size="small" title="Welcome to Tauri + Vue"> </a-card>
        <a-card class="g-mt" size="small" title="与rust通讯，并实现响应式">
            <div class="row">
                <a-input class="g-w-300" id="greet-input" v-model:value="name" placeholder="Enter a name..." />
                <a-button class="g-ml" type="primary" @click.prevent="greet">Greet</a-button>
                <p class="g-mt-10">{{ greetMsg }}</p>
            </div>
        </a-card>
        <a-card class="g-mt" size="small" title="系统功能 Demo">
            <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center">
                <a-button @click="demoOpenUrl">打开 URL</a-button>
                <a-button @click="demoOpenAppConfigDir">文件系统读写</a-button>
                <a-button @click="demoRevealInFinder">在 Finder 中显示</a-button>
                <a-button @click="demoRunCommand">运行命令 查看电脑信息，结果发送系统通知</a-button>
            </div>
        </a-card>
        <a-card class="g-mt" size="small" title="跨域调用接口，流式传输">
            <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 8px; align-items: center">
                <div style="width: 100%; max-width: 720px; display: grid; grid-template-columns: 140px 1fr; gap: 8px; align-items: center">
                    <label>Endpoint</label>
                    <input v-model="endpoint" />
                    <label>API Key</label>
                    <input v-model="apiKey" placeholder="Bearer ..." />
                    <label>Model</label>
                    <input v-model="model" />
                    <label>Prompt</label>
                    <input v-model="userPrompt" />
                </div>
                <div style="display: flex; gap: 8px">
                    <a-button :disabled="streaming" @click="streamFetch">开始流式请求</a-button>
                    <a-button @click="jsonFetch">JSON Fetch</a-button>
                </div>
                <div style="width: 100%; max-width: 720px; text-align: left">
                    <p v-if="streaming">状态: 流式传输中…</p>
                    <p v-else>状态: {{ streamStatus ?? '-' }}</p>
                    <pre style="white-space: pre-wrap; word-break: break-word; background: #00000010; padding: 8px; border-radius: 6px; min-height: 120px">{{ streamOutput }}</pre>
                </div>

                <div style="height: 1px; background: #ddd; width: 100%; max-width: 720px; margin: 12px 0"></div>
            </div>
        </a-card>
    </div>
</template>

<style scoped></style>
