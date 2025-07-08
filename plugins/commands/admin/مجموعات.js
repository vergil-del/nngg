const config = {
  name: "مجموعات",
  aliases: ["groups", "قروبات"],
  description: "عرض جميع المجموعات الموجود فيها البوت مع خيار المغادرة",
  usage: "",
  cooldown: 5,
  permissions: [2], // فقط للمطورين
  credits: "XaviaTeam",
  isAbsolute: true
};

const langData = {
  "ar_SY": {
    "list": "🔹 قائمة المجموعات:\n\n{list}\n\nاكتب رقم المجموعة التي تريد مغادرتها خلال 30 ثانية.",
    "invalid": "❌ الرقم غير صحيح أو غير موجود.",
    "left": "✅ غادر البوت المجموعة بنجاح.\n📩 للتواصل مع المطور:\n{devLink}\n🔧 المطور: {devName}",
    "error": "⚠️ حدث خطأ أثناء محاولة المغادرة."
  }
};

async function onCall({ message, getLang, event }) {
  try {
    const threads = await global.api.getThreadList(100, null, ["INBOX"]);
    const groups = threads.filter(g => g.isGroup);

    if (groups.length == 0)
      return message.reply("❌ لا يوجد مجموعات حاليًا.");

    const msg = getLang("list", {
      list: groups.map((g, i) => `${i + 1}. ${g.name} (${g.threadID})`).join("\n")
    });

    message.reply(msg).then(res => {
      global.client.handleReply.push({
        name: config.name,
        messageID: res.messageID,
        author: event.senderID,
        type: "choose-group",
        groups
      });
    });
  } catch (err) {
    console.error(err);
    message.reply("⚠️ حصل خطأ أثناء جلب القائمة.");
  }
}

async function handleReply({ event, Reply, message, getLang }) {
  const index = parseInt(event.body);
  if (isNaN(index) || index < 1 || index > Reply.groups.length)
    return message.reply(getLang("invalid"));

  const group = Reply.groups[index - 1];

  try {
    await global.api.removeUserFromGroup(global.botID, group.threadID);

    const devName = global.config.BOTNAME || "البوت";
    const devLink = global.config.CONTACT || "https://facebook.com/mozan50sama";

    await message.send(getLang("left", {
      devName,
      devLink
    }), group.threadID);

    message.reply(`✅ غادر البوت من المجموعة: ${group.name}`);
  } catch (err) {
    console.error(err);
    message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall,
  handleReply
};
