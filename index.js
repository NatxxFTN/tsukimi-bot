const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Web server started");
});
require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

// ====================== READY ======================
client.once('ready', async () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);

  const channel = await client.channels.fetch(process.env.CHANNEL_ID);
  if (!channel) return console.log("❌ Salon introuvable");

  const embed = new EmbedBuilder()
    .setColor("#5865F2")
    .setTitle("🌙 TSUKIMI — RÈGLEMENT OFFICIEL")
    .setDescription(
      "Bienvenue sur **Tsukimi**.\n\n" +
      "Merci de lire attentivement le règlement.\n" +
      "Cliquez sur le bouton ci-dessous pour accepter et accéder au serveur."
    )
    .setImage("https://i.pinimg.com/736x/09/7e/f4/097ef48b8373d7e15ce1f325bc0023d4.jpg")
    .addFields(
      {
        name: "👥 Respect",
        value: "▫️ Aucun manque de respect\n▫️ Aucun harcèlement\n▫️ Aucune discrimination"
      },
      {
        name: "💬 Textuel",
        value: "▫️ Pas de spam\n▫️ Pas de pub\n▫️ Pas de NSFW"
      },
      {
        name: "🎙️ Vocal",
        value: "▫️ Pas de soundboard\n▫️ Pas de voice changer\n▫️ Pas de contenu choquant"
      }
    )
    .setFooter({ text: "Tsukimi — Serveur Officiel" });

  const button = new ButtonBuilder()
    .setCustomId("accept_rules")
    .setLabel("J'accepte le règlement")
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder().addComponents(button);

  await channel.send({
    embeds: [embed],
    components: [row]
  });

  console.log("✅ Message règlement envoyé !");
});

// ====================== BOUTON ======================
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  if (interaction.customId !== "accept_rules") return;

  const role = await interaction.guild.roles.fetch("1477700657069953189");

  if (!role) {
    return interaction.reply({
      content: "❌ Rôle introuvable.",
      ephemeral: true
    });
  }

  try {
    await interaction.member.roles.add(role);

    await interaction.reply({
      content: "✅ Règlement accepté ! Accès débloqué.",
      ephemeral: true
    });

  } catch (err) {
    console.error(err);
    await interaction.reply({
      content: "❌ Impossible de donner le rôle. Vérifie la hiérarchie.",
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);