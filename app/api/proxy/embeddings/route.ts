export async function POST(request: Request) {
  const body = await request.json();
  body.model = 'text-embedding-ada-002';
  const headers = new Headers(request.headers);
  const response = await fetch('https://api.langdock.com/openai/eu/v1/embeddings', {
    method: request.method,
    headers,
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }


  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}
