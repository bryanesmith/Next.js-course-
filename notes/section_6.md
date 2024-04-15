# Section 6: Understanding Next's Caching System

- to simulate production locally:
    ```sh
    % npm run build
    % npm run start # as opposed to: npm run dev
    ```

- Next provides 4 different caching systems:

| Cache | Description |
| ----- | ----------- |
| data cache | Responses from requests made with 'fetch' are stored and used across requests |
| router cache | 'Soft' navigation between routes are cached in the browser and reused when a user revisits a page |
| request memoization | When make two or more 'GET' requests with 'fetch' during a user's request to server, only one 'GET' is executed |
| full route cache | **At build time**, Next.js decides if your route is **static** or **dynamic**. If it is static, the page is rendered and the result is stored. In productin, users are given this pre-rendered result. |

- Due to the **full route cache**, the behavior of proudction system is different from development server
    - If Next.js believe a page is static, it'll render the page into an HTML file **at build time**
    - You can see whether Next.js treats a page as static or build when you run `npm run build`:
        ```sh
        ┌ ○ /                                    178 B          91.3 kB
        ├ ○ /_not-found                          882 B          85.2 kB
        ├ λ /snippets/[id]                       178 B          91.3 kB
        ├ λ /snippets/[id]/edit                  5.01 kB        89.3 kB
        └ ○ /snippets/new                        773 B          85.1 kB
        ...

        ○  (Static)   prerendered as static content
        λ  (Dynamic)  server-rendered on demand using Node.js
        ```

* **By default, routes are static**. There are a few things that will flag a route as dynamic:
    - Using dynamic functions (e.g., `cookies.set()`, `useSearchParams()`)
    - Using route segment config (e.g., `export const dynamic = 'force-dynamic';`)
    - Using 'fetch' and opting out of caching of response (e.g., `fetch('...', {next: {revalidate: 0} })`)
    - Using dynamic route (e.g., `/snippets/[id]/page.tsx`)

* To force a route to be dynamic, put this at the top of your page (underneath imports):
    ```js
    export const dynamic = 'force-dynamic';
    ```

* 3 ways to control caching: 

| Solution | Description | Implementation |
| ----- | ----- | ----- |
| Time-based caching | Refresh data in fixed time intervals | `export const revalidate = 3;` |
| On-demand caching | Force refresh of cache (e.g., after changing data) | `import { revalidatePath } from "next/cache";` <br/> `revalidatePath('/snippets');` |
| Disable caching | option #1: `export const revalidate = 0;` <br /> option #2: `export const dynamic = "force-dynamic";` |

* Implement function `generateStaticParams` to cache a collection of instances of a dynamic page at build time 
    - e.g., generate `/snippets/1`, `/snippets/2`, and `/snippets/3` at build time for dynamic path `/snippets/[id]`
    - Add this to the bottom of your file:
        ```js
        export async function generateStaticParams() {
            const snippets = await db.snippet.findMany();
            return snippets.map((snippet) => {
                return {
                    id: snippet.id.toString(), // Must be a string
                };
            });
        }
        ```
    - You should see something like this when you run `npm run build`:
        ```sh
        Route (app)                              Size     First Load JS
        ┌ ○ /                                    178 B          91.3 kB
        ├ ○ /_not-found                          882 B          85.2 kB
        ├ ● /snippets/[id]                       178 B          91.3 kB
        ├   ├ /snippets/1
        ├   ├ /snippets/3
        ├   ├ /snippets/5
        ├   └ /snippets/7
        ├ λ /snippets/[id]/edit                  5.01 kB        89.3 kB
        └ ○ /snippets/new                        773 B          85.1 kB
        ...

        ○  (Static)   prerendered as static content
        ●  (SSG)      prerendered as static HTML (uses getStaticProps)
        λ  (Dynamic)  server-rendered on demand using Node.js
        ```