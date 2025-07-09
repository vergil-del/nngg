// ✅ تم الإبقاء على نظام حفظ البيانات كما هو، مع تعديل العملة إلى الذهب فقط

import fs from 'fs'; import axios from 'axios'; import { join } from 'path';

const config = { name: "منتجع", aliases: ["resort"], description: "نظام منتجع متكامل يتكامل مع بنك GOLD ويستخدم عملة الذهب فقط", usage: "", cooldown: 5, credits: "Dymyrius + Muzan" };

const resortImages = [ "https://i.imgur.com/SOA08ZY.png", "https://i.imgur.com/TJjSR0b.jpg", "https://i.imgur.com/2rbIdig.jpg", "https://i.imgur.com/B4LfB3N.png", "https://i.imgur.com/rAp1ht1.png", "https://i.imgur.com/m0U81MX.jpg", "https://i.imgur.com/cAYBO5u.jpg", "https://i.imgur.com/TlA5ses.jpg", "https://i.imgur.com/hHIw2Ay.jpg", "https://i.imgur.com/Sgj79Gi.jpg", "https://i.imgur.com/ZoldXIQ.png", "https://i.imgur.com/CZD4GrY.jpg", "https://i.imgur.com/kJciB1v.jpg", "https://i.imgur.com/8dbenRw.png", "https://i.imgur.com/OHpHq2I.png", "https://i.imgur.com/54iBcHP.jpg", "https://i.imgur.com/Hgr4MDD.jpg", "https://i.imgur.com/qUqWSMD.jpg", "https://i.imgur.com/8LtPOT9.jpg", "https://i.imgur.com/zokGGXP.jpg", "https://i.imgur.com/OxfHFlI.jpg", "https://i.imgur.com/c3Q7gxt.jpg", "https://i.imgur.com/4KvBgkQ.jpg", "https://i.imgur.com/AJikYqr.jpg" ];

const langData = { "ar_SY": { "resort.noResort": "ليس لديك منتجع. استخدم resort buy <اسم> للحصول على واحد.", "resort.buySuccess": "مبروك! لقد اشتريت منتجعًا اسمه {resortName}!", "resort.buyFailure": "ليس لديك ما يكفي من الذهب لشراء منتجع.", "resort.menuOptions": "◦❭❯❱【قائمة المنتجع】❰❮❬◦\n\nمرحبًا بك في نظام إدارة منتجع الكازينو! 🌴\n\nاختر خيارًا:\n• resort buy <الاسم> » شراء منتجع جديد.\n• resort check » التحقق من حالة منتجعك.\n• resort clean » تنظيف منتجعك.\n• resort upgrade » ترقية منتجعك.\n• resort collect » تحصيل قيمة الذهب.\n• resort rename <اسم> » تغيير اسم المنتجع." } };

const valueIncreaseInterval = 7 * 60 * 1000; const cleanCooldownDuration = 2 * 60 * 60 * 1000; const maxResortLevel = 24;

let cleanlinessCooldowns = new Map(); let userResorts = new Map(); const PATH = join(global.assetsPath, 'user_resorts.json');

function loadUserData() { try { const data = fs.readFileSync(PATH, 'utf8'); const parsedData = JSON.parse(data);

userResorts = new Map(parsedData.userResorts.map(([userID, userData]) => {
  const { lastUpgradeTime = 0, ...restData } = userData;
  return [userID, { ...restData, name: restData.name || "", lastUpgradeTime }];
}));
cleanlinessCooldowns = new Map(parsedData.cleanlinessCooldowns);

} catch (err) { console.error('❌ خطأ في تحميل بيانات المنتجعات:', err); } }

function saveUserData() { try { const data = JSON.stringify({ userResorts: Array.from(userResorts).map(([userID, userData]) => { const { lastUpgradeTime, ...restData } = userData; return [userID, { ...restData, name: restData.name || "", lastUpgradeTime }]; }), cleanlinessCooldowns: Array.from(cleanlinessCooldowns) }); fs.writeFileSync(PATH, data, 'utf8'); } catch (err) { console.error('❌ فشل حفظ بيانات المنتجعات:', err); } }

function calculateResortValue(level) { const baseValue = level * 10000; const valueIncrease = level * 3000 * level; const imageURL = resortImages[level - 1]; return { value: baseValue, valueIncrease, imageURL }; }

setInterval(() => { for (const [userID, userResort] of userResorts.entries()) { const { valueIncrease, imageURL } = calculateResortValue(userResort.level); userResort.value = (userResort.value || 0) + valueIncrease; userResort.cleanliness = Math.max(userResort.cleanliness - 2, 0); userResort.imageURL = imageURL; }

const currentTime = Date.now(); for (const [userID, lastCleanTime] of cleanlinessCooldowns.entries()) { if (currentTime - lastCleanTime >= cleanCooldownDuration) { cleanlinessCooldowns.delete(userID); } }

saveUserData(); }, valueIncreaseInterval);

loadUserData();

export default { config, langData, onCall };

  
