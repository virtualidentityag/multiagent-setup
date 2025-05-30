export async function POST(request: Request) {
  const body = await request.json();
  delete body.n;
  delete body.stream_options;
  delete body.parallel_tool_calls;
  const headers = new Headers(request.headers);
  headers.delete('content-length');
  const response = await fetch('https://api.langdock.com/openai/eu/v1/chat/completions', {
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
