import { redirect } from 'next/navigation';
import { db } from '@/db';

export default function SnippetCreatePage() {
    async function createSnippet(formData: FormData) {
      // Next.js directive to specify server action 
      'use server';

      // Check the user's input and make sure it's valid
      const title = formData.get('title') as string; // based on 'name' property of input
      const code = formData.get('code') as string;
      
      // Create a new record in the database
      const snippet = await db.snippet.create({
        data: {
          title,
          code,
        }
      });
      console.log(snippet);

      // Redirect the user back to the root route
      redirect('/');
    }

    return (
      <form action={createSnippet}>
        <h3 className="font-bold m-3">Create a Snippet</h3>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <label className="w-12" htmlFor="title">Title</label>
            <input 
              name="title"
              className="border rounded p-2 w-full"
              id="title"
            />
          </div>

          <div className="flex gap-4">
            <label className="w-12" htmlFor="code">Code</label>
            <textarea 
              name="code"
              className="border rounded p-2 w-full"
              id="code"
            />
          </div>

          <button type="submit" className="rounded p-2 bg-blue-200">Create</button>
        </div>
      </form>
    );
  }
  