export async function GET(request: Request) {

  const models = await fetch('https://api.langdock.com/assistant/v1/models', {
    method: request.method,
    headers: request.headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    })
    .catch((error) => {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    })
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
  return new Response(JSON.stringify(models), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
