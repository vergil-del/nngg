const config = {
  name: "تعديل-رصيد",
  aliases: ["setmoney", "addmoney", "modmoney"],
  description: "تعديل رصيد أي مستخدم (للمشرف فقط)",
  usage: "<add/set/subtract> [مبلغ] (رد أو منشن)",
  cooldown: 3,
  credits: "XaviaTeam"
};

const langData = {
  "ar_SY": {
    notOwner: "❌ هذا الأمر للمشرف فقط.",
    noTarget: "📌 يرجى منشن أو الرد على الشخص.",
    invalidAmount: "⚠️ يرجى تحديد مبلغ صحيح.",
    doneAdd: "✅ تم إضافة {amount} إلى رصيد {name}.",
    doneSet: "✅ تم تحديد رصيد {name} إلى {amount}.",
    doneSub: "✅ تم خصم {amount} من رصيد {name}.",
  },
  "en_US": {
    notOwner: "❌ This command is for bot owner only.",
    noTarget: "📌 Please mention or reply to the user.",
    invalidAmount: "⚠️ Please provide a valid amount.",
    doneAdd: "✅ Added {amount} to {name}'s balance.",
    doneSet: "✅ Set {name}'s balance to {amount}.",
    doneSub: "✅ Subtracted {amount} from {name}.",
  }
};

const OWNER_ID = 61562119538523"; // ← غير دا لمعرفك

async function onCall({ message, args, getLang }) {
  const { senderID, mentions, messageReply } = message;

  if (senderID !== OWNER_ID) return message.reply(getLang("notOwner"));

  const action = args[0]; // add / set / sub
  const amount = parseInt(args[1]);
  const targetID = Object.keys(mentions)[0] || messageReply?.senderID;

  if (!targetID) return message.reply(getLang("noTarget"));
  if (!["add", "set", "sub"].includes(action)) return message.reply("❗ استعمل: add / set / sub");
  if (isNaN(amount)) return message.reply(getLang("invalidAmount"));

  const { Users } = global.controllers;
  const name = (await global.api.getUserInfo(targetID))[targetID]?.name || "المستخدم";

  if (action === "add") {
    await Users.increaseMoney(targetID, amount);
    return message.reply(getLang("doneAdd", { name, amount }));
  }

  if (action === "set") {
    await Users.setMoney(targetID, amount);
    return message.reply(getLang("doneSet", { name, amount }));
  }

  if (action === "sub") {
    await Users.decreaseMoney(targetID, amount);
    return message.reply(getLang("doneSub", { name, amount }));
  }
}

export default {
  config,
  langData,
  onCall
};
