## Setting Up the Project

To get started with the project, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd langdock-proxy
   ```

2. **Install Dependencies**:
   Use your preferred package manager to install the required dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the root directory and configure the necessary environment variables. Refer to the `.env` file for the required variables.

4. **Run the Development Server**:
   Start the development server:
   ```bash
   npm run dev
   ```

5. **Database Setup**:
   - Ensure you have a PostgreSQL database running.
   - Update the `DATABASE_URL` in the `.env.example` file with your database connection string.
   - Run the Prisma migrations to set up the database schema:
     ```bash
     npx prisma migrate dev
     ```

## Key Features

1. **Authentication**:
   - The project uses `next-auth` for authentication. Configuration is located in `auth.config.ts`.
   - Middleware in `middleware.ts` ensures protected routes redirect unauthenticated users to the login page.

2. **Proxy API**:
   - Proxy routes under `app/api/proxy` handle requests to external services like OpenAI APIs.
   - Example: `app/api/proxy/chat/completions/route.ts` forwards chat completion requests securely.

3. **Frontend Components**:
   - Reusable UI components are located in the `components` directory.
   - Example: `components/message-list.tsx` renders a list of chat messages.

4. **Database Integration**:
   - Prisma is used as the ORM for database interactions.
   - Models and schema are defined in `prisma/schema.prisma`.
   - Generated Prisma client is located in `lib/prisma/generated`.

## Development Guidelines

1. **Code Style**:
   - Follow the ESLint rules defined in `eslint.config.mjs`.
   - Use Prettier for consistent formatting.

2. **Commit Messages**:
   - Follow the conventional commit format:
     ```
     <type>: <description>
     ```

3. **Pull Requests**:
   - Provide a clear description of the changes.

## Troubleshooting

1. **Common Issues**:
   - **Environment Variables Missing**: Ensure `.env` is properly configured.
   - **Database Connection Errors**: Verify the `DATABASE_URL` and ensure the database is running.

2. **Debugging**:
   - Use the browser's developer tools for frontend issues.
   - Add `console.log` statements or use a debugger for backend issues.

3. **Logs**:
   - Check server logs in the terminal for errors.
   - Use Prisma's query logging for database-related issues.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)