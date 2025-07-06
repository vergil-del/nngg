const config = {
  name: "صفع",
  aliases: ["slap", "كف"],
  description: "صَفَع أحد الأعضاء صفعًا افتراضيًا 😂",
  usage: "[رد/منشن/بدون]",
  cooldown: 3,
  category: "تسلية",
  credits: "XaviaTeam"
};

const slapGIFs = [
  "https://media.giphy.com/media/Gf3AUz3eBNbTW/giphy.gif",
  "https://media.giphy.com/media/jLeyZWgtwgr2U/giphy.gif",
  "https://media.giphy.com/media/j3iGKfXRKlLqw/giphy.gif",
  "https://media.giphy.com/media/Zau0yrl17uzdK/giphy.gif"
];

async function onCall({ message, api }) {
  const { mentions, type, senderID, threadID, messageReply } = message;

  const senderName = (await api.getUserInfo(senderID))[senderID].name;
  let targetID, targetName;

  if (type === "message_reply") {
    targetID = messageReply.senderID;
    targetName = messageReply.senderName;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
    targetName = mentions[targetID].replace(/@/g, "");
  } else {
    // اختار شخص عشوائي من المجموعة
    const threadInfo = await api.getThreadInfo(threadID);
    const members = threadInfo.participantIDs.filter(id => id !== senderID);
    targetID = members[Math.floor(Math.random() * members.length)];
    const userInfo = await api.getUserInfo(targetID);
    targetName = userInfo[targetID].name;
  }

  const gifURL = slapGIFs[Math.floor(Math.random() * slapGIFs.length)];
  const gifStream = await global.getStreamFromURL(gifURL);

  message.reply({
    body: `👋 ${senderName} صفع ${targetName} كف محترم! 😂`,
    attachment: gifStream
  });
}

export default {
  config,
  onCall
};
