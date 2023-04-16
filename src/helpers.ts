import storage from "node-persist";


export function sleep(ms = 0) {
    return new Promise(r => setTimeout(r, ms));
}

export async function addItemToStore(key: string, value: any) {
    const items = await storage.getItem(key) || []; // Wenn es noch keine Items gibt, dann ein leeres Array verwenden
    items.push(value); // Den neuen Wert zum Array hinzufügen
    await storage.setItem(key, items); // Das aktualisierte Array im Storage speichern
}

export async function addMessagesToStorage(storageKey: string, messages: object[]) {
    // @ts-ignore
    const storageMessages =  await storage.getItem(storageKey);

    // add messages if not present in storage by id
    const newMessages = messages.filter((message: any) => {
        return !storageMessages?.find((storageMessage: any) => storageMessage.id === message.id);
    });

    for (const item of newMessages) {
        await addItemToStore(storageKey, item)
    }
}


export async function findMessageFromStorage(storageKey: string, messageId: string) {
    const storageMessages =  await storage.getItem(storageKey) || [];

    return storageMessages?.find((storageMessage: any) => storageMessage.id === messageId);
}

export async function findItemFromStorage(storageKey: string, item: string) {
    const storageItems =  await storage.getItem(storageKey) || [];

    return storageItems?.find((storageItem: any) => storageItem === item);
}

export function extractTitle(text: string, maxLength = 200) {
    const regex = /^([\s\S]*?)(?=\s*--|$)/; // regulärer Ausdruck, um Text vor "--" zu extrahieren
    const match = text.match(regex);

    if (match && match[1]) {
        return String(match[1]).slice(0, maxLength).replaceAll('**', '').trim();
    } else {
        return null;
    }
}