const config = {
  name: "منو-الاغبى",
  aliases: ["اغبى", "غباء"],
  description: "يختار الأغبى من بين الأشخاص",
  usage: "<منشن/رد/بدون>",
  cooldown: 3,
  credits: "XaviaTeam"
};

async function onCall({ message, participants }) {
  const mentions = Object.keys(message.mentions);
  const repliedID = message.messageReply?.senderID;

  let targets = [];

  if (mentions.length > 0) {
    targets = mentions;
  } else if (repliedID) {
    targets = [repliedID, message.senderID];
  } else {
    targets = participants
      .filter(p => p?.inGroup && !p?.isBot)
      .map(p => p.userID);
  }

  if (targets.length < 2) {
    return message.reply("😂 لازم يكون في ناس أختار منهم.");
  }

  const chosen = targets[Math.floor(Math.random() * targets.length)];

  return message.reply(`🧠 الشخص الأغبى هنا هو: ${message.mentions?.[chosen] || `[ID: ${chosen}]`} 🤪`);
}

export default {
  config,
  onCall
};
