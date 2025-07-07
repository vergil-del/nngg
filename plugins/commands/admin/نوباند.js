import { resolve } from "path";
import { writeFileSync, readFileSync, existsSync } from "fs";

const config = {
  name: "نوباند",
  aliases: ["فك-مخرب"],
  description: "عرض قائمة المخربين وفك الحظر عنهم",
  usage: "",
  category: "admin",
  cooldown: 3,
  permissions: [2],
  credits: "XaviaTeam"
};

const langData = {
  "ar_SY": {
    empty: "✅ لا يوجد مخربين حالياً.",
    header: "🧾 قائمة المخربين:\n",
    entry: "{index}. {name} | {uid}\n📅 {date}\n🔹 السبب: {reason}\n",
    footer: "\n✏️ للغاء الحظر، اكتب: نوباند <UID>"
  }
};

async function onCall({ message, args, getLang }) {
  const filePath = resolve("core", "handlers", "banlog.json");

  let banlog = [];
  if (existsSync(filePath))
    banlog = JSON.parse(readFileSync(filePath));

  if (args.length === 1 && !isNaN(args[0])) {
    const uid = args[0];
    const index = banlog.findIndex(entry => entry.uid == uid);
    if (index !== -1) {
      banlog.splice(index, 1);
      writeFileSync(filePath, JSON.stringify(banlog, null, 2));
      return message.reply(`✅ تم فك الحظر عن العضو ${uid}`);
    } else {
      return message.reply("❌ هذا المستخدم غير موجود في القائمة.");
    }
  }

  if (banlog.length === 0)
    return message.reply(getLang("empty"));

  let msg = getLang("header");
  banlog.forEach((entry, index) => {
    msg += getLang("entry", {
      index: index + 1,
      name: entry.name,
      uid: entry.uid,
      reason: entry.reason,
      date: entry.date
    });
  });
  msg += getLang("footer");

  message.reply(msg);
}

export default {
  config,
  langData,
  onCall
};
