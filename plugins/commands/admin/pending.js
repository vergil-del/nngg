const config = {
    name: "موافقة",
    description: "Approve or deny a pending message",
    usage: "",
    cooldown: 3,
    permissions: [2],
    credits: "XaviaTeam",
    isAbsolute: true
};

const langData = {
    "ar_SY": {
        "invalidIndexes": "فهارس غير صالحة",
        "successDeny": "تم الرفض بنجاح {success} مجموعة",
        "failDeny": "فشل في رفض المجموعات التالية:\n{fail}",
        "denied": "عذرًا، تم رفض مجموعتك من قبل الإدارة.",
        "successApprove": "تمت الموافقة بنجاح على {success} مجموعة",
        "failApprove": "فشل في الموافقة على المجموعات التالية:\n{fail}",
        "approved": `
✵───────⭓ تمت الموافقة ⭓───────✵

✨ تمّت الموافقة على هذه المجموعة بنجاح 🎉

🤖 اسم البوت: {botname}
🔧 الإصدار: {version}
📚 لعرض جميع الأوامر: اكتب {prefix}اوامر

👑 المطور: ᏉᎬᏒᎶᎥᏞ ᏕᏢᎯᏒᎠᎯ
🔗 حساب المطور:
https://www.facebook.com/mozan50sama

💫 تمتع باستخدام البوت ولا تنسى الصلاة على النبي ﷺ

✵───────⭓ 𝑴𝒐𝒛𝒂𝒂𝒏 𝒅𝒆𝒎𝒐𝒏 𝒌𝒊𝒏𝒈 ⭓───────✵
        `,
        "pendingThreadList": "📌 المجموعات في انتظار الموافقة:\n{pendingThread}\n\n↪️ للرفض: `deny <الرقم>` أو `deny all`\n✅ للموافقة: `approve <الرقم>` أو `approve all`",
        "pendingThreadListEmpty": "لا توجد مجموعات قيد الانتظار حالياً.",
        "error": "❌ حصل خطأ غير متوقع، حاول مرة أخرى لاحقًا."
    }
};

function handleError(e) {
    console.error(e);
    return null;
}

function out(botID, cTID) {
    return new Promise((resolve) => {
        global.api.removeUserFromGroup(botID, cTID, (err) => {
            if (err) return resolve(null), console.error(err);
            resolve(true);
        });
    });
}

async function callback({ message, getLang, eventData }) {
    const { pendingThread } = eventData;

    const input = message.body.split(" ");
    const indexes =
        input[1] == "all" || input[1] == "-a"
            ? pendingThread.map((_, index) => index)
            : input
                  .slice(1)
                  .map(index => parseInt(index) - 1)
                  .filter(index => index >= 0 && index < pendingThread.length);

    let success = 0,
        fail = [];

    if (input[0] == "deny" || input[0] == "d") {
        if (indexes.length == 0) return message.reply(getLang("invalidIndexes"));

        const threads = indexes.map(index => pendingThread[index]);

        for (const thread of threads) {
            const { threadID: cTID } = thread;

            let _info = await message.send(getLang("denied"), cTID).then(data => data).catch(handleError);
            let _out = await out(global.botID, cTID);

            if (_info == null || _out == null) fail.push(cTID);
            else success++;

            global.sleep(500);
        }

        message.reply(getLang("successDeny", { success }));
        if (fail.length > 0) message.reply(getLang("failDeny", { fail: fail.join("\n") }));
    } else {
        if (indexes.length == 0) return message.reply(getLang("invalidIndexes"));

        const threads = indexes.map(index => pendingThread[index]);

        for (const thread of threads) {
            const { threadID: cTID } = thread;
            let threadPrefix = global.data.threads.get(cTID)?.data?.prefix || global.config.PREFIX;
            let _info = await message
                .send(getLang("approved", {
                    prefix: threadPrefix,
                    botname: global.config.BOTNAME || "موزان",
                    version: global.config.VERSION || "1.0.0"
                }), cTID)
                .then(data => data)
                .catch(handleError);

            if (_info == null) fail.push(cTID);
            else success++;

            global.sleep(500);
        }

        message.reply(getLang("successApprove", { success }));
        if (fail.length > 0) message.reply(getLang("failApprove", { fail: fail.join("\n") }));
    }

    return;
}

async function onCall({ message, getLang }) {
    try {
        const SPAM = (await global.api.getThreadList(100, null, ["OTHER"])) || [];
        const PENDING = (await global.api.getThreadList(100, null, ["PENDING"])) || [];

        const pendingThread = [...SPAM, ...PENDING].filter(thread => thread.isGroup && thread.isSubscribed);
        if (pendingThread.length == 0) return message.reply(getLang("pendingThreadListEmpty"));

        return message
            .reply(getLang("pendingThreadList", {
                pendingThread: pendingThread.map((thread, index) => `${index + 1}. ${thread.name} (${thread.threadID})`).join("\n")
            }))
            .then(_ => _.addReplyEvent({ pendingThread, callback }))
            .catch(e => console.error(e));
    } catch (e) {
        console.error(e);
        return message.reply(getLang("error"));
    }
}

export default {
    config,
    langData,
    onCall
};
