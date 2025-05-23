const authMiddleware = async (request: Request) => {
  if (request.url.includes('/portal/')) {
    const auth = await fetch('/api/auth/check');
    if (auth.status === 401) {
      return Response.redirect('/login');
    }
  }
};

export default async function middleware(request: Request) {
  const middlewares = [
    authMiddleware,
  ];
  for (const middleware of middlewares) {
    const response = await middleware(request);
    if (response) {
      return response;
    }
  }
}