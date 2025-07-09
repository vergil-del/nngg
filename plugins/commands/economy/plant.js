import fs from 'fs'; import axios from 'axios'; import { join } from 'path';

const config = { name: "نبات", aliases: ["grow"], description: "قم بشراء وزراعة النباتات لزيادة ذهبك 🪙", usage: "<buy/check/sell>", cooldown: 9, credits: "Ariél Violét (improved by: Rue)" };

const langData = { "ar_SY": { "plant.buySuccess": "🌱 | تم شراء النبات بنجاح! سينمو مع الوقت ويزيد من ذهبك 🪙.", "plant.buyFailure": "🪴 | لديك بالفعل نبات. افحصه أو قم ببيعه أولاً!", "plant.sellSuccess": "💰 | تم بيع نباتك مقابل {amount} 🪙.", "plant.noPlant": "🪴 | لا تملك أي نبات. استخدم نبات buy <المبلغ> لشراء واحد.", "plant.growthInfo": "📈 | نباتك نما! قيمته الآن: {value} 🪙.", "plant.checkInfo": "🔍 | قيمة نباتك الحالية: {value} 🪙\n━━━━━━━━━━━━━━━\nمعدل النمو لكل دورة: +{growthValue} 🪙" } };

let plantOwners = new Map(); const GROWTH_INTERVAL = 20 * 60 * 1000; const GROWTH_RATE = 0.03; const PATH = join(global.assetsPath, 'plant_owners.json');

function loadPlantOwners() { try { const data = fs.readFileSync(PATH, 'utf8'); plantOwners = new Map(JSON.parse(data)); } catch (err) { console.error('فشل تحميل بيانات النباتات:', err); } }

function savePlantOwners() { try { const data = JSON.stringify(Array.from(plantOwners)); fs.writeFileSync(PATH, data, 'utf8'); } catch (err) { console.error('فشل حفظ بيانات النباتات:', err); } }

loadPlantOwners();

async function onCall({ message, getLang, args }) { const { Users } = global.controllers; const { senderID } = message;

if (!message || !message.body) return;

if (args.length === 0 || args[0] === "menu") { return message.reply("🪴 قائمة النباتات 🪴\n1. نبات buy <المبلغ> لشراء نبات.\n2. نبات check لفحص قيمة النبات.\n3. نبات sell لبيع النبات."); }

if (args[0] === "buy") { if (plantOwners.has(senderID)) return message.reply(getLang("plant.buyFailure"));

const plantPrice = parseInt(args[1]);
if (isNaN(plantPrice) || plantPrice <= 0) return message.reply("❌ | يرجى إدخال مبلغ صحيح لشراء النبات.");

const MAX_AMOUNT = 5000000000;
if (plantPrice > MAX_AMOUNT) return message.reply(`🚫 | الحد الأقصى لشراء النبات هو ${MAX_AMOUNT.toLocaleString()} 🪙.`);

const userBalance = await Users.getMoney(senderID);
if (userBalance < plantPrice) return message.reply("❌ | لا تمتلك ما يكفي من الذهب 🪙 لشراء هذا النبات.");

await Users.decreaseMoney(senderID, plantPrice);
plantOwners.set(senderID, { name: message.senderName, value: plantPrice, lastUpdated: Date.now() });
savePlantOwners();
return message.reply(getLang("plant.buySuccess"));

}

if (args[0] === "check") { if (!plantOwners.has(senderID)) return message.reply(getLang("plant.noPlant"));

const plantData = plantOwners.get(senderID);
const plantValue = plantData.value;
const growthValue = Math.floor(plantValue * GROWTH_RATE);

return message.reply(getLang("plant.checkInfo")
  .replace("{value}", plantValue.toLocaleString())
  .replace("{growthValue}", growthValue.toLocaleString()));

}

if (args[0] === "sell") { if (!plantOwners.has(senderID)) return message.reply(getLang("plant.noPlant"));

const plantValue = plantOwners.get(senderID).value;
await Users.increaseMoney(senderID, plantValue);
plantOwners.delete(senderID);
savePlantOwners();
return message.reply(getLang("plant.sellSuccess").replace("{amount}", plantValue.toLocaleString()));

} }

export default { config, langData, onCall };

