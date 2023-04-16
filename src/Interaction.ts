import axios from "axios";
import signale from "signale";
import {addMessagesToStorage} from "./helpers";
require('dotenv').config();

export class Interaction {
    protected static getConfig() {
        return {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36',
                'Authorization': process.env.DISCORD_AUTHORIZATION_TOKEN,
            }
        }
    }


    public static async getMidjoruneyMessages() {
        signale.info(`Getting messages...`)

        const {data} = await axios.get(`https://discord.com/api/v9/channels/${process.env.CHANNEL_ID}/messages?limit=50`, this.getConfig());


        let items = data
            .filter((message: any) => message.author.id === '936929561302675456');

        signale.info(`Got ${    items.length} messages.`)

        return items;


    }

    public static async upscale(messageId: string, customId: string) {
        return axios.post('https://discord.com/api/v9/interactions', {
            type: 3,
            guild_id: process.env.GUILD_ID,
            channel_id: process.env.CHANNEL_ID,
            message_flags: 0,
            message_id: messageId,
            application_id: "936929561302675456",
            session_id: "0633d30d07fbbb5788e91cbb470ba73d",
            data: {
                component_type: 2,
                custom_id: customId
            }
        }, this.getConfig())
    }

    public static imagine(prompt: string) {
        return axios.post('https://discord.com/api/v9/interactions', {
            type: 2,
            application_id: "936929561302675456",
            guild_id: process.env.GUILD_ID,
            channel_id: process.env.CHANNEL_ID,
            session_id: "2fb980f65e5c9a77c96ca01f2c242cf6",
            data: {
                version: "1077969938624553050",
                id: "938956540159881230",
                name: "imagine",
                type: 1,
                options: [
                    {
                        type: 3,
                        name: "prompt",
                        value: prompt + ' --ar 16:9'
                    }
                ],
                application_command: {
                    id: "938956540159881230",
                    application_id: "936929561302675456",
                    version: "1077969938624553050",
                    default_permission: true,
                    default_member_permissions: "None",
                    type: 1,
                    nsfw: false,
                    name: "imagine",
                    description: "Create images with Midjourney",
                    dm_permission: true,
                    options: [
                        {
                            type: 3,
                            name: "prompt",
                            description: "The prompt to imagine",
                            required: true
                        }
                    ]
                }
            }
        }, this.getConfig());
    }


    public static async  getBaseMessages(messages: any[]) {

        const baseMessages = messages.filter((message: any) => {
            // check if any of the components have a label of U1
            return message.components[0]?.components?.find((component: any) => component.label === 'U1');
        });

        signale.info('%s are base messages', baseMessages.length)

        await addMessagesToStorage("baseMessages", messages);


        return baseMessages;
    }

}





