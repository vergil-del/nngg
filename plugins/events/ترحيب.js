const config = {
  name: "ترحيب",
  description: "يرحب تلقائيًا بالأعضاء الجدد في المجموعة",
  eventType: ["event"],
  credits: "XaviaTeam"
};

const emojis = ["✨", "🌸", "🪐", "🌟", "💫", "🎉", "👑", "🌈", "🦋"];

function getRandomEmoji() {
  return emojis[Math.floor(Math.random() * emojis.length)];
}

async function onCall({ event, api, message }) {
  const { threadID, logMessageType, logMessageData } = event;

  if (logMessageType !== "log:subscribe") return;

  const newMembers = logMessageData.addedParticipants;
  const threadInfo = await api.getThreadInfo(threadID);

  for (const member of newMembers) {
    const userID = member.userFbId;
    const userInfo = await api.getUserInfo(userID);
    const name = userInfo[userID]?.name || "عضو جديد";
    const genderRaw = userInfo[userID]?.gender || "UNKNOWN";

    const gender =
      genderRaw === "male"
        ? "ذكر ♂️"
        : genderRaw === "female"
        ? "أنثى ♀️"
        : "غير محدد ⚪";

    const memberCount = threadInfo.participantIDs.length;

    const emoji = getRandomEmoji();

    const welcomeMessage = `${emoji} أهلاً وسهلاً بك يا ${name} ${emoji}\n\n👤 النوع: ${gender}\n📊 أنت العضو رقم: ${memberCount}\n\n🌸✨ نتمنى لك وقتًا ممتعًا معنا! ✨🌸`;

    message.reply(welcomeMessage);
  }
}

export default {
  config,
  onCall
};
