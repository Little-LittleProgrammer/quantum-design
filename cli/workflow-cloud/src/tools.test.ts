import { DocxClient } from './client/feishu-client/docx-client';
import { OpenAIClient } from './client/openai-client/openai-client';

const docxClient = new DocxClient({

});

const openaiClient = new OpenAIClient({
    apiKey: process.env.BAILIAN_API_KEY,
});

async function getWikiDocs() {
    await docxClient.getWikiBase();
    // docxClient.createWikiDocsMarkdown('测试文档');
}

getWikiDocs();
