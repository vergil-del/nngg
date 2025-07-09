const config = {
  name: "تحويل",
  aliases: ["send", "transfer"],
  description: "تحويل ذهب 🪙 إلى مستخدم آخر عبر التاق أو الرد على رسالته",
  usage: "<المبلغ> [@تاق أو رد]",
  credits: "Muzan"
};

const langData = {
  "ar_SY": {
    "missingAmount": "⚠️ الرجاء تحديد المبلغ الذي تريد تحويله.",
    "invalidAmount": "❌ المبلغ غير صالح.",
    "noTarget": "⚠️ من فضلك قم بعمل تاق للمستلم أو رد على رسالته.",
    "noBalance": "❌ ليس لديك رصيد كافٍ. رصيدك الحالي: {balance} 🪙",
    "success": "✅ تم تحويل {amount} 🪙 إلى {name} بنجاح.",
    "notifyReceiver": "📩 لقد استلمت {amount} 🪙 من {senderName}!",
    "selfTransfer": "❌ لا يمكنك تحويل رصيد لنفسك.",
    "failed": "❌ فشل في تنفيذ عملية التحويل."
  }
};

async function onCall({ message, args, getLang }) {
  const { Currencies, Users } = global.controllers;
  const senderID = message.senderID;

  try {
    if (!args[0]) return message.reply(getLang("missingAmount"));

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0) return message.reply(getLang("invalidAmount"));

    let targetID = null;

    // إذا رد على رسالة
    if (message.messageReply) {
      targetID = message.messageReply.senderID;
    }

    // إذا عمل تاق
    if (Object.keys(message.mentions).length > 0) {
      targetID = Object.keys(message.mentions)[0];
    }

    if (!targetID) return message.reply(getLang("noTarget"));
    if (targetID === senderID) return message.reply(getLang("selfTransfer"));

    const senderBalance = await Currencies.getGold(senderID);
    if (senderBalance < amount) {
      return message.reply(getLang("noBalance", { balance: senderBalance }));
    }

    await Currencies.decreaseGold(senderID, amount);
    await Currencies.increaseGold(targetID, amount);

    const senderInfo = await Users.getInfo(senderID);
    const receiverInfo = await Users.getInfo(targetID);
    const receiverName = receiverInfo?.name || "المستخدم";

    // إشعار للمُرسل
    await message.reply(getLang("success", {
      amount,
      name: receiverName
    }));

    // إشعار للمستلم
    await global.api.sendMessage(
      getLang("notifyReceiver", {
        amount,
        senderName: senderInfo?.name || "شخص مجهول"
      }),
      targetID
    );
  } catch (err) {
    console.error(err);
    return message.reply(getLang("failed"));
  }
}

export default {
  config,
  langData,
  onCall
};
