import fs from "fs-extra";
import path from "path";

const config = {
  name: "اضف-امر",
  description: "إضافة أمر جديد من خلال الشات (للمطور فقط)",
  usage: "أرسل اسم، تصنيف، ثم كود الأمر",
  cooldown: 10,
  credits: "XaviaTeam"
};

// تحديد الآي دي الخاص بالمطور هنا
const DEVELOPER_ID = "61562119538523"; // ← غيّرو لـ ID بتاعك

let sessions = {}; // لتخزين مراحل الإدخال لكل مطور

async function onCall({ message, event }) {
  const senderID = message.senderID;
  const content = message.body?.trim();

  // تحقق من الصلاحية
  if (senderID !== DEVELOPER_ID) {
    return message.reply("❌ هذا الأمر مخصص للمطور فقط.");
  }

  if (!sessions[senderID]) {
    sessions[senderID] = { step: 0, data: {} };
    return message.reply("✏️ أرسل اسم الأمر أولاً:");
  }

  const session = sessions[senderID];

  switch (session.step) {
    case 0:
      session.data.name = content;
      session.step++;
      return message.reply("📂 أرسل التصنيف (مثل: fun, group, admin):");

    case 1:
      session.data.category = content;
      session.data.code = "";
      session.step++;
      return message.reply("💻 أرسل الكود الآن (اكتب '<انتهى>' في نهاية الكود):");

    case 2:
      if (content === "<انتهى>") {
        const filePath = path.join(
          process.cwd(),
          "Plugins",
          "commands",
          session.data.category,
          `${session.data.name}.js`
        );

        try {
          await fs.ensureDir(path.dirname(filePath));
          await fs.writeFile(filePath, session.data.code, "utf-8");
          delete sessions[senderID];
          return message.reply(`✅ تم حفظ الأمر '${session.data.name}' في التصنيف '${session.data.category}' بنجاح.`);
        } catch (err) {
          delete sessions[senderID];
          return message.reply("❌ حدث خطأ أثناء الحفظ:\n" + err.message);
        }
      } else {
        session.data.code += content + "\n";
        return; // لا ترسل رد كل مرة
      }

    default:
      delete sessions[senderID];
      return message.reply("❌ خطأ غير متوقع، أعد المحاولة.");
  }
}

export default {
  config,
  onCall
};
