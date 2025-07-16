#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import { red, green, blue, yellow } from 'kolorist';
import { parseCliArgs, validateConfig, printConfig } from './cli';
import { readProjectInfo, writeReport } from './utils/file';
import { sendMarkdownToFeishu } from './utils/feishu';
import { ProjectAnalyzer } from './analyzer';

/**
 * 主函数
 */
async function main(): Promise<void> {
  console.log(blue('🚀 启动性能分析脚本\n'));

  try {
    // 解析命令行参数
    const config = parseCliArgs();
    if (!config) {
      return; // 显示帮助或版本信息后退出
    }

    // 验证配置
    validateConfig(config);
    printConfig(config);

    // 检查项目目录是否存在
    const projectPath = path.resolve(config.projectDir);
    if (!await fs.pathExists(projectPath)) {
      console.error(red(`❌ 错误: 项目目录不存在: ${projectPath}`));
      process.exit(1);
    }

    // 检查是否为有效的前端项目
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (!await fs.pathExists(packageJsonPath)) {
      console.error(red(`❌ 错误: 目录中未找到 package.json 文件: ${projectPath}`));
      process.exit(1);
    }

    console.log(green('✅ 项目目录验证通过'));

    // 读取项目信息
    console.log(blue('📖 正在读取项目信息...'));
    const projectInfo = await readProjectInfo(projectPath);
    
    console.log(green(`✅ 读取完成`));
    console.log(`  - package.json: ${projectInfo.packageJson.name || '未知项目'}`);
    console.log(`  - 构建产物: ${projectInfo.distFiles.length} 个文件`);
    console.log(`  - Vite 配置: ${projectInfo.viteConfig ? green('已找到') : yellow('未找到')}`);
    console.log('');

    // 如果没有构建产物，给出提示
    if (projectInfo.distFiles.length === 0) {
      console.log(yellow('⚠️  未找到构建产物，建议先运行构建命令'));
      console.log('   常见构建命令: npm run build, yarn build, pnpm build');
      console.log('');
    }

    // 创建分析器并进行分析
    const analyzer = new ProjectAnalyzer(config.apiKey!, config.bailianAppId);
    const reportMarkdown = await analyzer.analyze(projectInfo);

    console.log(green('✅ AI 分析完成'));

    // 写入报告文件
    const reportPath = path.join(projectPath, 'report.md');
    await writeReport(reportPath, reportMarkdown);
    console.log(green(`✅ 报告已保存到: ${reportPath}`));

    // 发送到飞书
    if (config.feishuWebhook) {
      console.log(blue('📤 正在发送报告到飞书...'));
      await sendMarkdownToFeishu(config.feishuWebhook, config.projectDir.split('/').pop()+'项目性能分析报告', reportMarkdown);
    }

    console.log('');
    console.log(green('🎉 性能分析完成！'));
    console.log(`📄 报告文件: ${reportPath}`);
    
    if (config.feishuWebhook) {
      console.log('📤 飞书通知: 已发送');
    }

  } catch (error) {
    console.error('');
    console.error(red('❌ 分析过程中发生错误:'));
    console.error(red(error.message));
    
    if (process.env.DEBUG) {
      console.error('');
      console.error(red('详细错误信息:'));
      console.error(error);
    } else {
      console.error('');
      console.error(yellow('💡 提示: 设置环境变量 DEBUG=1 查看详细错误信息'));
      console.error(error);
    }
    
    process.exit(1);
  }
}

/**
 * 错误处理
 */
process.on('uncaughtException', (error) => {
  console.error(red('❌ 未捕获的异常:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(red('❌ 未处理的 Promise 拒绝:'), reason);
  process.exit(1);
});

// 启动程序
main().catch((error) => {
  console.error(red('❌ 程序启动失败:'), error.message);
  process.exit(1);
}); 
