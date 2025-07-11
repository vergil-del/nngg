const config = {
  name: "احسب",
  aliases: ["احصائية", "الاحصائيات", "messages"],
  description: "يعرض عدد رسائل كل عضو وآخر رسالة وعدد الأعضاء والأدمن.",
  usage: "",
  version: "1.0",
  cooldown: 5,
  permissions: [0],
  credits: "XaviaTeam",
  category: "معلومات"
};

function formatTime(time) {
  const date = new Date(time);
  return date.toLocaleString("ar-EG", {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

async function onCall({ message }) {
  const { threadID } = message;

  const stats = global.data?.messageStats?.[threadID];
  if (!stats) return message.reply("لا توجد بيانات محفوظة في هذه المجموعة بعد.");

  const entries = Object.entries(stats);

  let result = "📊 احصائيات الرسائل:\n\n";
  for (const [uid, info] of entries) {
    const name = (await global.controllers.Users.getInfo(uid))?.name || uid;
    result += `👤 ${name}\n🗨️ عدد الرسائل: ${info.count}\n⏰ آخر رسالة: ${formatTime(info.lastMessage)}\n\n`;
  }

  const memberCount = entries.length;
  const adminCount = (await global.controllers.Threads.getInfo(threadID))?.adminIDs?.length || 0;

  result += `👥 عدد الأعضاء: ${memberCount}\n🛡️ عدد الأدمن: ${adminCount}`;
  message.reply(result);
}

export default {
  config,
  onCall
};