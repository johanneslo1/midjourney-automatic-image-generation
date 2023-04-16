import {Interaction,} from "./src/Interaction";
import {addItemToStore, addMessagesToStorage, extractTitle, findItemFromStorage, sleep} from "./src/helpers";
import './src/bootstrap';
import signale, {Signale} from "signale";
import {ImageCreator} from "./src/ImageCreator";
import axios from "axios";
import sharp from "sharp";
import piexif from "piexifjs";
import {generatePrompts} from "./src/PromptGenerator";

const imageCreator = new ImageCreator();


async function createBaseImages() {

    const prompts = await generatePrompts();

    for (const prompt of prompts) {
        await imageCreator.imagine(prompt);
    }
}


async function saveUpscaledImages(messages: any[]) {
    const alreadyUpscaledMessages = messages.filter((message: any) => {
        // check if any of the components have a label of U1
        return message.components[0]?.components?.find((component: any) => component.label === 'Web');
    });

    signale.info('%s are already upscaled messages', alreadyUpscaledMessages.length);


    const urls = alreadyUpscaledMessages.map((message: any) => message.attachments[0]?.url);

    signale.success('Here are the already upscaled images: %s', urls)


    for (const alreadyUpscaledMessage of alreadyUpscaledMessages) {
        const filePath = `images/${alreadyUpscaledMessage.id}.png`;

        if (await findItemFromStorage('savedImages', filePath)) {
            signale.warn(`Image ${filePath} was already saved. Skipping...`)
            continue;
        }

        const url = alreadyUpscaledMessage.attachments[0]?.url;

        const input = (await axios({url, responseType: "arraybuffer"})).data;

        await sleep(1000);

        // Bild mit Sharp verarbeiten
        const image = await sharp(input);

        const jpg = await image.toFormat('jpg')

        // Bild in einen Buffer konvertieren
        const imageBuffer = await jpg.toBuffer();
        const dataUrl = 'data:image/jpeg;base64,' + imageBuffer.toString('base64');

        // EXIF-Metadaten aus dem Bild extrahieren
        const exifObj = piexif.load(dataUrl);

        // Copyright-Informationen hinzufügen
        // exifObj['0th'][piexif.ImageIFD.Artist] = 'Bevnt';
        // exifObj['0th'][piexif.ImageIFD.Copyright] = 'Bevnt';
        exifObj['0th'][piexif.ImageIFD.ImageDescription] = extractTitle(alreadyUpscaledMessage.content);
        // exifObj['0th'][piexif.ImageIFD.XPTitle] = 'Ihr Bildtitel';

        // Aktualisierte EXIF-Metadaten in einen Puffer schreiben
        const exifBytes = piexif.dump(exifObj);
        const updatedImageData = piexif.insert(exifBytes, imageBuffer.toString('binary'));

        // Bild mit aktualisierten EXIF-Metadaten speichern
        await sharp(Buffer.from(updatedImageData, 'binary'))
            .withMetadata()
            .toFile(filePath);

        await addItemToStore('savedImages', filePath);
        signale.success(`Saved image to ${filePath}`)

    }
}


(async () => {

    const interactive = new Signale({interactive: true});

    let counter = 0;
    // await createBaseImages();



    while (true) {

        const messages = await Interaction.getMidjoruneyMessages();
        await saveUpscaledImages(messages);

        const baseMessages = await Interaction.getBaseMessages(messages);

        if(baseMessages.length === 0) {
            counter = counter + 10;
        }


        for (const message of baseMessages) {
            const status = await imageCreator.upscaleBaseImage(message);

            if (status) {
                counter = 0;
            } else {
                counter++;
            }
        }
        interactive.info(`No images to upscale %s/40`, counter)


        if(counter > 30) {
            interactive.complete(`Start to create new base images`);
            await createBaseImages();
        }

        await sleep(10000);
    }


})();


