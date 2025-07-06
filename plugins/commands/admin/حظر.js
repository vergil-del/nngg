import fs from "fs-extra";

const BLOCKED_PATH = "./data/blockedUsers.json";
const OWNER_ID = "61562119538523"; // ← غيّر ده لمعرفك إنت

const config = {
  name: "حظر",
  aliases: ["block", "unblock"],
  description: "حظر أو إلغاء حظر مستخدم من استخدام البوت (للمطور فقط)",
  usage: "<block/unblock> [رد/منشن]",
  cooldown: 3,
  credits: "XaviaTeam"
};

const langData = {
  "ar_SY": {
    blocked: "🚫 تم حظر المستخدم من استخدام البوت.",
    alreadyBlocked: "⚠️ هذا المستخدم محظور بالفعل.",
    unblocked: "✅ تم إلغاء الحظر عن المستخدم.",
    notBlocked: "ℹ️ هذا المستخدم غير محظور.",
    notOwner: "❌ هذا الأمر مخصص للمطور فقط.",
    noTarget: "📌 يرجى الرد على رسالة المستخدم أو منشنه.",
  },
  "en_US": {
    blocked: "🚫 User has been blocked from using the bot.",
    alreadyBlocked: "⚠️ This user is already blocked.",
    unblocked: "✅ User has been unblocked.",
    notBlocked: "ℹ️ This user is not blocked.",
    notOwner: "❌ This command is for bot owner only.",
    noTarget: "📌 Please reply to or mention the user.",
  }
};

async function onCall({ message, getLang }) {
  const { senderID, mentions, messageReply, args, threadID } = message;

  if (senderID !== OWNER_ID) return message.reply(getLang("notOwner"));

  const targetID = Object.keys(mentions)[0] || messageReply?.senderID;
  if (!targetID) return message.reply(getLang("noTarget"));

  const action = args[0]?.toLowerCase() || "block";
  let blocked = fs.existsSync(BLOCKED_PATH)
    ? JSON.parse(fs.readFileSync(BLOCKED_PATH))
    : [];

  if (action === "unblock") {
    if (!blocked.includes(targetID)) return message.reply(getLang("notBlocked"));
    blocked = blocked.filter(id => id !== targetID);
    fs.writeFileSync(BLOCKED_PATH, JSON.stringify(blocked, null, 2));
    return message.reply(getLang("unblocked"));
  }

  if (blocked.includes(targetID)) return message.reply(getLang("alreadyBlocked"));
  blocked.push(targetID);
  fs.writeFileSync(BLOCKED_PATH, JSON.stringify(blocked, null, 2));
  return message.reply(getLang("blocked"));
}

export default {
  config,
  langData,
  onCall
};
