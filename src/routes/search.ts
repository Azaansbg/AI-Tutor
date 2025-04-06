import express from 'express';
import { VertexAI } from '@google-cloud/vertexai';
import axios from 'axios';

const router = express.Router();

// Initialize Vertex AI
const vertex_ai = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT || '',
  location: 'us-central1',
});
const model = 'gemini-pro';

// AI Search endpoint
router.post('/ai', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const generativeModel = vertex_ai.preview.getGenerativeModel({
      model: model,
      generation_config: {
        max_output_tokens: 2048,
        temperature: 0.4,
        top_p: 0.8,
        top_k: 40,
      },
    });

    const chat = generativeModel.startChat();
    const result = await chat.sendMessage(query);
    const response = result.response;

    res.json({ response: response.text() });
  } catch (error) {
    console.error('AI Search error:', error);
    res.status(500).json({ error: 'Failed to get AI response' });
  }
});

// Web Search endpoint (using Bing Web Search API)
router.post('/web', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.BING_API_KEY || '',
      },
      params: {
        q: query,
        count: 5,
        responseFilter: 'Webpages',
        textFormat: 'HTML'
      }
    });

    const results = response.data.webPages.value.map((result: any) => ({
      title: result.name,
      snippet: result.snippet,
      url: result.url
    }));

    res.json({ results });
  } catch (error) {
    console.error('Web Search error:', error);
    res.status(500).json({ error: 'Failed to get web search results' });
  }
});

export default router; 