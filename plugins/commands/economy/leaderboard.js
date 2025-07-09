const config = {
  name: "القمة",
  aliases: ["top", "topam"],
  description: "يعرض أغنى المستخدمين في الرصيد العادي و بنك GOLD",
  usage: "",
  cooldown: 5,
  credits: "XaviaTeam (Modified for GOLD System)",
};

import fs from 'fs/promises';
import { join } from 'path';

const BANK_PATH = join(global.assetsPath, 'bankOwner.json');

async function onCall({ message, args }) {
  const { Users } = global.controllers;
  let top = parseInt(args[0]) || 10;
  if (top > 100) top = 100;

  // 🪙 1. TOP BY NORMAL BALANCE
  const allUsers = await Users.getAll();
  const topBalances = allUsers
    .filter((user) => user.data.money !== undefined)
    .sort((a, b) => b.data.money - a.data.money)
    .slice(0, top);

  let normalBalanceList = "";
  topBalances.forEach((user, index) => {
    const medal = index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `⭐`;
    normalBalanceList += `${medal} ${index + 1}. ${user.info.name}\n   🪙 الرصيد العادي: ${Number(user.data.money).toLocaleString()} ذهب\n\n`;
  });

  // 🏦 2. TOP BY BANK BALANCE
  let bankData = {};
  try {
    const data = await fs.readFile(BANK_PATH, 'utf8');
    bankData = JSON.parse(data);
  } catch (e) {
    console.error("❌ فشل قراءة بيانات البنك:", e);
  }

  const topBankAccounts = Object.entries(bankData)
    .map(([uid, info]) => ({
      userID: uid,
      name: info.name || "غير مسمى",
      coin: info.coin || 0
    }))
    .sort((a, b) => b.coin - a.coin)
    .slice(0, top);

  let bankBalanceList = "";
  topBankAccounts.forEach((account, index) => {
    const name = global.data.users.get(account.userID)?.info?.name || "مستخدم مجهول";
    const medal = index === 0 ? '🏆' : index === 1 ? '🎖️' : index === 2 ? '🏅' : `💼`;
    bankBalanceList += `${medal} ${index + 1}. ${account.name} (${name})\n   💰 رصيد البنك: ${account.coin.toLocaleString()} ذهب\n\n`;
  });

  const finalMsg = 
`╔═══ 💵 『𝐓𝐎𝐏 ${top} | الرصيد العادي』 💵 ═══╗\n\n${normalBalanceList}╚════════════════════════════╝

╔═══ 🏦 『𝐓𝐎𝐏 ${top} | بنك GOLD』 🏦 ═══╗\n\n${bankBalanceList}╚════════════════════════════╝`;

  try {
    await message.reply(finalMsg);
  } catch (err) {
    console.error(err);
  }
}

export default {
  config,
  onCall,
};
