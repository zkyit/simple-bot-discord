module.exports = {
    name: "kick",
    async execute(m, args) {
        if (!m.member.permissions.has("KICK_MEMBERS")) return m.reply("You don't have permission.");
        const user = m.mentions.users.first();
        if (!user) return m.reply("Mention a user to kick.");
        const member = m.guild.members.cache.get(user.id);
        if (!member) return m.reply("User not found.");
        await member.kick();
        m.reply(`${user.tag} has been kicked.`);
    }
};
