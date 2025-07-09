const config = {
    name: "رصيد",
    aliases: ["bal", "money"],
    description: "عرض رصيدك أو رصيد شخص آخر من الذهب",
    usage: "<رد / تاق / لا شيء>",
    cooldown: 5,
    credits: "XaviaTeam"
}

const langData = {
    "en_US": {
        "balance.userNoData": "❌ User not found or not ready.",
        "balance.selfNoData": "❌ Your data is not ready.",
        "balance.result": `
╔═⟪ 🪙 𝙂𝙊𝙇𝘿 𝘽𝘼𝙉𝙆 🪙 ⟫═╗
👤 Owner: You
🪙 Balance: {money} Gold
╚════════════════╝
        `.trim()
    },
    "vi_VN": {
        "balance.userNoData": "❌ Người dùng không tìm thấy/chưa sẵn sàng.",
        "balance.selfNoData": "❌ Dữ liệu của bạn chưa sẵn sàng.",
        "balance.result": `
╔═⟪ 🪙 𝙂𝙊𝙇𝘿 𝘽𝘼𝙉𝙆 🪙 ⟫═╗
👤 Chủ tài khoản: Bạn
🪙 Số dư: {money} Vàng
╚════════════════╝
        `.trim()
    },
    "ar_SY": {
        "balance.userNoData": "❌ المستخدم غير موجود أو غير جاهز.",
        "balance.selfNoData": "❌ بياناتك غير جاهزة.",
        "balance.result": `
╔═⟪ 🪙 𝙂𝙊𝙇𝘿 𝘽𝘼𝙉𝙆 🪙 ⟫═╗
👤 المالك: أنت
🪙 الرصيد: {money} ذهب
╚════════════════╝
        `.trim()
    }
}

async function onCall({ message, getLang }) {
    const { type, mentions } = message;
    const { Users } = global.controllers;
    let userBalance;

    if (type == "message_reply") {
        const { senderID: TSenderID } = message.messageReply;
        userBalance = await Users.getMoney(TSenderID);
        if (!userBalance) return message.reply(getLang("balance.userNoData"));
    } else if (Object.keys(mentions).length >= 1) {
        let msg = "";
        for (const TSenderID in mentions) {
            userBalance = await Users.getMoney(TSenderID);
            msg += `👤 ${mentions[TSenderID].replace(/@/g, '')}:\n🪙 ${global.addCommas(userBalance || 0)} ذهب\n\n`;
        }
        return message.reply(msg);
    } else {
        userBalance = await Users.getMoney(message.senderID);
        if (!userBalance) return message.reply(getLang("balance.selfNoData"));
    }

    message.reply(getLang("balance.result", { money: global.addCommas(userBalance) }));
}

export default {
    config,
    langData,
    onCall
}
