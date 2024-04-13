# Section 4: Server Actions in Great Detail

* We cannot define Server Actions in client components. However, we have options:
    1. Can define Server Action in parent server component and pass via a prop
        - In general, server components cannot pass event handlers down to client components - this is the one exception
    2. Can define server actions in a separate file (say `actions/index.ts`) with `'use server';` at the top of the file, and then import into the client component

* Option 1: One pattern for using server actions in client components, where we want to use state in addition to form values:
    ```js
    'use client';

    import * as actions from 'actions';

    function ClientComponent() {
        const [code, setCode] = useState('');

        const editSnippetAction = actions.editSnippet.bind(null, code);

        return (
            <form action={editSnippetAction}>
                <button type="submit">Submit</button>
            </form>
        )
    }
    ```

    And then the Server Action looks like this:

    ```js
    'use server';

    export async function editSnippet(code: string, formData: FormData) {
        // update snippet
    }
    ```

* Option 2: another option:
    ```js
    'use client';

    import { startTransition } from 'react';
    import * as actions from 'actions';

    function ClientComponent() {
        const [code, setCode] = useState('');

        const handleClick = () => {
            startTransition(async () => { // update state without blocking UI
                await actions.editSnippet(code);
            });
        });

        return (
            <form action={editSnippetAction}>
                <button type="submit">Submit</button>
            </form>
        )
    }
    ```

    And then the Server Action looks like this:

    ```js
    'use server';

    export async function editSnippet(code: string) {
        // update snippet
    }
    ```