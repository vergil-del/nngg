// متجر نصي يستخدم الذهب من بنك GOLD import fs from 'fs';

const config = { name: "المتجر", aliases: ["store", "shop"], description: "اعرض متجر الذهب واشترِ العناصر باستخدام عملة الذهب.", usage: "المتجر / المتجر شراء <رقم المنتج>", credits: "Muzan + ChatGPT" };

const items = [ { name: "💎 عضوية مميزة", price: 5000, effect: "premium" }, { name: "👑 عضوية VIP", price: 10000, effect: "vip" }, { name: "🏷️ خصم دائم 10%", price: 3000, effect: "discount" }, { name: "🎨 لون مخصص للاسم", price: 2000, effect: "custom_color" }, { name: "🔒 حماية من الطرد (لمدة أسبوع)", price: 4000, effect: "anti_kick" }, { name: "📣 إعلان ترويجي (يوم واحد)", price: 3500, effect: "ad" }, { name: "🎁 هدية عشوائية أسبوعية", price: 6000, effect: "weekly_gift" } ];

const userEffectsPath = './gold_shop_effects.json'; if (!fs.existsSync(userEffectsPath)) fs.writeFileSync(userEffectsPath, '{}');

function loadEffects() { return JSON.parse(fs.readFileSync(userEffectsPath, 'utf8')); }

function saveEffects(data) { fs.writeFileSync(userEffectsPath, JSON.stringify(data, null, 2)); }

async function onCall({ message, args, event, api }) { const { senderID, threadID } = event; const { Users } = global.controllers;

if (args[0] === "شراء") { const index = parseInt(args[1]) - 1; if (isNaN(index) || index < 0 || index >= items.length) { return message.reply("❌ رقم المنتج غير صالح."); }

const item = items[index];
const userGold = await Users.getGold(senderID);

if (userGold < item.price) {
  return message.reply(`❌ ليس لديك ما يكفي من الذهب. السعر: ${item.price} GOLD ✨`);
}

await Users.decreaseGold(senderID, item.price);
const effects = loadEffects();
if (!effects[senderID]) effects[senderID] = [];
effects[senderID].push(item.effect);
saveEffects(effects);

return message.reply(`✅ لقد اشتريت: ${item.name} مقابل ${item.price} GOLD. سيتم تفعيل الميزات قريبًا.`);

}

// عرض المتجر let storeText = "🛒 【 متجر الذهب 】\n\nاكتب: المتجر شراء <رقم المنتج> للشراء\n\n"; items.forEach((item, i) => { storeText += ${i + 1}. ${item.name} - 💰 ${item.price} GOLD\n; });

return message.reply(storeText); }

export default { config, onCall };

