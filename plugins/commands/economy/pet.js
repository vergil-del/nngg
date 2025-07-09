import fs from 'fs'; import axios from 'axios'; import { join } from 'path';

const config = { name: "حيوان", aliases: ["animal"], description: "Buy, feed, and sell your virtual pet", usage: "<buy/feed/check/sell>", cooldown: 6, credits: "Gauxy" };

const langData = { "ar_SY": { "pet.buySuccess": "⌜🎊⌟ : \n— مبروك، لقد تبنيت حيوانًا أليفًا جديدًا اسمه {petName}!", "pet.buyFailure": "⌜🤦🏻‍♂️⌟ : \n— لديك بالفعل حيوان أليف. اعتن به!", "pet.feedSuccess": "⌜🍖⌟ : \n— لقد أطعمْت {petName}. يبدو أكثر سعادة الآن! 💕", "pet.feedCost": "⌜💰⌟ : \n— تكلفة إطعام {petName} هي {feedCost} ذهب 🪙.", "pet.feedFailure": "⌜🙅🏻‍♂️⌟ : \n— لا يمكنك إطعام حيوان أليف لا تملكه.", "pet.noPet": "⌜🤷🏻‍♂️⌟ : \n— ليس لديك حيوان أليف. استخدم حيوان buy للحصول على واحد.", "pet.checkInfo": "⌜💁🏻‍♂️⌟ : \n— حيوانك الأليف {petName} نما وقيمته {petValue} 🪙. لا تنسى إطعامه!", "pet.sellSuccess": "⌜💰⌟ : \n— لقد بعت {petName} مقابل {amount} 🪙. وداعًا، صديقي الصغير!", "pet.sellFailure": "⌜🙅🏻‍♂️⌟ : \n— لا يمكنك بيع حيوان أليف.", } };

const PETS_PATH = join(global.assetsPath, 'petOwners.json'); const GROWTH_INTERVAL = 60 * 60 * 1000; // 1 ساعة const FEED_COST = 1000; let petOwners = new Map();

function loadPetOwners() { try { if (fs.existsSync(PETS_PATH)) { const data = fs.readFileSync(PETS_PATH, 'utf8'); const parsed = JSON.parse(data); for (const [id, pet] of Object.entries(parsed)) { petOwners.set(id, pet); } } } catch (e) { console.error("❌ فشل تحميل بيانات الحيوانات:", e); } }

function savePetOwners() { const toSave = {}; for (const [id, pet] of petOwners.entries()) { toSave[id] = pet; } fs.writeFileSync(PETS_PATH, JSON.stringify(toSave, null, 2)); }

function updatePetGrowth() { const now = Date.now(); for (const pet of petOwners.values()) { const elapsed = now - pet.lastFed; const cycles = Math.floor(elapsed / GROWTH_INTERVAL); const growthFactor = pet.growthFactor || 0.01; pet.value = Math.floor(pet.value * Math.pow(1 + growthFactor, cycles)); } savePetOwners(); }

loadPetOwners();

async function onCall({ message, getLang, args }) { const feeding = (await axios.get("https://i.imgur.com/82Knrjb.gif", { responseType: "stream" })).data; const pets = (await axios.get("https://i.imgur.com/uiq7lEw.png", { responseType: "stream" })).data; const { Users } = global.controllers;

if (!message || !message.body) return;

const { senderID } = message;

if (args.length === 0 || args[0] === "menu") { return message.reply({ body: "『 🐾 قائمة الحيوانات 🐾 』\n- حيوان buy <اسم> <مبلغ> لتبني حيوان\n- حيوان feed لإطعام الحيوان\n- حيوان check لفحص قيمته\n- حيوان sell لبيعه", attachment: pets }); }

if (args[0] === "buy") { if (args.length < 3) return message.reply("⌜💁🏻‍♂️⌟ : \n— اكتب اسم الحيوان والمبلغ."); if (petOwners.has(senderID)) return message.reply(getLang("pet.buyFailure"));

const petName = args[1];
const amount = parseInt(args[2]);
const max = 5_000_000_000;
const userBalance = await Users.getMoney(senderID);

if (!petName || isNaN(amount) || amount <= 0) return message.reply("⌜💁🏻‍♂️⌟ : \n— اكتب اسم الحيوان والمبلغ.");
if (amount > max) return message.reply("⌜🙅🏻‍♂️⌟ : \n— لا يمكنك شراء حيوان بأكثر من 5 مليار 🪙.");
if (userBalance < amount) return message.reply("⌜🙅🏻‍♂️⌟ : \n— ليس لديك رصيد كافٍ لشراء الحيوان.");

petOwners.set(senderID, {
  name: petName,
  value: amount,
  lastFed: Date.now(),
  growthFactor: 0.01
});
await Users.decreaseMoney(senderID, amount);
savePetOwners();

return message.reply(getLang("pet.buySuccess").replace("{petName}", petName));

}

if (args[0] === "feed") { if (!petOwners.has(senderID)) return message.reply(getLang("pet.noPet")); const petData = petOwners.get(senderID); const userBalance = await Users.getMoney(senderID);

if (userBalance < FEED_COST) return message.reply("⌜🙅🏻‍♂️⌟ : \n— لا تملك رصيد كافٍ لإطعام الحيوان.");

petData.lastFed = Date.now();
petData.value -= FEED_COST;
await Users.decreaseMoney(senderID, FEED_COST);
savePetOwners();

return message.reply({
  body: getLang("pet.feedSuccess").replace("{petName}", petData.name),
  attachment: feeding
});

}

if (args[0] === "check") { if (!petOwners.has(senderID)) return message.reply(getLang("pet.noPet")); const petData = petOwners.get(senderID);

const now = Date.now();
const elapsed = now - petData.lastFed;
const cycles = Math.floor(elapsed / GROWTH_INTERVAL);
const growthFactor = petData.growthFactor || 0.01;
const newValue = Math.floor(petData.value * Math.pow(1 + growthFactor, cycles));

return message.reply(getLang("pet.checkInfo")
  .replace("{petName}", petData.name)
  .replace("{petValue}", newValue));

}

if (args[0] === "sell") { if (!petOwners.has(senderID)) return message.reply(getLang("pet.noPet")); const petData = petOwners.get(senderID);

await Users.increaseMoney(senderID, petData.value);
petOwners.delete(senderID);
savePetOwners();

return message.reply(getLang("pet.sellSuccess")
  .replace("{petName}", petData.name)
  .replace("{amount}", petData.value));

}

return message.reply({ body: "『 🐾 قائمة الحيوانات 🐾 』\n- حيوان buy <اسم> <مبلغ> لتبني حيوان\n- حيوان feed لإطعام الحيوان\n- حيوان check لفحص قيمته\n- حيوان sell لبيعه", }); }

export default { config, langData, onCall };

  
