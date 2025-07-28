import express from 'express';
import { createProxyController } from 'express-simple-proxy';

const app = express();

const proxy = createProxyController({
  baseURL: 'https://api.langdock.com/openai/eu/v1',
  headers: (req) => {
    let headers = req.headers;
    // Remove 'host' header to avoid conflicts with the proxy
    delete headers.host;

    if (process.env.NODE_ENV !== 'production') {
      headers.Authorization = `Bearer ${process.env.LANGDOCK_API_KEY || ''}`;
    }

    return headers;
  }
});

app.post('/chat/completions', proxy());
app.post('/embeddings', proxy());
app.get('/models', proxy());

app.listen(3000, () => {
  console.log('Proxy server is running on http://localhost:3000');
});