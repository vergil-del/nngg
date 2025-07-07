import { createReadStream, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const config = {
  name: "بوسة",
  description: "ابوس شخص من المجموعة 💋",
  category: "تسلية",
  usage: "@منشن",
  cooldown: 5,
  credits: "XaviaTeam"
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function onCall({ message }) {
  const { mentions, senderID } = message;
  const mentionIDs = Object.keys(mentions);

  if (!mentionIDs.length)
    return message.reply("💋 منشن شخص تبوسه!");

  const targetName = mentions[mentionIDs[0]].replace(/@/g, "");
  const senderName = global.data.users[senderID]?.name || "شخص مجهول";

  // فقط الصور اللي تبدأ بـ kiss + رقم + امتداد صورة
  const allFiles = readdirSync(__dirname);
  const kissImages = allFiles.filter(file => /^kiss\d+\.(gif|jpg|jpeg|png)$/i.test(file));

  if (!kissImages.length)
    return message.reply("❌ ما في صور بوسة بصيغة صحيحة (مثلاً kiss1.gif).");

  const randomImage = kissImages[Math.floor(Math.random() * kissImages.length)];
  const imageStream = createReadStream(join(__dirname, randomImage));

  message.reply({
    body: `😘 ${senderName} بوس ${targetName} 💋`,
    attachment: imageStream
  });
}

export default {
  config,
  onCall
};
