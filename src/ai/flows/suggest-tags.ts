// The directive tells the Next.js runtime that the code should only be executed on the server.
'use server';

/**
 * @fileOverview A flow for suggesting tags for a blog post based on its content.
 *
 * - suggestTags - A function that handles the tag suggestion process.
 * - SuggestTagsInput - The input type for the suggestTags function.
 * - SuggestTagsOutput - The return type for the suggestTags function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  blogContent: z.string().describe('The content of the blog post.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the blog post.'),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {
    schema: z.object({
      blogContent: z.string().describe('The content of the blog post.'),
    }),
  },
  output: {
    schema: z.object({
      tags: z.array(z.string()).describe('An array of suggested tags for the blog post.'),
    }),
  },
  prompt: `You are a blog post tag suggestion expert.

  Given the content of a blog post, you will suggest relevant tags that can be used to categorize the post.
  The tags should be concise and relevant to the main topics discussed in the blog post.

  Blog Post Content: {{{blogContent}}}

  Suggest at least 5 tags.`,
});

const suggestTagsFlow = ai.defineFlow<
  typeof SuggestTagsInputSchema,
  typeof SuggestTagsOutputSchema
>(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
