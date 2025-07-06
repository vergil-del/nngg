import fs from "fs-extra";
import path from "path";

const config = {
  name: "تحديث-مجموعة",
  aliases: ["تحديث-الدردشة", "تحديث-الحماية"],
  description: "تحديث بيانات المجموعة (الاسم، الصورة، الكنيات) وتخزينها لنظام الحماية",
  usage: "",
  cooldown: 10,
  credits: "XaviaTeam"
};

async function onCall({ message, event }) {
  const threadID = message.threadID;
  const threadInfo = await global.api.getThreadInfo(threadID);
  const { Threads } = global.controllers;

  // تحميل صورة المجموعة
  let avatarBuffer = null;
  try {
    const url = threadInfo.imageSrc;
    if (url) {
      const res = await global.modules.get("axios").get(url, { responseType: "arraybuffer" });
      avatarBuffer = res.data;
    }
  } catch (e) {
    console.log("❗ فشل تحميل صورة المجموعة");
  }

  const nicknames = {};
  for (const user of threadInfo.userInfo) {
    if (user.nickname) {
      nicknames[user.id] = user.nickname;
    }
  }

  const dataToSave = {
    threadName: threadInfo.threadName || "غير معروف",
    nicknames,
    image: avatarBuffer
      ? `data:image/jpeg;base64,${Buffer.from(avatarBuffer).toString("base64")}`
      : null,
    updatedAt: Date.now()
  };

  await Threads.updateData(threadID, dataToSave);

  return message.reply("✅ تم تحديث بيانات المجموعة بنجاح وحفظها لنظام الحماية.");
}

export default {
  config,
  onCall
};
