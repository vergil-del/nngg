// ✅ أمر المطور: تحكم في ذهب أي مستخدم (عرض، إضافة، خصم، تصفير فقط)

import { getBankData, setBankData } from "../../database/bank.js";

const config = { name: "تحكم-ذهب", aliases: ["goldctl"], description: "عرض أو تعديل رصيد ذهب مستخدم معين (رد أو تاق فقط)", usage: "رد أو تاق ثم: goldctl <اضافة|خصم|تصفير> <الكمية>", cooldown: 5, permissions: [2], // مطور فقط credits: "Muzan" };

async function onCall({ message, args, event }) { const targetID = event.messageReply?.senderID || event.mentions && Object.keys(event.mentions)[0]; const senderID = event.senderID;

if (!targetID) { return message.reply("👤 من فضلك قم بالرد على رسالة المستخدم أو اعمل له تاق!"); }

const bank = await getBankData(targetID);

if (args.length === 0) { return message.reply(💰 رصيد الذهب لدى المستخدم هو: ${bank.gold} 🪙); }

const command = args[0]; const amount = parseInt(args[1]);

if (["اضافة", "خصم"].includes(command) && (isNaN(amount) || amount <= 0)) { return message.reply("📌 من فضلك أدخل كمية صالحة."); }

switch (command) { case "اضافة": { bank.gold += amount; await setBankData(targetID, bank); return message.reply(✅ تم إضافة ${amount} ذهب إلى المستخدم. الرصيد الجديد: ${bank.gold} 🪙); } case "خصم": { if (bank.gold < amount) return message.reply("❌ المستخدم لا يملك هذه الكمية."); bank.gold -= amount; await setBankData(targetID, bank); return message.reply(✅ تم خصم ${amount} ذهب من المستخدم. الرصيد الحالي: ${bank.gold} 🪙); } case "تصفير": { bank.gold = 0; await setBankData(targetID, bank); return message.reply("🧹 تم تصفير رصيد الذهب بنجاح."); } default: return message.reply("❗ الأوامر المتاحة: اضافة، خصم، تصفير"); } }

export default { config, onCall };

                                  
