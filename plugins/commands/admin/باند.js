const config = {
  name: "باند",
  aliases: ["حظر-مخرب"],
  description: "طرد وحظر المخربين مع حفظ بياناتهم",
  usage: "@تاق السبب",
  category: "group",
  cooldown: 5,
  credits: "XaviaTeam"
};

const langData = {
  "ar_SY": {
    "noMention": "❌ من فضلك قم بعمل تاق للمخرب مع السبب.",
    "banned": "🚫 تم طرد المخرب: {name}\n📎 الحساب: https://facebook.com/{uid}\n🪓 السبب: {reason}",
    "notify": "📢 تم طرد أحد المخربين!\nالاسم: {name}\nالرابط: https://facebook.com/{uid}\n⚠️ السبب: {reason}"
  }
};

import { writeFileSync, existsSync, readFileSync } from "fs";
import { resolve } from "path";

async function onCall({ api, message, event, getLang }) {
  const mentions = event.mentions;
  const threadID = event.threadID;
  const args = event.body.split(" ").slice(1);

  if (Object.keys(mentions).length === 0 || args.length < 2) {
    return message.reply(getLang("noMention"));
  }

  const targetID = Object.keys(mentions)[0];
  const targetName = mentions[targetID];
  const reason = args.slice(1).join(" ");
  const now = new Date().toLocaleString("ar-EG", { timeZone: "Africa/Khartoum" });

  try {
    await api.removeUserFromGroup(targetID, threadID);

    // حفظ في قاعدة البيانات
    await global.controllers.Users.setData(targetID, {
      bannedAsTroll: true,
      trollReason: reason,
      trollDate: now
    });

    // حفظ في ملف banlog.json
    const filePath = resolve("data", "banlog.json");
    let banList = [];
    if (existsSync(filePath)) {
      try {
        banList = JSON.parse(readFileSync(filePath, "utf-8"));
      } catch (e) { }
    }

    banList.push({
      uid: targetID,
      name: targetName.replace(/@/g, ""),
      reason,
      date: now
    });

    writeFileSync(filePath, JSON.stringify(banList, null, 2));

    // إرسال الرسالة
    message.reply(getLang("banned", {
      name: targetName.replace(/@/g, ""),
      uid: targetID,
      reason
    }));

    // إشعار للمخربين المسجلين الآخرين
    const users = await global.controllers.Users.getAll();
    for (const user of users) {
      if (user.data?.bannedAsTroll && user.uid !== targetID) {
        await api.sendMessage(getLang("notify", {
          name: targetName.replace(/@/g, ""),
          uid: targetID,
          reason
        }), user.uid);
      }
    }

  } catch (err) {
    message.reply("❌ فشل في تنفيذ الأمر.");
  }
}

export default {
  config,
  langData,
  onCall
};
