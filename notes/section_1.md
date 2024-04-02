# Section 1: Get Started Here! 

* Technologies: nvm, Node.js (v20.12.0), which includes `npm` and `npx`
    - **npx**: npm package runner
    - **create-next-app**: 14.1.4

* Generate project:
    ```sh
    % npx create-next-app@latest
    ```

* Start development server:
    ```sh
    % npm run dev   # runs: next dev
    ```

* webpack hot update (auto-updates UI on save without reload)

* Next.js' file-based routing
    - `src/app` is a special folder, where files and folders determine routes
    - `page.tsx` must always return JSX (and name of component doesn't matter)
    - E.g., `src/app/performance/page.tsx` -> `http://localhost:3000/performance/`

* Sample **page.tsx** file:
    ```js
    export default function HomePage() {  // name doesn't matter
        return <h1>Home Page</h1>;
    }
    ```

* `Link` component:
    ```js
    import Link from 'next/link';
    ```

* `globals.css`

* Layouts with `layout.tsx`

* Put reusable **components** outside the `app/` directory
    - e.g., `src/components`, `src/apps`

* absolute path imports:
    ```js
    import Header from '@/components/header';   // '@' refers to src/
    ```

* `public/` for static assets (e.g., images)

* `Image` component
    * optimizes performance by making automatically generating several resized images and sends correct one based on device screensize (caching after first request)
    ```js
    import Image from 'next/image';
    import homeImg from 'public/home.jpg'

    export default function HomePage() {
        return (
            <Image alt="my description" src={homeImg} />
        )
    }
    ```

* **Layout shifting**: When content loading shifts content around. It's annoying.
    - In Chome Developer toolbar > Network tab > "No throttling" dropdown, select "Slow 3G"

* How to size an `Image`, which prevents layout shifting:
    1. If using local image, dimensions are taken from import image
    2. Use a `height`, `width` property on `Image` component
    3. Use `fill` property for the image to fill parent container

* **Hero images**: large images with text over them

* Deploying production to **Vercel**, the company that created Next.js
    ```sh
    % npx vercel
    ```