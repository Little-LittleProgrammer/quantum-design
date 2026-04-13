import type { AgUiEvent, AguiPlugin, AguiPluginContext, AgUiRunInput, RunResult } from '../types';

function sortPlugins(plugins: AguiPlugin[]): AguiPlugin[] {
    const pre: AguiPlugin[] = [];
    const normal: AguiPlugin[] = [];
    const post: AguiPlugin[] = [];

    for (const plugin of plugins) {
        if (plugin.enforce === 'pre') {
            pre.push(plugin);
        } else if (plugin.enforce === 'post') {
            post.push(plugin);
        } else {
            normal.push(plugin);
        }
    }

    return [...pre, ...normal, ...post];
}

export class PluginPipeline {
    private plugins: AguiPlugin[];

    constructor(plugins: AguiPlugin[] = []) {
        this.plugins = sortPlugins(plugins);
    }

    use(plugin: AguiPlugin): this {
        this.plugins = sortPlugins([...this.plugins, plugin]);
        return this;
    }

    getPlugins(): AguiPlugin[] {
        return [...this.plugins];
    }

    /**
     * 执行第一个 resolveInput 插件，首个胜出
     * @param input 输入
     * @param context 上下文
     * @returns 处理后的输入
     */
    async executeFirstResolveInput(input: AgUiRunInput, context: AguiPluginContext): Promise<AgUiRunInput> {
        for (const plugin of this.plugins) {
            if (!plugin.resolveInput) continue;
            const resolved = await plugin.resolveInput(input, context);
            if (resolved != null) return resolved;
        }
        return input;
    }

    /**
     * 执行所有 configureContext 插件， 链式传递，累积合并
     * @param context 上下文
     * @returns 处理后的上下文
     */
    async executeConfigureContext(context: AguiPluginContext): Promise<void> {
        for (const plugin of this.plugins) {
            await plugin.configureContext?.(context);
        }
    }

    /**
     * 执行所有 transformParams 插件， 链式传递，累积合并
     * @param input 输入
     * @param context 上下文
     * @returns 处理后的输入
     */
    async executeTransformParams(input: AgUiRunInput, context: AguiPluginContext): Promise<AgUiRunInput> {
        let merged = input;
        for (const plugin of this.plugins) {
            if (!plugin.transformParams) continue;
            const patch = await plugin.transformParams(merged, context);
            merged = { ...merged, ...patch };
        }
        return merged;
    }

    /**
     * 执行所有 transformStream 插件，  收集后一起传给 SDK
     * @param event 事件
     * @param context 上下文
     * @returns 处理后的事件
     */
    async executeTransformStream(event: AgUiEvent, context: AguiPluginContext): Promise<AgUiEvent | null> {
        let current: AgUiEvent | null = event;
        for (const plugin of this.plugins) {
            if (!plugin.transformStream || current == null) continue;
            current = await plugin.transformStream(current, context);
        }
        return current;
    }

    /**
     * 执行所有 transformResult 插件， 链式传递，累积合并
     * @param result 结果
     * @param context 上下文
     * @returns 处理后的结果
     */
    async executeTransformResult(result: RunResult, context: AguiPluginContext): Promise<RunResult> {
        let current = result;
        for (const plugin of this.plugins) {
            if (!plugin.transformResult) continue;
            current = await plugin.transformResult(current, context);
        }
        return current;
    }

    /**
     * 执行所有 onRunStart 插件， Promise.all 并行
     * @param context 上下文
     * @returns 处理后的上下文
     */
    async executeOnRunStart(context: AguiPluginContext): Promise<void> {
        await Promise.all(this.plugins.map((plugin) => plugin.onRunStart?.(context)));
    }

    /**
     * 执行所有 onRunEnd 插件， Promise.all 并行
     * @param context 上下文
     * @param result 结果
     * @returns 处理后的上下文
     */
    async executeOnRunEnd(context: AguiPluginContext, result: RunResult): Promise<void> {
        await Promise.all(this.plugins.map((plugin) => plugin.onRunEnd?.(context, result)));
    }

    /**
     * 执行所有 onError 插件， Promise.all 并行
     * @param error 错误
     * @param context 上下文
     * @returns 处理后的上下文
     */
    async executeOnError(error: Error, context: AguiPluginContext): Promise<void> {
        await Promise.all(this.plugins.map((plugin) => plugin.onError?.(error, context)));
    }
}
