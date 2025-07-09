import fs from 'fs-extra';
import path from 'path';

const config = {
  name: "ارسال_حوالة",
  aliases: [],
  description: "يرسل حوالة ذهبية لأحد الأعضاء عن طريق كود",
  usage: "<المبلغ>",
  permission: 3, // للمطور فقط
  credits: "Muzan"
};

const transferPath = path.join(global.assetsPath, 'gold_transfers.json');

function loadTransfers() {
  try {
    return fs.readJsonSync(transferPath);
  } catch {
    return {};
  }
}

function saveTransfers(data) {
  fs.writeJsonSync(transferPath, data, { spaces: 2 });
}

function generateCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

async function onCall({ message, args }) {
  const { senderID } = message;

  const amount = parseInt(args[0]);
  if (isNaN(amount) || amount <= 0) {
    return message.reply("❌ يرجى تحديد مبلغ الحوالة بالذهب بشكل صحيح.\nمثال: ارسال_حوالة 500");
  }

  const code = generateCode();
  const transfers = loadTransfers();

  transfers[code] = {
    amount,
    sender: senderID,
    used: false
  };

  saveTransfers(transfers);

  return message.reply(
    `✅ تم إنشاء حوالة بنجاح 💰\n` +
    `🔑 كود الحوالة: ${code}\n` +
    `💛 المبلغ: ${amount} ذهب\n\n` +
    `أرسل هذا الكود للشخص المستلم ليستخدمه مع أمر [استلام_حوالة]`
  );
}

export default {
  config,
  onCall
};
