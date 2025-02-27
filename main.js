require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const chalk = require('chalk');
const { exec } = require('child_process');
const { commands, loadCommands } = require('./lib/helper');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

fs.watch('./commands', (eventType, filename) => {
    if (filename && filename.endsWith('.js')) {
        loadCommands();
        console.log(chalk.green(`Command Updated: ${filename}`));
    }
});

client.once('ready', () => {
    loadCommands();
    const date = new Date().toLocaleString();
    console.log(chalk.green.bold("────────────────────────────────────"));
    console.log(chalk.yellow("Bot Name  :"), client.user.tag);
    console.log(chalk.yellow("Author    :"), "Itzky");
    console.log(chalk.yellow("Online At :"), date);
    console.log(chalk.green.bold("────────────────────────────────────"));
});

client.on('messageCreate', m => {
    if (m.author.bot) return;

    console.log(`
${chalk.blue.bold("────────────────────────────────────")}
${chalk.yellow("User:")} ${m.author.tag} (${m.author.id})
${chalk.yellow("Type:")} ${m.guild ? "Server" : "DM"}
${chalk.yellow("Chat:")} ${m.guild ? `${m.guild.name} / #${m.channel.name}` : "Direct Message"}
${chalk.yellow("Chat ID:")} ${m.channel.id}
${chalk.yellow("Message:")} ${m.content}
${chalk.blue.bold("────────────────────────────────────")}
    `);

    if (m.content.startsWith('$')) {
        if (m.author.id !== process.env.OWNER_ID) return m.reply("Khusus Owner");
        exec(m.content.slice(1), (err, stdout) => {
            if (err) return m.reply(`${err}`);
            if (stdout) return m.reply(stdout);
        });
        return;
    }

    const args = m.content.split(" ");
    const commandName = args.shift().toLowerCase().replace("!", "");
    if (commands.has(commandName)) {
        const command = commands.get(commandName);
        if (command.isOwner && m.author.id !== process.env.OWNER_ID) return m.reply("Khusus Owner");
        command.execute(m, args);
    }
});

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});

client.login(process.env.DISCORD_TOKEN);
