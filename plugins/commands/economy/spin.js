import fs from "fs"; import { join } from "path";

const config = { name: "استلام_حوالة", aliases: [], description: "يُستخدم لاستلام حوالة ذهب باستخدام كود الحوالة.", usage: "استلام_حوالة [كود]", cooldown: 3, credits: "Muzan" };

const TRANSFER_FILE = join(global.assetsPath, "gold_transfers.json");

function loadTransfers() { try { return JSON.parse(fs.readFileSync(TRANSFER_FILE, "utf8")); } catch (e) { return {}; } }

function saveTransfers(data) { fs.writeFileSync(TRANSFER_FILE, JSON.stringify(data, null, 2), "utf8"); }

async function onCall({ message, args }) { const { senderID } = message; const { increaseGold } = global.controllers.Currencies;

const code = args[0]?.toUpperCase();

if (!code) return message.reply("❗ أدخل كود الحوالة لاستخدامه، مثال: استلام_حوالة ABCD1234");

const transfers = loadTransfers(); const transfer = transfers[code];

if (!transfer) return message.reply("❌ الكود غير صحيح أو لا توجد حوالة بهذا الكود."); if (transfer.used) return message.reply("⚠️ تم استخدام هذا الكود مسبقًا."); if (transfer.receiver !== senderID) return message.reply("🚫 هذا الكود غير مخصص لك.");

await increaseGold(senderID, transfer.amount); transfer.used = true; transfer.usedAt = Date.now(); saveTransfers(transfers);

return message.reply(✅ تم استلام الحوالة بنجاح! 💰 تمت إضافة ${transfer.amount} ذهب إلى حسابك.); }

export default { config, onCall };

