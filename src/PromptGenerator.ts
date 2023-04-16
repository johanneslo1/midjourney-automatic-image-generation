import {Configuration, OpenAIApi} from "openai";
import {addItemToStore} from "./helpers";
import signale from "signale";
require('dotenv').config();

export async function generatePrompts(): Promise<string[]> {


    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
        organization: process.env.OPENAI_ORGANIZATION
    });
    const openai = new OpenAIApi(configuration);

    signale.info('Creating completion...');

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: 'system',
                content: `You are an expert at creating prompts for generating Midjoruney V5 images. Provide 5 different prompts to generate 5 distinct images. The images must appear photorealistic as if taken with a camera. The scene descriptions must be detailed, creative, and rich. Do not modify the parameters following the description. The prompts will be in English.\n\nFor example: "1. [prompt]"\n\nPlease provide 5 prompts for generating photorealistic images.`
               },
            // {role: 'user', content: ''}
        ]
    });

    signale.success('Created completion.');

    const message = completion.data.choices[0].message.content;
    // signale.info('Got message: %s', message);

    await addItemToStore('message', message)

    const prompts = message.split('\n').filter(text => text.trim() !== '').map(text => text.replace(/^\d+\.\s+/, '').replace('"', ''));

    signale.info('Got prompts: %s', prompts);
    await addItemToStore('prompts', prompts)

    return prompts;
}
