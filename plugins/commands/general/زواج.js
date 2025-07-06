const config = {
  name: "زواج",
  aliases: ["marry", "عرس"],
  description: "اطلب الزواج من شخص بطريقة مسلية 😍💍",
  usage: "[رد/منشن]",
  cooldown: 3,
  category: "تسلية",
  credits: "XaviaTeam"
};

const acceptImages = [
  "https://i.pinimg.com/originals/1e/e5/4a/1ee54af38ec883001ee3ebd50f68f089.gif",
  "https://media.giphy.com/media/3o6ZtaO9BZHcOjmErm/giphy.gif",
  "https://media.giphy.com/media/l0MYB8Ory7Hqefo9a/giphy.gif"
];

const rejectImages = [
  "https://media.giphy.com/media/3og0IPxMM0erATueVW/giphy.gif",
  "https://media.giphy.com/media/xUOxfgC7QdSE6O0RSo/giphy.gif",
  "https://media.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.gif"
];

async function onCall({ message, api }) {
  const { mentions, type, messageReply, senderID } = message;

  if (type !== "message_reply" && Object.keys(mentions).length === 0) {
    return message.reply("👰 لازم ترد على شخص أو تمنشنو عشان تطلب الزواج 😅");
  }

  const senderName = (await api.getUserInfo(senderID))[senderID].name;
  let targetID, targetName;

  if (type === "message_reply") {
    targetID = messageReply.senderID;
    targetName = messageReply.senderName;
  } else {
    targetID = Object.keys(mentions)[0];
    targetName = mentions[targetID].replace(/@/g, "");
  }

  if (targetID === senderID) {
    return message.reply("🙃 ما ممكن تتزوج نفسك يا حب.");
  }

  const accepted = Math.random() < 0.5; // عشوائي قبول أو رفض
  const imageURL = accepted
    ? acceptImages[Math.floor(Math.random() * acceptImages.length)]
    : rejectImages[Math.floor(Math.random() * rejectImages.length)];

  const imageStream = await global.getStreamFromURL(imageURL);
  const body = accepted
    ? `💞 ${targetName} وافق/ت على الزواج من ${senderName}!\nمبروك يا عرسان 🎉💍`
    : `💔 للأسف ${targetName} رفض/ت طلب الزواج من ${senderName}...`;

  message.reply({
    body,
    attachment: imageStream
  });
}

export default {
  config,
  onCall
};
