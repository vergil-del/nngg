import { resolve } from "path";
import { writeFileSync, readFileSync, existsSync } from "fs";

const config = {
  name: "باند",
  aliases: ["حظر-مخرب"],
  description: "حظر عضو كمخرب وطرده من المجموعة",
  usage: "<تاگ أو رد>",
  category: "admin",
  cooldown: 3,
  permissions: [2],
  credits: "XaviaTeam"
};

const langData = {
  "ar_SY": {
    noTarget: "❗ يجب عمل تاگ أو رد على العضو لحظره كمخرب.",
    alreadyBanned: "⚠️ هذا العضو محظور مسبقاً كمخرب.",
    banned: "✅ تم حظر العضو وطرده من المجموعة.\n🧾 السبب: {reason}",
    notify: "🚨 تم حظر {name} كمخرب!\n🆔 UID: {uid}\n📅 التاريخ: {date}"
  }
};

async function onCall({ message, args, getLang, api }) {
  const { threadID, mentions, senderID, messageReply } = message;
  let targetID, targetName;

  if (messageReply) {
    targetID = messageReply.senderID;
    targetName = messageReply.senderName;
  } else if (Object.keys(mentions).length > 0) {
    targetID = Object.keys(mentions)[0];
    targetName = mentions[targetID];
  } else {
    return message.reply(getLang("noTarget"));
  }

  const filePath = resolve("core", "handlers", "banlog.json");

  let banlog = [];
  if (existsSync(filePath)) {
    banlog = JSON.parse(readFileSync(filePath));
    if (banlog.find(entry => entry.uid == targetID))
      return message.reply(getLang("alreadyBanned"));
  }

  const reason = args.slice(1).join(" ") || "غير مذكور";
  const date = new Date().toLocaleString("ar-EG");

  banlog.push({
    uid: targetID,
    name: targetName.replace(/@/g, ''),
    reason,
    date
  });

  writeFileSync(filePath, JSON.stringify(banlog, null, 2));

  api.removeUserFromGroup(targetID, threadID);
  message.reply(getLang("banned", { reason }));

  // إرسال تنبيه لكل المخربين
  banlog.forEach(entry => {
    if (entry.uid != targetID) {
      api.sendMessage(getLang("notify", {
        name: targetName,
        uid: targetID,
        date
      }), entry.uid);
    }
  });
}

export default {
  config,
  langData,
  onCall
};
