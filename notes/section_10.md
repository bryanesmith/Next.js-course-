# Section 10: Implementing Search Functionality

* **Content streaming**: React's `Suspense` component enables us to stream components as they are rendered, to improve load times
    - Before: 
        ```js
        export default async function PostShowPage({ params }: PostShowPageProps) {
            const { slug, postId } = params;
            return (
                <div className="space-y-3">
                    ...
                    <PostShow postId={postId} />
                    ...
                </div>
            );
        }
        ```
    * After:
        ```js
        import { Suspense } from 'react';

        //...

        export default async function PostShowPage({ params }: PostShowPageProps) {
            const { slug, postId } = params;
            return (
                <div className="space-y-3">
                    ...
                    <Suspense fallback={<div>Loading...</div>}>
                        <PostShow postId={postId} />
                    </Suspense>
                    ...
                </div>
            );
        }
        ```
* **Loading skeleton**: gray box placeholders shown while content is loading
    - From `post-show-loading.tsx`:
        ```js
        import { Skeleton } from "@nextui-org/react";

        export default function PostShowLoading() {
            return (
                <div className="m-4">
                    <div className="my-2">
                        <Skeleton className="h-8 w-48" />
                    </div>
                    <div className="p-4 border rounded space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                </div>
            );
        }
        ```

* Two options for dealing with **query strings** in Next.js:
    1. Passing query params to a component in the `searchParams` prop:
        ```js
        interface SearchPageProps {
            searchParams: {
                term: string;
            }
        }

        function SearchPage({searchParams}: SearchPageProps) {
            return <div>{searchParams.term}</div>;
        }
        ```

    2. Use `useSearchParams`:
        ```js
        'use client';

        import { useSearchParams } from 'next/navigation';

        function SearchInput() {
            const searchParams = useSearchParams();
            return <div>{searchParams.term}</div>;
        }
        ```

* Couple gotchas when using query strings in Next.js:
    1. Wrap client components using `useSearchParams` in a `Suspense` component (or you'll get strange build time warnings)
    2. Any thing using `searchParams` prop means the route is dynamic and hence not pregenerated (cached)