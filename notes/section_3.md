# Section 3: Streaming Content with React Server Components

* **Server Actions**: have a very close integration with HTML forms, and are functions that are called with all the data submitted with a form as a means to change application data
    ```js
    async function createSnippet(formData: FormData) {
      'use server';

      // do stuff with formData...
    }
    ```
    - see `snippets/src/app/snippets/new/page.tsx` for example
    - Server actions are executed on the Next Server

* Redirects:
    ```js
    import { redirect } from 'next/navigation';

    // ...
    redirect('/');
    ```

* Server Components vs Client Components
    - **Server Components**:
        - By default, all components in Next.js are server components
        - We usually want to use server components, which provide better performance
        - Can use async/await; don't need useState or useEffect
        - Have a few limitations:
            - Cannot use any kind of hook (e.g., `useState`)
            - Cannot assign any event handlers (e.g., `<button onClick={() => console.log('hi')}>`)
    - **Client Components**:
        - To define a client component, put the string `'use client';` at the top of the component file
        - Can use hooks, event handlers, etc
        - Cannot directly show a Server Component (with one exception/work around, which we'll see later)
    - Server Components can render Client Components - the browser will make additional request to Next Server to return a JavaScript file with all the client components

* **Dynamic path**:
    - E.g., `src/app/snippets/[id]` 
        - Say visit `http://localhost:3000/snippets/123?foo=bar`
        - props = `{ params: { id: '123' }, searchParams: { foo: 'bar' } }`

* `notFound`:
    ```js
    import { notFound } from 'next/navigation';

    // ...
    if (!something) {
        return notFound();
    }
    ```

* Custom "not found" (404) page
    - E.g., `src/app/snippets/[id]/not-found.tsx`

* Custom loading page
    - loading.tsx
    - simulate a delay: `await new Promise((r) => setTimeout(r, 2000));`

* **React Monaco Editor**:
    - requires hooks + event handlers to work correctly, so we need a client component

* It's a common pattern to use a server component to fetch data and inject it into a client component
    - E.g., `SnippetEditPage` (server component, fetches snippet) -> `SnippetEditForm` (client component, includes Monaco Editor)