import 'dotenv/config';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.NOTION_API_KEY) {
  console.error('NOTION_API_KEY is not set. Check your .env file.');
  process.exit(1);
}

app.use(
  '/api/notion',
  createProxyMiddleware({
    target: 'https://api.notion.com',
    changeOrigin: true,
    pathRewrite: { '^/api/notion': '' },
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
    },
    on: {
      error: (err, req, res) => {
        res.status(502).json({ error: 'Proxy error', message: err.message });
      },
    },
  })
);

app.use(express.static(join(__dirname, 'dist')));

app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
