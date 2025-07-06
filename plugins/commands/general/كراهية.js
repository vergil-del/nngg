const config = {
  name: "كراهية",
  aliases: ["hate", "كراه", "كارهية"],
  description: "تعرف نسبة الكراهية بينك وبين شخص تاني 😈",
  usage: "[رد على رسالة أو منشن]",
  cooldown: 3,
  category: "تسلية",
  credits: "XaviaTeam"
};

async function onCall({ message }) {
  const { mentions, type, messageReply, senderID } = message;

  let targetID, targetName;

  if (type === "message_reply") {
    targetID = messageReply.senderID;
    targetName = messageReply.senderName;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
    targetName = mentions[targetID];
  } else {
    return message.reply("👀 لازم ترد على شخص أو تمنشنو عشان أحسب الكراهية.");
  }

  const percent = Math.floor(Math.random() * 101);

  let reaction;
  if (percent >= 90) {
    reaction = "😡 في عداوة أزلية بينكم!";
  } else if (percent >= 70) {
    reaction = "😠 واضح في شي كبير بيناتكم.";
  } else if (percent >= 40) {
    reaction = "😒 في كراهية خفيفة.";
  } else if (percent >= 10) {
    reaction = "😶 في شوية توتر بسيط.";
  } else {
    reaction = "😇 مافي كراهية تذكر.";
  }

  message.reply(`📊 نسبة الكراهية بينك وبين ${targetName} هي: ${percent}%\n${reaction}`);
}

export default {
  config,
  onCall
};
