const config = {
    name: "اوامر",
    _name: {
        "ar_SY": "الاوامر"
    },
    aliases: ["cmds", "commands"],
    version: "1.0.3",
    description: "Show all commands or command details",
    usage: "[command] (optional)",
    credits: "XaviaTeam"
}

const langData = {
    "en_US": {
        "help.list": "{list}\n\n⇒ Total: {total} commands\n⇒ Use {syntax} [command] to get more information about a command.",
        "help.commandNotExists": "Command {command} does not exist.",
        "help.commandDetails": `
            ⇒ Name: {name}
            ⇒ Aliases: {aliases}
            ⇒ Version: {version}
            ⇒ Description: {description}
            ⇒ Usage: {usage}
            ⇒ Permissions: {permissions}
            ⇒ Category: {category}
            ⇒ Cooldown: {cooldown}
            ⇒ Credits: {credits}
        `,
        "0": "Member",
        "1": "Group Admin",
        "2": "Bot Admin"
    },
    "vi_VN": {
        "help.list": "{list}\n\n⇒ Tổng cộng: {total} lệnh\n⇒ Sử dụng {syntax} [lệnh] để xem thêm thông tin về lệnh.",
        "help.commandNotExists": "Lệnh {command} không tồn tại.",
        "help.commandDetails": `
            ⇒ Tên: {name}
            ⇒ Tên khác: {aliases}
            ⇒ Phiên bản: {version}
            ⇒ Mô tả: {description}
            ⇒ Cách sử dụng: {usage}
            ⇒ Quyền hạn: {permissions}
            ⇒ Thể loại: {category}
            ⇒ Thời gian chờ: {cooldown}
            ⇒ Người viết: {credits}
        `,
        "0": "Thành viên",
        "1": "Quản trị nhóm",
        "2": "Quản trị البوت"
    },
    "ar_SY": {
        "help.list": "{list}\n\n➤ المجموع: {total} أمر\n➤ استخدم {syntax} [اسم الأمر] لعرض التفاصيل.\n\n⇨ المطور: ᏉᎬᏒᎶᎥᏞ ᏕᏢᎯᏒᎠᎯ\n⇨ صلي على النبي ﷺ",
        "help.commandNotExists": "الأمر {command} غير موجود.",
        "help.commandDetails": `
            ⇒ الاسم: {name}
            ⇒ أسماء بديلة: {aliases}
            ⇒ الوصف: {description}
            ⇒ الاستخدام: {usage}
            ⇒ الصلاحيات: {permissions}
            ⇒ الفئة: {category}
            ⇒ وقت الانتظار: {cooldown}
            ⇒ المطور: {credits}
        `,
        "0": "عضو",
        "1": "إدارة المجموعة",
        "2": "إدارة البوت"
    }
}

function getCommandName(commandName) {
    if (global.plugins.commandsAliases.has(commandName)) return commandName;

    for (let [key, value] of global.plugins.commandsAliases) {
        if (value.includes(commandName)) return key;
    }

    return null
}

async function onCall({ message, args, getLang, userPermissions, prefix, data }) {
    const { commandsConfig } = global.plugins;
    const commandName = args[0]?.toLowerCase();
    const language = data?.thread?.data?.language || global.config.LANGUAGE || 'en_US';

    if (!commandName) {
        let commands = {};

        for (const [key, value] of commandsConfig.entries()) {
            if (!!value.isHidden) continue;
            if (!!value.isAbsolute ? !global.config?.ABSOLUTES.some(e => e == message.senderID) : false) continue;
            if (!value.hasOwnProperty("permissions")) value.permissions = [0, 1, 2];
            if (!value.permissions.some(p => userPermissions.includes(p))) continue;

            const category = value.category || "Uncategorized";
            if (!commands.hasOwnProperty(category)) commands[category] = [];

            commands[category].push(value._name && value._name[language] ? value._name[language] : key);
        }

        let list = Object.keys(commands)
            .map(category =>
                `╭── ❖ 『 ${category.toUpperCase()} 』 ❖ ──╮\n│ ${commands[category].join("\n│ ")}\n╰───────────────────────╯`
            )
            .join("\n\n");

        message.reply(getLang("help.list", {
            total: Object.values(commands).map(e => e.length).reduce((a, b) => a + b, 0),
            list,
            syntax: prefix
        }));
    } else {
        const command = commandsConfig.get(getCommandName(commandName, commandsConfig));
        if (!command) return message.reply(getLang("help.commandNotExists", { command: commandName }));

        const isHidden = !!command.isHidden;
        const isUserValid = !!command.isAbsolute ? global.config?.ABSOLUTES.some(e => e == message.senderID) : true;
        const isPermissionValid = command.permissions.some(p => userPermissions.includes(p));
        if (isHidden || !isUserValid || !isPermissionValid)
            return message.reply(getLang("help.commandNotExists", { command: commandName }));

        message.reply(getLang("help.commandDetails", {
            name: command.name,
            aliases: command.aliases.join(", "),
            version: command.version || "1.0.0",
            description: command.description || '',
            usage: `${prefix}${commandName} ${command.usage || ''}`,
            permissions: command.permissions.map(p => getLang(String(p))).join(", "),
            category: command.category,
            cooldown: command.cooldown || 3,
            credits: command.credits || "XaviaTeam"
        }).replace(/^ +/gm, ''));
    }
}

export default {
    config,
    langData,
    onCall
}
