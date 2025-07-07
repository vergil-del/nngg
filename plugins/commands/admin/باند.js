const config = {
  name: "باند",
  aliases: ["حظر-مخرب"],
  description: "طرد المخربين مع إشعار باقي المخربين",
  usage: "@تاق",
  category: "group",
  cooldown: 5,
  credits: "XaviaTeam"
};

const langData = {
  "ar_SY": {
    "noMention": "❌ من فضلك قم بعمل تاق للمخرب الذي تريد حظره.",
    "banned": "🚫 تم طرد المخرب: {name}\n📎 الحساب: https://facebook.com/{uid}\n🪓 السبب: تخريب المجموعة",
    "notify": "📢 تم طرد أحد المخربين!\nالاسم: {name}\nالرابط: https://facebook.com/{uid}\n⚠️ التزموا النظام!"
  }
};

// قاعدة بيانات مؤقتة للمخربين
const المخربين = [
  "100011112222333", // أضف ID المخربين هنا
  "100044445555666"
];

async function onCall({ api, message, event, getLang }) {
  const mentions = event.mentions;
  const threadID = event.threadID;

  if (Object.keys(mentions).length === 0) {
    return message.reply(getLang("noMention"));
  }

  const targetID = Object.keys(mentions)[0];
  const targetName = mentions[targetID];

  try {
    await api.removeUserFromGroup(targetID, threadID);
    message.reply(getLang("banned", {
      name: targetName.replace(/@/g, ""),
      uid: targetID
    }));

    // إشعار المخربين المسجلين
    for (const uid of المخربين) {
      if (uid !== targetID) {
        await api.sendMessage(getLang("notify", {
          name: targetName.replace(/@/g, ""),
          uid: targetID
        }), uid);
      }
    }
  } catch (err) {
    message.reply("❌ فشل في طرد العضو.");
  }
}

export default {
  config,
  langData,
  onCall
};
