import axios from 'axios';

const config = {
    name: 'جميني',
    version: '1.0',
    permissions: 0,
    credits: 'rapido',
    description: 'gemini ai with image support',
    commandCategory: 'ai',
    usages: '[text] (reply to image)',
    cooldown: 5
};


async function onCall({ message, args, getLang }) {
    const text = args.join(' ');
    if (!text) return message.reply("No question provided.");

    try {
        let imageUrl;
        if (message.messageReply?.attachments?.[0]?.type === "photo") {
            imageUrl = message.messageReply.attachments[0].url;
        }

        const api = `https://rapido.zetsu.xyz/api/gemini?chat=${encodeURIComponent(text)}&uid=${message.senderID}${imageUrl ? `&imageUrl=${encodeURIComponent(imageUrl)}` : ''}`;
        const res = await axios.get(api);
        
        message.reply(res.data.response);
    } catch (e) {
        message.reply(e);
    }
}

export default {
    config,
    onCall
};
