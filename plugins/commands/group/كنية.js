const config = {
  name: "كنية",
  description: "تغيير كنية عضو في المجموعة عبر الرد أو التاق",
  usage: "<الكنية الجديدة> (رد/تاق)",
  category: "group",
  cooldown: 5,
  credits: "XaviaTeam"
};

async function onCall({ message, api, event, args }) {
  const { threadID, messageReply, mentions, senderID } = event;

  const newNick = args.join(" ");
  if (!newNick) return message.reply("⚠️ الرجاء كتابة الكنية الجديدة.\nمثال:\nكنية البطل القومي");

  let targetID;
  if (messageReply) {
    targetID = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
  } else {
    return message.reply("❌ يجب الرد على العضو أو عمل تاق له لتغيير كنيته.");
  }

  try {
    await api.changeNickname(newNick, threadID, targetID);
    message.reply(`✅ تم تغيير كنية العضو إلى: 「 ${newNick} 」`);
  } catch (err) {
    console.error(err);
    message.reply("❌ حدث خطأ أثناء تغيير الكنية.");
  }
}

export default {
  config,
  onCall
};
