const config = {
  name: "بوسة",
  description: "ابوس شخص من المجموعة 💋",
  category: "تسلية",
  usage: "@منشن",
  cooldown: 5,
  credits: "XaviaTeam"
};

const kissImages = [
  "https://i.postimg.cc/RCtp4C9J/kiss.webp",
  "https://i.postimg.cc/C5bcN7Js/sealyx-frieren-beyond-journey-s-end.webp",
];

async function onCall({ message }) {
  const { mentions, senderID } = message;

  const mentionIDs = Object.keys(mentions);
  if (!mentionIDs.length)
    return message.reply("💋 منشن شخص تبوسه!");

  const targetName = mentions[mentionIDs[0]].replace(/@/g, "");
  const senderName = global.data.users[senderID]?.name || "شخص مجهول";

  const img = kissImages[Math.floor(Math.random() * kissImages.length)];

  message.reply({
    body: `😘 ${senderName} بوس ${targetName} 💋`,
    attachment: await global.getStreamFromURL(img)
  });
}

export default {
  config,
  onCall
};
