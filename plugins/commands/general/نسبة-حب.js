const config = {
  name: "نسبة-الحب",
  aliases: ["حب", "حبكم"],
  description: "يحسب نسبة الحب بينك وبين شخص آخر",
  usage: "<رد أو منشن>",
  cooldown: 3,
  credits: "XaviaTeam"
};

async function onCall({ message }) {
  const mention = Object.keys(message.mentions)[0] || (message.messageReply && message.messageReply.senderID);
  if (!mention) return message.reply("منشن شخص أو رد عليه عشان أحسب نسبة الحب 💘");

  const percent = Math.floor(Math.random() * 101);
  let emoji = "💔";

  if (percent >= 80) emoji = "❤️‍🔥";
  else if (percent >= 50) emoji = "💖";
  else if (percent >= 30) emoji = "💕";
  else emoji = "💔";

  return message.reply(`نسبة الحب بينكم هي: ${percent}% ${emoji}`);
}

export default { config, onCall };
