require("dotenv").config();
const { Client, IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");
const { UserModel } = require("./models/userModel");
const keepAlive = require("../server");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Бд работает"))
  .catch((err) => console.log(err));

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds, IntentsBitField.Flags.GuildMembers],
});
client.Users = UserModel;
client.on("ready", async (client) => {
  console.log(`${client.user.tag} заработал`);
  const guild = client.guilds.cache.get("941349087905738832");
  const getGuildRole = (guild, roleName) => {
    const role = guild.roles.cache.find((role) => role.name === roleName);
    return role;
  };
  const createProfile = async (client) => {
    guild.members.fetch().then((members) => {
      members.each(async (member) => {
        const Db_user = await client.Users.findOne({
          userId: member.id,
        });

        if (Db_user != null) {
          if (Db_user.nickname != member.nickname) {
            await client.Users.updateOne(
              {
                userId: member.id,
              },
              { nickname: member.nickname }
            );
            const message = `Обновил никнейм в бд для ${member.nickname}`;
            client.channels
              .fetch("1093919570349273108") //создание акичей
              .then((channel) => channel.send(message))
              .catch((e) => console.log(e));
          }
        } else {
          if (member.nickname != null) {
            const FreshBloodRole = getGuildRole(guild, "FreshBlood");
            const newUser = new client.Users({
              nickname: member.nickname,
              userId: member.id,
              rating1v1: 1200,
              rating2v2: 1200,
              rating3v3: 1200,
              rank: "FreshBlood",
              k1v1: 40,
              k2v2: 40,
              k3v3: 40,
              defeats1v1: 0,
              victories1v1: 0,
              winrate1v1: 0,
              defeats2v2: 0,
              victories2v2: 0,
              winrate2v2: 0,
              defeats3v3: 0,
              victories3v3: 0,
              winrate3v3: 0,
            });
            newUser.save();

            await member.roles.add(FreshBloodRole);

            const message = `Создал профиль для ${member.nickname}`;
            client.channels
              .fetch("1093919570349273108") //создание акичей
              .then((channel) => channel.send(message))
              .catch((e) => console.log(e));
          }
        }
      });
    });
  };
  setTimeout(() => createProfile(client), 300000);
});

client.login(process.env.TOKEN);
keepAlive();
