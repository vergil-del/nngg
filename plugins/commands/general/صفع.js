const config = {
  name: "صفع",
  description: "قوم بصفع شخص آخر في المجموعة 😂",
  category: "تسلية",
  usage: "@منشن",
  cooldown: 5,
  credits: "XaviaTeam"
};

const slapImages = [
  "https://i.postimg.cc/MZjBLvwN/chainsaw-man-csm.webp",
  "https://i.postimg.cc/Cx4k4X0K/slap-jjk.webp",
  "https://i.postimg.cc/8PR619jb/spy-family-spy-x-family.webp",
  "https://i.postimg.cc/k48TYN1w/slap4.gif"
];

async function onCall({ message }) {
  const { mentions, senderID } = message;

  const mentionIDs = Object.keys(mentions);
  if (!mentionIDs.length) return message.reply("👋 منشن شخص لصفعه!");

  const targetName = mentions[mentionIDs[0]].replace(/@/g, "");
  const senderName = global.data.users[senderID]?.name || "شخص مجهول";

  const img = slapImages[Math.floor(Math.random() * slapImages.length)];

  message.reply({
    body: `💢 ${senderName} صفع ${targetName} بقوة! 😂`,
    attachment: await global.getStreamFromURL(img)
  });
}

export default {
  config,
  onCall
};
