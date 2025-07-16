import minimist from 'minimist';
import { red, green, blue, yellow } from 'kolorist';
import type { AnalysisConfig } from './types';

/**
 * 显示帮助信息
 */
function showHelp(): void {
  console.log(`
${blue('性能分析脚本')}

${green('使用方法:')}
  product-analysis <项目目录> [选项]

${green('参数:')}
  <项目目录>              必需，要分析的项目目录路径

${green('选项:')}
  --webhook <url>         飞书 webhook 地址
  --api-key <key>         阿里云 API Key (或设置环境变量 BAILIAN_API_KEY)
  --bailian-app-id <id>   百炼应用 ID (或设置环境变量 BAILIAN_APP_ID)
  --help, -h              显示帮助信息
  --version, -v           显示版本信息

${green('示例:')}
  product-analysis ./my-project
  product-analysis ./my-project --webhook https://open.feishu.cn/open-apis/bot/v2/hook/xxx
  product-analysis ./my-project --api-key your-api-key --webhook https://xxx
  
${green('环境变量:')}
  BAILIAN_API_KEY         阿里云 API Key
  BAILIAN_APP_ID          百炼应用 ID
`);
}

/**
 * 显示版本信息
 */
function showVersion(): void {
  console.log('1.0.0');
}

/**
 * 解析命令行参数
 */
export function parseCliArgs(): AnalysisConfig | null {
  const args = minimist(process.argv.slice(2), {
    string: ['webhook', 'api-key', 'bailian-app-id'],
    boolean: ['help', 'version'],
    alias: {
      h: 'help',
      v: 'version',
      w: 'webhook',
      k: 'api-key',
      a: 'bailian-app-id'
    }
  });

  // 显示帮助信息
  if (args.help) {
    showHelp();
    return null;
  }

  // 显示版本信息
  if (args.version) {
    showVersion();
    return null;
  }

  // 检查项目目录参数
  if (args._.length === 0) {
    console.error(red('❌ 错误: 请提供项目目录'));
    console.log('\n使用 --help 查看帮助信息');
    process.exit(1);
  }

  const projectDir = args._[0];
  const feishuWebhook = args.webhook;
  
  // 获取 API Key，优先使用命令行参数，其次使用环境变量
  const apiKey = args['api-key'] || process.env.BAILIAN_API_KEY;
  if (!apiKey) {
    console.error(red('❌ 错误: 请提供阿里云 API Key'));
    console.log('  方式1: 使用 --api-key 参数');
    console.log('  方式2: 设置环境变量 BAILIAN_API_KEY');
    process.exit(1);
  }

  // 获取百炼应用 ID（可选）
  const bailianAppId = args['bailian-app-id'];

  return {
    projectDir,
    feishuWebhook,
    apiKey,
    bailianAppId
  };
}

/**
 * 验证配置
 */
export function validateConfig(config: AnalysisConfig): void {
  if (!config.projectDir) {
    throw new Error('项目目录不能为空');
  }

  if (!config.apiKey) {
    throw new Error('API Key 不能为空');
  }
}

/**
 * 打印配置信息
 */
export function printConfig(config: AnalysisConfig): void {
  console.log(blue('📋 分析配置:'));
  console.log(`  项目目录: ${green(config.projectDir)}`);
  console.log(`  API Key: ${config.apiKey ? green('已设置') : red('未设置')}`);
  console.log(`  百炼应用 ID: ${config.bailianAppId ? green(config.bailianAppId) : yellow('未设置')}`);
  console.log(`  飞书 Webhook: ${config.feishuWebhook ? green('已设置') : yellow('未设置')}`);
  console.log('');
} 
