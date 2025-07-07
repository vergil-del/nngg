import { createCanvas, loadImage } from "canvas";
import axios from "axios";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const config = {
  name: "بوسة2",
  description: "بوسة مدموجة مع الصورة حسب النوع 😘",
  category: "تسلية",
  usage: "رد أو منشن",
  cooldown: 5,
  credits: "XaviaTeam"
};

const imageBoyToBoy = "https://i.postimg.cc/kGSznvyL/77c7012b5473e76cf1f118103b64222a.jpg";
const imageNormal = "https://i.postimg.cc/3xXSfwLC/b67185ef51e95c164937feb591a23f4c.jpg";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function getAvatar(uid) {
  const url = `https://graph.facebook.com/${uid}/picture?width=256&height=256`;
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return await loadImage(response.data);
}

function isGirl(name = "") {
  const girlWords = ["fatima", "mariam", "sara", "aya", "salma", "هدى", "آية", "فاطمة", "مريم", "سلمى", "سارة", "بت"];
  name = name.toLowerCase();
  return girlWords.some(word => name.includes(word));
}

async function onCall({ message }) {
  const { mentions, senderID, messageReply } = message;
  const mentionIDs = Object.keys(mentions);
  let targetID;

  if (mentionIDs.length > 0) {
    targetID = mentionIDs[0];
  } else if (messageReply?.senderID) {
    targetID = messageReply.senderID;
  } else {
    return message.reply("😘 منشن شخص أو رد عليه عشان تبوسه.");
  }

  if (targetID === senderID)
    return message.reply("😂 ما ممكن تبوس نفسك!");

  const senderName = global.data.users[senderID]?.name || "مجهول";
  const targetName = global.data.users[targetID]?.name || "مجهول";

  const senderIsGirl = isGirl(senderName);
  const targetIsGirl = isGirl(targetName);

  const selectedImageURL = (!senderIsGirl && !targetIsGirl) ? imageBoyToBoy : imageNormal;

  try {
    const [bgImage, senderAvatar, targetAvatar] = await Promise.all([
      axios.get(selectedImageURL, { responseType: "arraybuffer" }).then(res => loadImage(res.data)),
      getAvatar(senderID),
      getAvatar(targetID)
    ]);

    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bgImage, 0, 0);

    const faceSize = 100;

    // وجه المرسل (يمين)
    ctx.save();
    ctx.beginPath();
    ctx.arc(130, 140, faceSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(senderAvatar, 80, 90, faceSize, faceSize);
    ctx.restore();

    // وجه المستقبل (يسار)
    ctx.save();
    ctx.beginPath();
    ctx.arc(450, 140, faceSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(targetAvatar, 400, 90, faceSize, faceSize);
    ctx.restore();

    // نص أسفل الصورة
    const text = `${senderName} بوس ${targetName} 💋`;
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    const textX = canvas.width / 2 - ctx.measureText(text).width / 2;
    const textY = canvas.height - 40;
    ctx.strokeText(text, textX, textY);
    ctx.fillText(text, textX, textY);

    const outPath = path.join(__dirname, "kiss2_output.png");
    const stream = canvas.createPNGStream();
    const out = fs.createWriteStream(outPath);
    stream.pipe(out);

    out.on("finish", () => {
      message.reply({
        body: "😍 البوسة تمت!",
        attachment: fs.createReadStream(outPath)
      }, () => fs.unlinkSync(outPath));
    });

  } catch (err) {
    console.error(err);
    message.reply("❌ خطأ في إنشاء صورة البوسة.");
  }
}

export default {
  config,
  onCall
};
