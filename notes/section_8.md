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

* 