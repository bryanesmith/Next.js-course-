# Section 8: Using Data - Database Queries

* Using the `useFormStatus` hook for showing spinners (note: should be used from a component that is child of the form component):
    ```js
    'use client';

    import { useFormStatus } from "react-dom";
    import { Button } from '@nextui-org/react';

    interface FormButtonProps {
        children: React.ReactNode;
    }

    export default function FormButton({children}: FormButtonProps) {
        const { pending } = useFormStatus();

        return (
            <Button type="submit" isLoading={pending}>
                {children}
            </Button>
        );
    }
    ```

* Should I put fetch calls in parent components or child components?

|      | Pros | Cons |
| ---- | ---- | ---- |
| **Option #1**: Fetch data in parent... | <ul><li>Easy to see what data a route needs</li><li>More reusable child components</li><li>Avoid 'n+1 problem'</li></ul> | <ul><li>Can lead to poor performance</li><li>Can lead to (slightly) overfetcing unneeded data</li><li>Can lead to duplicate code</li><li>Writing complex TypeScript interface can be annoying</li></ul> | 
| **Option #2**: Fetch data in child... | <ul><li>Easier to build better loading screens</li></ul> | <ul><li>Implementation is more locked in</li></ul> | 
| **Option #3**: Parent injects query function to child... | <ul><li></li></ul> | <ul><li></li></ul> | 

* E.g., here are our parents and children components:

| Parent | Children |
| ------ | -------- | 
| <ul><li>`TopicShowPage`: display all the posts for given topic</li><li>`HomePage`: displays top posts</li></ul> | <ul><li>`PostList`: accepts `fetchData` method to fetch posts, and then displays posts</li></ul> |

* Steps to inject query function from the parent to the child (option #3):
    1. Create a query functions file to separate out the queries from parent and child:
        ```js
        type PostWithData = (Post & { // pattern: use union operator to add fields to existing class
            topic: { slug: string },
            _count: { comments: number },
            user: { name: string }
        })

        // say we're on a topic page and all posts have same slug
        export function fetchPostsBySlug(slug: string): Promise<PostWithData[]> {

        }

        // say we're on the home page and want to show top posts
        export function fetchTopPosts(): Promise<PostWithData[]> {

        }
        ```

    2. Add interface for query function to the child component's props (e.g., for the `PostList` component, add `fetchData` to `PostListProps`):
        ```js
        interface PostListProps {
            fetchData: () => Promise<PostWithData[]>
        }
        ```

    3. Inside parent components `TopicShowPage` and `HomePage`, inject the appropriate fetch components to child element:
        ```js
        import { fetchPostsBySlug } from 'queries/posts';
        import PostList from './post-list';

        export default function TopicShowPage({ params: { slug }}) {
            return <PostList fetchData={() => fetchPostsBySlug(slug)} />
        }
        ```
        ```js
        import { fetchTopPosts } from 'queries/posts';
        import PostList from './post-list';

        export default function HomePage() {
            return <PostList fetchData={fetchTopPosts} />
        }
        ```
* Don't over do the above pattern; if a child component isn't likely to be reused, just fetch the data in the child component (option #2)

* You can automatically generating type information if typing it out is a hassle. E.g.,
    - Instead of this:
        ```js
        export type PostWithData = (
            Post & {
                topic: { slug: string };
                user: { name: string | null };
                _count: { comments: number };
            }
        )

        export function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> { ... }
        ```
    - Could do this:
        ```js
        export type PostWithData = Awaited<ReturnType<typeof fetchPostsByTopicSlug>>[number];

        export function fetchPostsByTopicSlug(slug: string) { ... }
        ```

* Components can recursively call themselves (e.g., `CommentShow`)