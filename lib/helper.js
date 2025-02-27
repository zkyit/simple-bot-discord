const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const commands = new Map();

const loadCommands = () => {
    commands.clear();
    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        delete require.cache[require.resolve(`./commands/${file}`)];
        const command = require(`./commands/${file}`);
        commands.set(command.name, command);
    }

    console.log(chalk.cyan(`Commands Loaded: ${commandFiles.length} commands`));
};

module.exports = {
  commands,
  loadCommands
};