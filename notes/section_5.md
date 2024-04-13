# Section 5: Server Forms with the UseFormState Hook

* Form validation in traditional React applications is typically easy, but with Next.js forms don't necessarily use JavaScript (e.g., when sending info to a server action)
    - So we need to communicate info from a server action back to a page
    - React-dom contains a hook called `useFormState` specifically for this
    - Given `useFormState` is a hook, we must use a client component

* Form validation with `useFormState` hook
    - The client component's form passes the form data and the form state to the ServerAction
    ```js
    const [formState, action] = useFormState(actions.createSnippet, { message: '' });

    <form action={action}>
        // ...
        {
            formState.message ? <div className="...">formState.message</div> : null
        }
    </form>
    ```

* `error.tsx` is displayed when unhandled error occurs
    - Must be a client component
    ```js
    'use client';

    interface ErrorPageProps {
        error: Error,
        reset: () => void
    }

    export default function ErrorPage({error}: ErrorPageProps) {
        return <div>{error.message}</div>
    }
    ```

* It's a bad experience to leave a form page if there's an error, so instead catch errors in the Server Action and use the `useFormState` to display an appropriate message so the user can try again

* Don't put `redirect` inside a try/catch:
    - Note: if you ever get `NEXT_REDIRECT` error message, note that `redirect` throws an error (how it's implemented), so you're catching the error thrown by the `redirect`