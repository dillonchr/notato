require("dotenv").config();
const { Client, Intents } = require("discord.js");
const { Sequelize, Model, DataTypes } = require("sequelize");

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.DIRECT_MESSAGES],
  partials: ["MESSAGE", "CHANNEL"]
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", message => {
  console.log("GOTTQ MASDMMGA");
  if (message.author.username !== client.user.username) {
    console.log({ message });
  }
  console.log({ message });
});
client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.reply("Pong!");
  } else if (commandName === "server") {
    await interaction.reply("Server info.");
  } else if (commandName === "user") {
    await interaction.reply("User info.");
  }
});

// Login to Discord with your client's token
client.login(process.env.BOT_TOKEN);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "/Users/dillon/git/DATAS/notato.sqlite"
});

class Note extends Model {}
Note.init(
  {
    label: DataTypes.STRING,
    note: DataTypes.BLOB,
    user_id: DataTypes.STRING
  },
  { sequelize, modelName: "note" }
);

/*
(async () => {
  await sequelize.sync();
  try {
    const note = await Note.create({
      label: "tv",
      note: "sup with that?",
      user_id: "me"
    });
    console.log({ note });
  } catch (err) {
    console.log({ err });
  }
})();
*/
