import fs from "fs-extra";
import path from "path";

const config = {
  name: "سكون",
  aliases: ["sleep", "هدوء"],
  description: "تفعيل أو إلغاء وضع السكون لمجموعة معينة أو المجموعة الحالية",
  usage: "[threadID (اختياري)]",
  category: "المطور",
  credits: "XaviaTeam"
};

const DEVELOPER_ID = "61562119538523";
const SLEEP_FILE = path.join(process.cwd(), "core/var/sleepList.json");

async function onCall({ api, message, event, args }) {
  if (event.senderID !== DEVELOPER_ID) return;

  const targetThreadID = args[0] || event.threadID;

  let sleepList = [];
  try {
    sleepList = await fs.readJSON(SLEEP_FILE);
  } catch {
    await fs.writeJSON(SLEEP_FILE, []);
  }

  if (sleepList.includes(targetThreadID)) {
    sleepList = sleepList.filter(id => id !== targetThreadID);
    await fs.writeJSON(SLEEP_FILE, sleepList);
    return message.reply(
      `☀️ تم إلغاء وضع السكون للمجموعة:\n${targetThreadID}`
    );
  } else {
    sleepList.push(targetThreadID);
    await fs.writeJSON(SLEEP_FILE, sleepList);
    return message.reply(
      `😴 تم تفعيل وضع السكون للمجموعة:\n${targetThreadID}`
    );
  }
}

export default {
  config,
  onCall
};
