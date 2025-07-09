const config = {
  name: "ارفعني",
  aliases: ["رفع", "adminme"],
  description: "يرفع المطور كأدمن في المجموعة إذا كان البوت يملك صلاحيات",
  usage: "",
  cooldown: 5,
  permissions: [2], // للمطور فقط
  credits: "XaviaTeam",
  isAbsolute: true
};

const langData = {
  "ar_SY": {
    "noPerm": "❌ البوت لا يملك صلاحية رفع المشرفين في هذه المجموعة.",
    "done": "✅ تم رفعك كمشرف بنجاح.",
    "already": "✅ أنت مشرف بالفعل في هذه المجموعة.",
    "error": "⚠️ حصل خطأ أثناء محاولة الرفع."
  }
};

async function onCall({ message, event, getLang }) {
  try {
    const threadID = event.threadID;
    const adminIDs = global.data.threads.get(threadID)?.adminIDs || [];

    if (adminIDs.some(e => e.id == event.senderID)) {
      return message.reply(getLang("already"));
    }

    const botID = global.botID;
    const botCanPromote = adminIDs.some(e => e.id == botID && e.capabilities?.canPromoteAdmins === true);

    if (!botCanPromote) {
      return message.reply(getLang("noPerm"));
    }

    await global.api.changeAdminStatus(threadID, event.senderID, true);
    return message.reply(getLang("done"));
  } catch (e) {
    console.error(e);
    return message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall
};
