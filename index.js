require("dotenv").config();
const moment = require("moment");
const { Client, Intents } = require("discord.js");
const { Sequelize, Model, DataTypes } = require("sequelize");

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

// Create a new client instance
const client = new Client({
  intents: [Intents.FLAGS.DIRECT_MESSAGES],
  partials: ["MESSAGE", "CHANNEL"]
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
  console.log("Ready!");
});

function cleanLabel(label) {
  const trimmedLowered = label.trim().toLowerCase();
  if ("today" === label) {
    return moment().format("MM/DD/YYYY");
  }
  return trimmedLowered;
}

client.on("messageCreate", async message => {
  if (!message.author.bot) {
    const note = message.content.trim();
    const split = note.split(":");
    if (1 < split.length) {
      const newNote = await Note.create({
        label: cleanLabel(split.shift()),
        note: split.join(":").trim(),
        user_id: message.author.id
      });
      message.channel.send(`💆‍♀️ \`${newNote.label}:${newNote.id}\``);
    } else {
      const lower = note.toLowerCase();
      switch (true) {
        case /^view\b/.test(lower):
          {
            const allNotes = await Note.findAll({
              where: { user_id: message.author.id }
            });
            for (const note of allNotes) {
              message.channel.send(`\`${note.label}:\` ${note.note}`);
            }
          }
          break;
        case /^tag\b/.test(lower):
          {
            const label = lower.replace(/^tag\b/, "").trim();
            const filteredNotes = await Note.findAll({
              where: {
                user_id: message.author.id,
                label
              }
            });
            if (0 < filteredNotes.length) {
              for (const note of filteredNotes) {
                try {
                  if (note.note) {
                    message.channel.send(note.note.toString());
                  }
                } catch (err) {
                  console.log({ err });
                }
              }
            } else {
              message.channel.send(`No notes for \`${label}\` yet.`);
            }
          }
          break;
        case /^all$/.test(lower):
          for (const note of await Note.findAll({
            where: { user_id: message.author.id }
          })) {
            message.channel.send(`\`${note.label}:\` ${note.note.toString()}`);
          }
          break;
      }
    }
  }
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
