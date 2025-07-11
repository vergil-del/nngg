export default async function ({ event }) {
  const { threadID, senderID } = event;

  if (!global.data.messageStats) global.data.messageStats = {};
  if (!global.data.messageStats[threadID]) global.data.messageStats[threadID] = {};
  if (!global.data.messageStats[threadID][senderID]) {
    global.data.messageStats[threadID][senderID] = { count: 0, lastMessage: 0 };
  }

  global.data.messageStats[threadID][senderID].count++;
  global.data.messageStats[threadID][senderID].lastMessage = Date.now();
}