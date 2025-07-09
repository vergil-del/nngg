import axios from 'axios'; import { join } from 'path'; import fs from 'fs/promises'; import Decimal from 'decimal.js';

const PATH = join(global.assetsPath, 'bankOwner.json');

const config = { name: 'بنك', aliases: ["bk", "b", "banking"], description: 'Bank GOLD System', usage: '<Use command to show menu>', cooldown: 3, permissions: [0, 1, 2], credits: 'XaviaTeam', extra: {} };

const langData = { "en_US": { "menu": ` ╔═⟪ ✧ 𝙂𝙊𝙇𝘿 𝘽𝘼𝙉𝙆 ✧ ⟫═╗ 💫 𝙒𝙚𝙡𝙘𝙤𝙢𝙚 𝙩𝙤 𝙩𝙝𝙚 𝙂𝙊𝙇𝘿 𝘽𝘼𝙉𝙆 💫

💼 𝙔𝙤𝙪𝙧 𝙊𝙥𝙩𝙞𝙤𝙣𝙨: 1️⃣ [register/r <name>] - 📝 Create a new bank account 2️⃣ [withdraw/w <amount>] - 💸 Withdraw GOLD 3️⃣ [deposit/d <amount>] - 💰 Deposit GOLD 4️⃣ [rename <name>] - ✏️ Rename your account 5️⃣ [check] - 🧾 View account info 6️⃣ [loan <amount>] - 📄 Request GOLD loan 7️⃣ [top <number>] - 🏆 View richest accounts

🛡️ 𝙈𝙤𝙙𝙚𝙧𝙖𝙩𝙤𝙧 𝙊𝙥𝙩𝙞𝙤𝙣𝙨: 8️⃣ [grant <name/id/index>] - ✅ Grant loan 9️⃣ [list] - 📋 View pending loans 🔟 [decline <name/index>] - ❌ Decline loan ╚════════════════════╝ `
},

"ar_SY": { "menu": ` ╔═⟪ ✧ 🪙 𝘽𝙉𝙆 𝙂𝙊𝙇𝘿 🪙 ⟫═╗ ✨ أهلاً بك في بنك الذهب ✨

💼 خياراتك: 1️⃣ [register/r <اسم>] - 📝 إنشاء حساب بنكي 2️⃣ [withdraw/w <مبلغ>] - 💸 سحب ذهب 3️⃣ [deposit/d <مبلغ>] - 💰 إيداع ذهب 4️⃣ [rename <اسم>] - ✏️ تغيير اسم الحساب 5️⃣ [check] - 🧾 معلومات الحساب 6️⃣ [loan <مبلغ>] - 📄 طلب قرض 7️⃣ [top <عدد>] - 🏆 أغنى الحسابات

🛡️ خيارات المطور: 8️⃣ [grant <اسم/ID/ترتيب>] - ✅ الموافقة على القرض 9️⃣ [list] - 📋 عرض القروض المعلقة 🔟 [decline <اسم/ترتيب>] - ❌ رفض القرض ╚════════════════════╝ ` } };

export default { config, langData, onCall: async function ({ message, args, getLang }) { const image = (await axios.get("https://i.imgur.com/a1Y3iHb.png", { responseType: "stream" })).data; if (args.length === 0) { message.reply({ body: getLang("menu"), attachment: image }); return; } } } // يتم الاحتفاظ بالباقي كما هو

