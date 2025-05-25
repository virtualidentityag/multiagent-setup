import { redirect } from "next/navigation"
import { auth, signIn } from "@/auth"
import { AuthError } from "next-auth"

const SIGNIN_ERROR_URL = "/error"

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined }
}) {
  const session = await auth();
  return (
    <div className="flex flex-col gap-2">
      <h1>Welcome {session?.user?.name || 'unknown'}</h1>
      <form
        action={async () => {
          "use server"
          try {
            await signIn('github', {
              redirectTo: (await props.searchParams)?.callbackUrl ?? "",
            })
          } catch (error) {
            // Signin can fail for a number of reasons, such as the user
            // not existing, or the user not having the correct role.
            // In some cases, you may want to redirect to a custom error
            if (error instanceof AuthError) {
              return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
            }

            // Otherwise if a redirects happens Next.js can handle it
            // so you can just re-thrown the error and let Next.js handle it.
            // Docs:
            // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
            throw error
          }
        }}
      >
        <button type="submit">
          <span>Sign in with Github</span>
        </button>
      </form>
    </div>
  )
}