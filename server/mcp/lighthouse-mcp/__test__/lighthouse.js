import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import fs from 'fs';

async function main() {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
        port: chrome.port,
        formFactor: 'mobile',
    };
    const result = await lighthouse('https://www.baidu.com', options);
    await chrome.kill();
    // 写入到文件
    fs.writeFileSync('lighthouse.json', JSON.stringify(result, null, 2));
}

main();
