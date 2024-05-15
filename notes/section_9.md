# Section 9: Caching with Request Memoization

* **Request memoization**: cache calls within a given request
    - this is cleared out between incoming requests
    - automatically used with built-in `fetch` functions
    - can be used with other functions (like db queries) by using the `cache` function
    - convert from:
        ```js
        export function fetchCommentsByPostId(postId: string): Promise<CommentWithAuthor[]> { 
            ... 
        }
        ```
        to:
        ```js
        import { cache } from 'react';
        
        export const fetchCommentsByPostId = cache((postId: string): Promise<CommentWithAuthor[]> => {
            ...
        });
        ```