import { createAliyunProvider, AliyunModels, aiHub } from '../dist/ai-hub.esm.min.js';
/**
 * 简单测试 AI Hub 构建包
 */

// 测试 CommonJS 导入

console.log('🧪 测试 AI Hub 包...');

// 测试基本导入
console.log('✅ 成功导入 createAliyunProvider:', typeof createAliyunProvider);
console.log('✅ 成功导入 AliyunModels:', typeof AliyunModels);
console.log('✅ 成功导入 aiHub:', typeof aiHub);

// 测试模型枚举
console.log('✅ 支持的模型:', Object.values(AliyunModels));

// 测试创建供应商（不需要真实 API Key）
try {
    const provider = createAliyunProvider({
        apiKey: 'test-key',
        modelName: AliyunModels.QWenTurbo,
    });
    console.log('✅ 成功创建 AliyunProvider:', typeof provider);
    console.log('✅ 支持的方法:', Object.getOwnPropertyNames(Object.getPrototypeOf(provider)));
} catch (error) {
    console.log('❌ 创建供应商失败:', error.message);
}

// 测试 AI Hub 注册
try {
    const provider = createAliyunProvider({
        apiKey: 'test-key',
        modelName: AliyunModels.QWenTurbo,
    });

    aiHub.register('test-aliyun', provider);
    console.log('✅ 成功注册供应商到 AI Hub');
    console.log('✅ 已注册的供应商:', aiHub.getProviderNames());
} catch (error) {
    console.log('❌ 注册供应商失败:', error.message);
}

console.log('�� AI Hub 包测试完成！');
