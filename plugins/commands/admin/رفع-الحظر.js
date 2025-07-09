const config = {
  name: "رفع-الحظر",
  aliases: ["unblock"],
  description: "عرض المجموعات المحظورة مع إمكانية إلغاء الحظر",
  usage: "",
  cooldown: 5,
  permissions: [2], // للمطور فقط
  credits: "XaviaTeam",
  isAbsolute: true
};

const langData = {
  "ar_SY": {
    "noBlocked": "🚫 لا توجد مجموعات محظورة حالياً.",
    "list": "🔐 قائمة المجموعات المحظورة:\n\n{list}\n\nاكتب رقم المجموعة التي تريد رفع الحظر عنها خلال 30 ثانية.",
    "invalid": "❌ الرقم غير صحيح.",
    "success": "✅ تم رفع الحظر عن المجموعة بنجاح: {name}",
    "error": "⚠️ حصل خطأ أثناء محاولة رفع الحظر."
  }
};

import fs from "fs-extra";

const BLOCK_FILE = "./core/var/blockedGroups.json";

function loadBlocked() {
  if (!fs.existsSync(BLOCK_FILE)) return [];
  return JSON.parse(fs.readFileSync(BLOCK_FILE));
}

function saveBlocked(data) {
  fs.writeFileSync(BLOCK_FILE, JSON.stringify(data, null, 2));
}

async function onCall({ message, getLang, event }) {
  const blocked = loadBlocked();
  if (blocked.length == 0)
    return message.reply(getLang("noBlocked"));

  const list = blocked.map((b, i) => `${i + 1}. ${b.name} (${b.threadID})`).join("\n");

  message.reply(getLang("list", { list })).then(res => {
    global.client.handleReply.push({
      name: config.name,
      messageID: res.messageID,
      author: event.senderID,
      type: "unblock-choose",
      blocked
    });
  });
}

async function handleReply({ event, message, Reply, getLang }) {
  const index = parseInt(event.body);
  if (isNaN(index) || index < 1 || index > Reply.blocked.length)
    return message.reply(getLang("invalid"));

  const group = Reply.blocked[index - 1];
  const newList = Reply.blocked.filter(g => g.threadID !== group.threadID);

  try {
    saveBlocked(newList);
    message.reply(getLang("success", { name: group.name }));
  } catch (e) {
    console.error(e);
    message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall,
  handleReply
};
