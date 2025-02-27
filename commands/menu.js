const os = require("os");
const { uptime } = require("process");
const { formatUptime } require("../lib/myfunc")

module.exports = {
    name: "menu",
    execute(m) {
        const commands = require("fs")
            .readdirSync("./commands")
            .filter(file => file.endsWith(".js"))
            .map(file => require(`./${file}`));

        let categories = {};
        commands.forEach((cmd) => {
            const category = cmd.category || "other";
            if (!categories[category]) categories[category] = [];
            categories[category].push(cmd.name);
        });

        let botUptime = formatUptime(uptime());
        let cpuModel = os.cpus()[0].model;
        let totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2) + " GB";
        let freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2) + " GB";
        let serverName = os.hostname();

        let message = `── INFO BOT ──\n`;
        message += `Bot Name : ${m.client.user.username}\n`;
        message += `Bot ID   : ${m.client.user.id}\n`;
        message += `Uptime   : ${botUptime}\n\n`;

        message += `── INFO SERVER ──\n`;
        message += `Server Name : ${serverName}\n`;
        message += `CPU         : ${cpuModel}\n`;
        message += `RAM Used    : ${totalRam} (Free: ${freeRam})\n\n`;

        message += `── INFO USER ──\n`;
        message += `Username : <@${m.author.id}>\n`;
        message += `User ID  : \`${m.author.id}\`\n\n`;

        message += `── COMMAND LIST ──\n`;
        let index = 1;
        for (const [category, cmds] of Object.entries(categories)) {
            message += `\n[ ${category.toUpperCase()} ]\n`;
            cmds.forEach(cmd => {
                message += `${index}. ${cmd}\n`;
                index++;
            });
        }

        m.reply(message);
    },
};

