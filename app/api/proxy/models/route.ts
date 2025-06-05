export async function GET(request: Request) {
  const headers = new Headers(request.headers);
  headers.delete('content-length');
  const response = await fetch('https://api.langdock.com/assistant/v1/models', {
    method: request.method,
    headers,
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
