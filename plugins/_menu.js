const plugins = require("../lib/plugins");
const { bot, isPrivate, clockString, pm2Uptime } = require("../lib");
const { OWNER_NAME, BOT_NAME,HANDLERS } = require("../config");
const { hostname } = require("os");

bot(
  {
    pattern: "menu",
    fromMe: isPrivate,
    desc: "Show All Commands",
    dontAddCommandList: true,
    type: "user",
  },
  async (message, match) => {
    const handlerChar = HANDLERS.replace(/\[|\]/g, "").charAt(0); // Get - or ! or .

    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363298577467093@newsletter',
        newsletterName: BOT_NAME,
        serverMessageId: -1
      },
    };

    if (match) {
      for (let i of plugins.commands) {
        if (
          i.pattern instanceof RegExp &&
          i.pattern.test(message.prefix + match)
        ) {
          const cmdName = i.pattern.toString().split(/\W+/)[1];
          return message.reply(`Command: ${message.prefix}${cmdName.trim()}\nDescription: ${i.desc}`);
        }
      }
    }

    let { prefix } = message;
    let [date, time] = new Date()
      .toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      .split(",");

    let menu = `╭━ᆫ ${BOT_NAME} ᄀ━
┃ ⎆  OWNER   : ${OWNER_NAME}
┃ ⎆  PREFIX  : ${prefix}
┃ ⎆  DATE    : ${date}
┃ ⎆  TIME    : ${time}
┃ ⎆  COMMANDS: ${plugins.commands.length}
╰━━━━━━━━━━━━\n`;

    let cmnd = [];
    let cmd;
    let category = [];

    plugins.commands.forEach((command) => {
      if (command.pattern instanceof RegExp) {
        cmd = command.pattern.toString().split(/\W+/)[1];
      }

      if (!command.dontAddCommandList && cmd !== undefined) {
        let type = command.type ? command.type.toLowerCase() : "misc";
        cmnd.push({ cmd, type });
        if (!category.includes(type)) category.push(type);
      }
    });

    cmnd.sort();
    category.sort().forEach((cmmd) => {
      let comad = cmnd.filter(({ type }) => type === cmmd);
      comad.forEach(({ cmd }) => {
        menu += `\n> ${cmd.trim()}`;
      });
    });

    await message.client.sendMessage(
      message.jid,
      {
        image: { url: 'https://files.catbox.moe/45n54r.png' },
        caption: menu,
        title: "",
        subtitle: "Connect with us",
        footer: "Open Base",
        interactiveButtons: [
          {
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
              display_text: "𝗢𝘄𝗻𝗲𝗿",
              id: `${handlerChar}owner`
            }),
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "𝗧𝗲𝗹𝗲𝗴𝗿𝗮𝗺 𝗦𝘂𝗽𝗽𝗼𝗿𝘁",
              url: "https://t.me/izumi_xddd"
            }),
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              display_text: "𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 𝗰𝗵𝗮𝗻𝗻𝗲𝗹",
              url: "https://whatsapp.com/channel/0029Vaf2tKvGZNCmuSg8ma2O"
            }),
          }
        ],
        contextInfo,
        viewOnce: true,
        linkPreview: true // ✅ link preview enabled
      },
      {
        quoted: message.data
      }
    );
  }
);
bot(
  {
    pattern: "list",
    fromMe: isPrivate,
    desc: "Show All Commands",
    type: "user",
    dontAddCommandList: true,
  },
  async (message, match, { prefix }) => {
    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363298577467093@newsletter',
        newsletterName: BOT_NAME,
        serverMessageId: -1
      }
    };
    let menu = "Command List\n";

    let cmnd = [];
    let cmd, desc;
    plugins.commands.map((command) => {
      if (command.pattern) {
        cmd = command.pattern.toString().split(/\W+/)[1];
      }
      desc = command.desc || false;

      if (!command.dontAddCommandList && cmd !== undefined) {
        cmnd.push({ cmd, desc });
      }
    });
    cmnd.sort();
    cmnd.forEach(({ cmd, desc }, num) => {
      menu += `\n${num + 1}. ${cmd.trim()}\n`;
      if (desc) menu += `Use: ${desc}`;
    });
    menu += ``;
  return await message.client.sendMessage(
      message.jid,
      {
        text: menu,
        contextInfo
      },
      {
        quoted: {
          key: message.key,
          message: {
            conversation: message.text || message.body || ''
          }
        }
      }
    )
  }
);
bot(
  {
    pattern: "ping",
    fromMe: isPrivate,
    desc: "To check if the bot is awake",
    type: "user",
  },
  async (message, match) => {
    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363298577467093@newsletter',
        newsletterName: BOT_NAME,
        serverMessageId: -1
      }
    };

    const start = Date.now();

    // Simulate some processing work
    for (let i = 0; i < 1e6; i++) {
      Math.sqrt(i);
    }

    const end = Date.now();
    const speed = end - start;

    await message.client.sendMessage(
      message.jid,
      {
        text: `Bot speed: ${speed} ms`,
        contextInfo
      },
      {
        quoted: {
          key: message.key,
          message: {
            conversation: message.text || message.body || ''
          }
        }
      }
    );
  }
);

bot({
  pattern: 'reboot$',
  fromMe: true,
  desc: 'Restart the bot',
  type: 'user'
}, async (message, client) => {
  await message.sendMessage(message.jid, "_rebooting_");
  return require('pm2').restart('index.js');
});
