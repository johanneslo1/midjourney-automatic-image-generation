import signale from "signale";
import {Interaction} from "./Interaction";
import {addItemToStore, addMessagesToStorage, findItemFromStorage, findMessageFromStorage, sleep} from "./helpers";
import axios from "axios/index";

export class ImageCreator {

    public async imagine(prompt: string) {
        signale.info(`Imagine a image for prompt ${prompt}...`)
        await Interaction.imagine(prompt)
        signale.success(`Imagined a image. Sleeping for 10 seconds...`)
        await sleep(10000);
    }

    public async upscaleBaseImage(baseMessage: any): Promise<boolean> {
        // check if baseMessage was already upscaled
        const isAlreadyUpscaled = await findItemFromStorage("upscaledMessages", baseMessage.id)

        if(isAlreadyUpscaled) {
            signale.warn(`Message ${baseMessage.id} was already upscaled. Skipping...`)
            return Promise.resolve(false);
        }

        const components = baseMessage.components[0].components;

        for (const component of components) {
            await this.upscaleVariation(baseMessage, component);
        }

        await addItemToStore('upscaledMessages', baseMessage.id)


        return Promise.resolve(true)
    }

    protected async upscaleVariation(message: any, component: any) {
        signale.info(`Upscaling message ${message.id} with custom_id ${component.custom_id}...`)

        if(String(component.custom_id).includes('reroll')) {
            signale.warn(`Upscaling message ${message.id} with custom_id ${component.custom_id} is a reroll. Skipping...`)
            return Promise.resolve();
        }

        await Interaction.upscale(message.id, component.custom_id)



        signale.success(`Upscaled message ${message.id} with custom_id ${component.custom_id}. Sleeping for 10s...`);
        await sleep(10000);


    }


}