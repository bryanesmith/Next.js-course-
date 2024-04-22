# Section 7: Authentication with Next-Auth

* Libraries we'll use for `discuss`
    1. **Prisma**
    2. **nextui**: component library designed to work with Tailwind
    3. **authjs** (previously known as **next-auth**): signing users up and in. (We're going to use it with GitHub OAuth) 

* To install and configure nextui
    1. `npm install --save-exact @nextui-org/react@2.2.9 framer-motion`
    2. Update `tailwind.config.ts`:
        ```js
        // ...
        import { nextui } from '@nextui-org/react';

        // ..., within Config.content:
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",

        // ...
        darkMode: "class",
        plugins: [nextui()],
        ```
    3. Create `src/app/providers.tsx`:
        ```js
        'use client';

        import { NextUIProvider } from '@nextui-org/react';

        interface ProvidersProps {
            children: React.ReactNode
        }

        export default function Providers( {children}: ProvidersProps ) {
            return <NextUIProvider>{children}</NextUIProvider>;
        }
        ```
    4. Update `layout.tsx`:
        ```js
        import Providers from "@/app/providers";

        // ...
        return (
            <html lang="en">
                <body className={inter.className}>
                    <Providers>
                        {children}
                    </Providers>
                </body>
            </html>
        );
        ```

* What is a "provider"? ([source](https://react.dev/learn/passing-data-deeply-with-context))
    - **Context** allows a parent component to make some information available to any component in the tree below it - no matter how deep - witout passing it explicitly through props
    - **lifting state up**: when you want two components to share state, so you move the state up to the nearest common ancestor
    - **prop drilling**: when passing state through the props of 1+ intermediate layers of components that don't use it in order to pass it into a component that does consume it
    - To use context:
        1. **Create** a context:
            ```js
            import { createContext } from 'react';

            export const LevelContext = createContext(1);
            ```
        2. **Use** context :
            ```js
            import { useContext } from 'react';
            import { LevelContext } from './LevelContext.js';

            // ... from within the component, use the `useContext` hook
            const level = useContext(LevelContext);
            ```
        3. **Provide** that context:
            ```js
            import { LevelContext } from './LevelContext.js';

            export default function Section({ level, children }) {
                return (
                    <section className="section">
                        <LevelContext.Provider value={level}>
                            {children}
                        </LevelContext.Provider>
                    </section>
                );
            }
            ```
* To install and configure Prisma:
    1. `npm install prisma`
    2. Initialize `prisma/`: `npx prisma init --datasource-provider sqlite`
    3. Edit `prisma/schema.prisma` to include necessary models (tables)
        - The `Account`, `Session`, `User`, `VerificationToken` models are hard requirements of authjs
        - The `Topic`, `Post`, `Comment` models are for our application
    4. Create database: `npx prisma migrate dev`
    5. Create `src/db` folder and create `src/db/index.ts`:
        ```js
        import { PrismaClient } from "@prisma/client";

        export const db = new PrismaClient();
        ```

* Auth setup:
    1. Create an Oauth app and generate a client_id and client_secret at https://github.com/settings/applications/new
        - Application name: DEV Discuss
        - Homepage URL: http://localhost:3000
        - Authorization callback URL: http://localhost:3000/api/auth/callback/github
    2. Add `AUTH_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` to a `.env.local` file
    3. Install these packages: `@auth/core@0.18.1`, `@auth/prisma-adapter@1.0.6`, `next-auth@5.0.0-beta.3`
        - `npm install --save-exact @auth/core@0.18.1 @auth/prisma-adapter@1.0.6 next-auth@5.0.0-beta.3`
    4. Make a `auth.ts` file in `src` folder. Set up `NextAuth` and the `PrismaAdapter` in there
    5. Set up the `app/api/auth/[...nextauth]/route.ts` file to handle the requests between GitHub's servers and our server
    6. Make server action to sign in/sign out the user (Optional, but highly recommended)

* How OAuth works:
    1. User wants to sign up! Redirect them to GitHub with our `client_id`
        - `github.com/login/oauth/authorize?client_id=123`
    2. GitHub asks user if they're OK sharing information with our app. If so, they get redirected back to our server
        - `localhost:300/api/auth/github/callback?code=456`
    3. Our server takes the `code` off the request and makes a follow up request to GitHub
        - `github.com/login/oauth/access_token` w/ `{ clientId, clientSecret, code }`
    4. GitHub makes sure the `clientId`, `clientSecret`, and `code` are valid, then responds with an `access_token`:
        - `access_token=abc123`
    5. We make another request with the `access_token` to get details about this user - their name, email, etc.
        - `api.github.com/user` w/ `Authorization: Bearer abc123`
    6. GitHub responds with the user's profile
        - `{name, email, avatar }`
    7. We create a new 'User' record in the database
    8. We send a cookie back to the user's browser, which will be included with all future requests automatically. That cookie tell us who is making a request to our server

* Whenever using authentication, we'll want to validate four things:
    1. sign in/sign up:
        ```js
        import * as actions from '@/actions';
        
        export default function Page() {
            return (
                <form action={actions.signIn}>
                    <button type="submit">Sign Up</button>
                </form>
            );
        }
        ```
    2. sign out:
        ```js
            import * as actions from '@/actions';

            export default function Page() {
                return (
                    <form action={actions.signOut}>
                        <button type="submit">Sign Out</button>
                    </form>
                );
            }
        ```
    3. check whether user is signed in from a server component:
        ```js
        import { auth } from '@/auth';

        export default async function Page() {
            const session = await auth();

            if (session?.user) {
                return <div>Signed In!</div>
            } else {
                return <div>Signed out</div>
            }
        }
        ```
    4. check whether user is signed in from a client component. First, setup a `SessionProvider` in `providers.tsx`, and then:
        ```js
        'use client';

        import { useSession } from 'next-auth/react';

        export default function Profile() {
            const session = useSession();

            if (session.data?.user) {
                return <div>Signed In!</div>
            } else {
                return <div>Signed out</div>
            }
        }
        ```

* Recommended approach for planning an application design:
    1. Identify all the different routes you want your app to have, and the data that each shows
    2. Make 'path helper' function
    3. Create your routing folders + page.tsx files based on step #1
    4. Identify the places where data changes in your app
    5. Make empty server actions for each of those
    6. Add in comments on what ptahs you'll need to revalidate for each server action

* Sample application design plan:
    | Page Name | Path | Data |
    | --------- | ---- | ---- |
    | Home      | /    | Many posts, many topics |
    | Topic Show | /topics/[slug] | A single topic with many posts |
    | Create a Post | /topics/[slug]/posts/new | A single topic with many posts |
    | Show a Post | /topics/[slug]/posts/[postId] | A single post and many comments |

* **Slug**: a URL-safe name

* **Path Helpers**: set of functions that return the routes. Used to centrally manage the paths in one place.

* Using the 3rd party library **Zod** for validating strings, arrays, etc:
    ```js
    import { z } from 'zod';

    const createTopicSchema = z.object({
        name: z.string().min(3).regex(/^[a-z-]+$/),
        description: z.string().min(10),
    });

    // {
    //      success: true,
    //      data: {
    //          name: 'javascript',
    //          description: 'a place to talk about JS',
    //      }
    // }
    //
    // Or:
    //
    // {
    //      success: false,
    //      error: [
    //          issues: [ ... ]
    //      ]
    // }

    response = z.safeParse(someData); 

    // Convenient way to access list of errors per form element
    if (!result.success) {
        console.log(result.error.flatten().fieldErrors);
    }
    ```