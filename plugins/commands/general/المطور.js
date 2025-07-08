const config = {
  name: "المطور",
  version: "1.0.0",
  aliases: ["dev", "developer"],
  description: "عرض معلومات عن المطور والبوت",
  usage: "",
  credits: "XaviaTeam",
  cooldown: 3,
  permissions: [0], // متاح للجميع
  category: "معلومات"
};

import axios from "axios";
import fs from "fs-extra";

async function onCall({ message }) {
  const developerID = "61562119538523";
  const developerName = "ᏉᎬᏒᎶᎥᏞ ᏕᏢᎯᏒᎠᎯ";
  const botName = global.config.BOTNAME || "XaviaBot";
  const version = global.config.VERSION || "1.0.0";
  const prefix = global.config.PREFIX || "/";

  const info = `
🧠 معلومات البوت:

⚙️ الاسم: ${botName}
🆚 الإصدار: ${version}
📍 البادئة: ${prefix}

👨‍💻 المطور:

🆔 الاسم: ${developerName}
🔗 الحساب: https://facebook.com/profile.php?id=${developerID}
💬 للتواصل معي لأي دعم فني أو تطوير، لا تتردد 💙

✨ صلي على النبي ﷺ
  `.trim();

  const imgURL = "https://i.postimg.cc/Gt5hzFJr/271826eb23d07215f7806f85a0fc75fd.jpg";
  const imgPath = __dirname + `/cache/dev.jpg`;

  const response = await axios.get(imgURL, { responseType: "arraybuffer" });
  fs.writeFileSync(imgPath, Buffer.from(response.data, "utf-8"));

  message.reply({
    body: info,
    attachment: fs.createReadStream(imgPath)
  }, () => fs.unlinkSync(imgPath));
}

export default {
  config,
  onCall
};
