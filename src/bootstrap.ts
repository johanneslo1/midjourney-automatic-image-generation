import storage from "node-persist";

(async () => {
        await storage.init({
            dir: 'persist',
            stringify: JSON.stringify,
            parse: JSON.parse,
        });
    }
)()