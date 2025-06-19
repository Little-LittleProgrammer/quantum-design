import axios from 'axios';

/**
 * 发送消息到飞书 webhook
 */
export async function sendToFeishu(webhookUrl: string, content: string): Promise<void> {
  if (!webhookUrl) {
    console.log('未提供飞书 webhook 地址，跳过发送');
    return;
  }

  try {
    const response = await axios.post(webhookUrl, {
      msg_type: 'post',
      content: {
        post: {
          zh_cn: {
            title: '性能分析报告',
            content: [
              [
                {
                  tag: 'text',
                  text: content
                }
              ]
            ]
          }
        }
      }
    });

    if (response.data.code === 0) {
      console.log('✅ 报告已成功发送到飞书');
    } else {
      console.error('❌ 发送到飞书失败:', response.data.msg);
    }
  } catch (error) {
    console.error('❌ 发送到飞书时发生错误:', error.message);
  }
}

/**
 * 发送 Markdown 格式消息到飞书
 */
export async function sendMarkdownToFeishu(webhookUrl: string, title: string, content: string): Promise<void> {
  if (!webhookUrl) {
    console.log('未提供飞书 webhook 地址，跳过发送');
    return;
  }

  try {
    // 将 Markdown 转换为飞书支持的格式
    const formattedContent = content
      .replace(/^# (.*)/gm, '**$1**\n')  // 一级标题
      .replace(/^## (.*)/gm, '**$1**\n') // 二级标题
      .replace(/^### (.*)/gm, '**$1**\n') // 三级标题
      .replace(/\*\*(.*?)\*\*/g, '**$1**') // 粗体
      .replace(/`([^`]+)`/g, '$1') // 行内代码
      .replace(/```[\s\S]*?```/g, '') // 代码块（飞书不支持，移除）
      .replace(/\n{3,}/g, '\n\n'); // 多个换行合并为两个

    const response = await axios.post(webhookUrl, {
      msg_type: 'text',
      content: {
        text: `${title}\n\n${formattedContent}`
      }
    });

    if (response.data.code === 0) {
      console.log('✅ 报告已成功发送到飞书');
    } else {
      console.error('❌ 发送到飞书失败:', response.data.msg);
    }
  } catch (error) {
    console.error('❌ 发送到飞书时发生错误:', error.message);
  }
} 
