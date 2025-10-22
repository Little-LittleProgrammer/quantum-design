#!/bin/bash

set -e

echo $ANTHROPIC_BASE_URL
echo $ANTHROPIC_AUTH_TOKEN

git config --global user.name "devops"
git config --global user.email 'temp@qimao.com'

# cat /root/prompt/performace.md

BASE_REPO_NAME=$(basename "${REPO_NAME}")

rm -rf ${BASE_REPO_NAME}


echo "开始克隆仓库 ${BASE_REPO_NAME}..."

git clone https://oauth2:${ALI_TOKEN}@codeup.aliyun.com/qimao/${REPO_NAME}.git

echo "✅ 克隆成功"

# 进入仓库目录
cd "${BASE_REPO_NAME}"
mv /root/prompt/sentryfix.md ./
echo "当前目录: $(pwd)"

echo "添加规则，忽略指定文件"
# 向 .gitignore 添加忽略规则(如果不存在)

GITIGNORE=".gitignore"
RULES=("report/sentryfix.json" "sentryfix.md" "report/performance.json" "performance.md")

for rule in "${RULES[@]}"; do
    if grep -Fxq "$rule" "$GITIGNORE"; then
        echo "✓ 规则已存在: $rule"
    else
        echo "$rule" >> "$GITIGNORE"
        echo "✓ 已添加规则: $rule"
    fi
done


# 检查目录内容
echo "仓库内容:"
ls -la

# 执行后续命令
echo "添加mcp"

claude mcp add-json workflow '{"command": "npx", "args": ["-y", "qm-workflow-mcp@0.1.4", "--stdio"], "env": {"FEISHU_APP_ID": "'${FEISHU_APP_ID}'", "FEISHU_APP_SECRET": "'${FEISHU_APP_SECRET}'","REPO_NAME": "'${BASE_REPO_NAME}'", "TARGET_BRANCH": "'${TARGET_BRANCH}'", "ALI_TOKEN": "'${ALI_TOKEN}'"}}'
echo "开始执行AI流程..."
claude -p "按照 ./sentryfix.md, 修复 ${SENTRY_JSON} 问题" --allowedTools "mcp__workflow,Bash,Edit(*),Read(*),WebSearch,WebFetch" --permission-mode acceptEdits 
echo "继续执行AI流程，以保证全部流程执行顺利..."
claude --continue "继续，检测流程是否完成，尤其查找指定文件(report/sentryfix.json)是否生成" --allowedTools "mcp__workflow,Bash,Edit(*),Read(*),WebSearch,WebFetch" --permission-mode acceptEdits
# claude -p "按照 ./performance.md, 测试 ${TEST_WEB} 网站, 并详细分析" --allowedTools "mcp__lighthouse,mcp__larkmcp__bitable_v1_appTableField_list,mcp__larkmcp__bitable_v1_appTableRecord_create,mcp__larkmcp__im_v1_message_create,Bash,Edit(*),Read(*),WebSearch,WebFetch" --permission-mode acceptEdits
    
echo "发送http，更新结果"

#!/bin/bash

jq ".sentry_title=\"${SENTRY_TITLE}\"" report/sentryfix.json > tmp.json && mv tmp.json report/sentryfix.json
jq ".sentry_id=${SENTRY_ID}" report/sentryfix.json > tmp.json && mv tmp.json report/sentryfix.json

cat report/sentryfix.json

# 创建 webhook-sender.js 文件
cat > sentry.cjs << 'EOF'
const fs = require('fs');

// 解析命令行参数
const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Usage: ./webhook-sender.js <json-file> <webhook-url> [options]');
    console.error('Options:');
    console.error('  --method <GET|POST|PUT>  HTTP method (default: POST)');
    console.error('  --header <key:value>     Add custom header (can be used multiple times)');
    console.error('  --timeout <ms>           Request timeout in milliseconds (default: 10000)');
    console.error('  --pretty                 Pretty print JSON in request body');
    process.exit(1);
}

const jsonFile = args[0];
const webhookUrl = args[1];
let method = 'POST';
const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Node.js-Webhook-Sender/1.0',
};
let timeout = 10000;
let prettyPrint = false;

// 解析选项
for (let i = 2; i < args.length; i++) {
    switch (args[i]) {
        case '--method':
            method = args[++i]?.toUpperCase() || 'POST';
            break;
        case '--header':
            const header = args[++i];
            if (header) {
                const [key, value] = header.split(':', 2);
                if (key && value) {
                    headers[key.trim()] = value.trim();
                }
            }
            break;
        case '--timeout':
            timeout = parseInt(args[++i]) || 10000;
            break;
        case '--pretty':
            prettyPrint = true;
            break;
        default:
            console.warn(`Unknown option: ${args[i]}`);
    }
}

// 读取和解析JSON文件
function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading JSON file: ${error.message}`);
        process.exit(1);
    }
}

// 发送webhook请求
async function sendWebhook(url, data) {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
        abortController.abort();
    }, timeout);

    try {
        const requestData = prettyPrint ? JSON.stringify(data, null, 2) : JSON.stringify(data);

        const fetchOptions = {
            method: method,
            headers: {
                ...headers,
                Authorization: `Bearer ${process.env.APAAS_SENTRY_TOKEN}`,
            },
            body: requestData,
            signal: abortController.signal,
        };

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        const responseData = await response.text();

        const result = {
            statusCode: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            body: responseData,
        };

        if (response.status >= 200 && response.status < 300) {
            console.log(`✅ Webhook sent successfully (Status: ${response.status})`);
            if (responseData) {
                console.log('Response:', responseData);
            }
            return result;
        } else {
            console.error(`❌ Webhook failed (Status: ${response.status})`);
            console.error('Response:', responseData);
            throw new Error(`HTTP ${response.status}: ${responseData}`);
        }
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            console.error('❌ Request timeout');
            throw new Error('Request timeout');
        } else {
            console.error('❌ Request error:', error.message);
            throw error;
        }
    }
}

// 主函数
async function main() {
    try {
        console.log(`📁 Reading JSON file: ${jsonFile}`);
        const jsonData = readJsonFile(jsonFile);

        console.log(`🌐 Sending ${method} request to: ${webhookUrl}`);
        console.log(`📦 Data size: ${JSON.stringify(jsonData).length} bytes`);

        if (process.env.DEBUG) {
            console.log('Request headers:', headers);
            console.log('Request body:', JSON.stringify(jsonData, null, 2));
        }

        await sendWebhook(webhookUrl, jsonData);
    } catch (error) {
        console.error('❌ Failed to send webhook:', error.message);
        process.exit(1);
    }
}

// 执行主函数
main();
EOF
    
# 使文件可执行
chmod +x sentry.cjs

echo "✅ Webhook sender script created: sentry.cjs"

node ./sentry.cjs ./report/sentryfix.json ${APAAS_URL}

