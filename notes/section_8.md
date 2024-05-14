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
| Option #1: In parent... | <ul><li>Easy to see what data a route needs</li><li>More reusable child components</li><li>Avoid 'n+1 problem'</li></ul> | <ul><li>Can lead to overfetcing unneeded data</li><li>Can lead to duplicate code</li><li>Writing complex TypeScript interface can be annoying</li></ul> | 
| Option #2: In child... | <ul><li>Easier to build better loading screens</li></ul> | <ul><li>Implementation is more locked in</li></ul> | 
| Option #3: xxx... | <ul><li></li></ul> | <ul><li></li></ul> | 

* xxx