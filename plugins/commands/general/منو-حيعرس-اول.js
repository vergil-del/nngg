const config = {
  name: "منو-حيعرس-أول",
  aliases: ["زواج", "عرس"],
  description: "يحدد منو ح يتزوج أولاً من بين الأعضاء",
  usage: "<منشن أو بدون>",
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
    return message.reply("👥 لازم على الأقل شخصين عشان أقدر أختار!");
  }

  const winner = targets[Math.floor(Math.random() * targets.length)];

  return message.reply(`💍 الشخص البتوقّعاته ح يعرس أول هو: ${message.mentions?.[winner] || `[ID: ${winner}]`}!`);
}

export default {
  config,
  onCall
};
