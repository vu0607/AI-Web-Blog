
'use server';
/**
 * @fileOverview A Genkit flow for generating images based on a text prompt.
 *
 * - generateImage - A function that handles the image generation process.
 * - GenerateImageInput - The input type for the generateImage function.
 * - GenerateImageOutput - The return type for the generateImage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {generate} from 'genkit/generate';

const GenerateImageInputSchema = z.object({
  prompt: z.string().describe('The text prompt describing the image to generate.'),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageOutputSchema = z.object({
  imageUrl: z.string().url().describe("The data URI of the generated image. Format: 'data:image/png;base64,<encoded_data>'."),
});
export type GenerateImageOutput = z.infer<typeof GenerateImageOutputSchema>;

// Exported wrapper function
export async function generateImage(input: GenerateImageInput): Promise<GenerateImageOutput> {
  return generateImageFlow(input);
}

// Define the Genkit flow
const generateImageFlow = ai.defineFlow<
  typeof GenerateImageInputSchema,
  typeof GenerateImageOutputSchema
>(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: GenerateImageOutputSchema,
  },
  async (input) => {
    console.log("Generating image with prompt:", input.prompt);

    const { media } = await generate({
      // IMPORTANT: Use the specific experimental model capable of image generation
      model: 'googleai/gemini-2.0-flash-exp',
      prompt: input.prompt,
      config: {
         // IMPORTANT: Must request both TEXT and IMAGE modalities
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });


    if (!media || !media.url) {
      console.error("Image generation failed, no media returned.");
      throw new Error('Image generation failed.');
    }

    console.log("Image generated successfully:", media.url.substring(0, 50) + "..."); // Log truncated URL

    return { imageUrl: media.url };
  }
);

// Note: No explicit prompt definition needed here as we directly use the generate function
// with the specific image generation model.
      