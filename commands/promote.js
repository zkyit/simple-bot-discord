module.exports = {
    name: "promote",
    async execute(m, args) {
        if (!m.member.permissions.has("MANAGE_ROLES")) return m.reply("You don't have permission.");
        const user = m.mentions.users.first();
        if (!user) return m.reply("Mention a user to promote.");
        const member = m.guild.members.cache.get(user.id);
        if (!member) return m.reply("User not found.");
        const role = m.guild.roles.cache.find(r => r.name === "Admin");
        if (!role) return m.reply("Admin role not found.");
        await member.roles.add(role);
        m.reply(`${user.tag} has been promoted to Admin.`);
    }
};
