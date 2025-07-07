import { createReadStream, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const config = {
  name: "صفع",
  description: "قوم بصفع شخص من المجموعة 😂",
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
    return message.reply("👋 منشن شخص لصفعه!");

  const targetName = mentions[mentionIDs[0]].replace(/@/g, "");
  const senderName = global.data.users[senderID]?.name || "شخص مجهول";

  // تحميل الصور التي تبدأ بـ slap + رقم فقط
  const allFiles = readdirSync(__dirname);
  const slapImages = allFiles.filter(file => /^slap\d+\.(gif|jpg|jpeg|png)$/i.test(file));

  if (!slapImages.length)
    return message.reply("❌ ما في صور صفع بصيغة صحيحة (مثلاً slap1.gif).");

  const randomImage = slapImages[Math.floor(Math.random() * slapImages.length)];
  const imageStream = createReadStream(join(__dirname, randomImage));

  message.reply({
    body: `💢 ${senderName} صفع ${targetName} صفعة محترمة! 😂`,
    attachment: imageStream
  });
}

export default {
  config,
  onCall
};
