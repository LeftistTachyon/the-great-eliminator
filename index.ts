import {
  CacheType,
  ChatInputCommandInteraction,
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  GuildMember,
  SlashCommandBuilder,
  SlashCommandIntegerOption,
  SlashCommandUserOption,
  VoiceBasedChannel,
} from "discord.js";
import { config } from "dotenv";
config();

// ! TYPING STUFF
type Command = {
  data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
  execute: (
    interaction: ChatInputCommandInteraction<CacheType>
  ) => void | Promise<void>;
};

// ! COMMAND STUFF
const banished: string[] = [];
const fucking_eliminate: Command = {
  data: new SlashCommandBuilder()
    .setName("fucking_eliminate")
    .setDescription("Fucking eviscerate someone. Like utter destruction.")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("fool")
        .setDescription("The idiot that deserves this shit")
        .setRequired(true)
    ),
  async execute(interaction) {
    const fool = interaction.options.getMember("fool") as GuildMember;
    banished.push(fool.id);
    await interaction.reply({
      content: "aight they boutta be eliminated",
      ephemeral: true,
    });

    console.log("eliminated", fool.user.globalName);
  },
};

const repent: Command = {
  data: new SlashCommandBuilder()
    .setName("repent")
    .setDescription("Get a fool off the hook. For now.")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("fool")
        .setDescription("The idiot that desided not to act up no more")
        .setRequired(true)
    ),
  async execute(interaction) {
    const fool = interaction.options.getMember("fool") as GuildMember;
    banished.splice(banished.indexOf(fool.id));
    await interaction.reply({
      content: "aight fine",
      ephemeral: true,
    });

    console.log("repented", fool.user.globalName);
  },
};

const adj = [
    "actual",
    "factual",
    "empirical",
    "real",
    "10/10",
    "idiotic",
    "chlorinated",
  ],
  noun = [
    "redarf",
    "refard",
    "refactor",
    "refart",
    "retrad",
    "redrat",
    "redard",
  ];
// const carpetbomb_list: Record<string, number> = {};
const fucking_carpet_bomb: Command = {
  data: new SlashCommandBuilder()
    .setName("fucking_carpet_bomb")
    .setDescription(
      "Fucking unload on this motherfucker. Annoy the shit out of someone to no end."
    )
    .addUserOption(
      new SlashCommandUserOption()
        .setName("fool")
        .setDescription("The idiot that deserves this more than anyone else")
        .setRequired(true)
    )
    .addIntegerOption(
      new SlashCommandIntegerOption()
        .setName("roles")
        .setDescription("How many roles this utter fool is entitled to")
        .setMinValue(1)
        .setRequired(false)
    ),
  async execute(interaction) {
    const fool = interaction.options.getMember("fool") as GuildMember,
      roles = interaction.options.getInteger("roles") ?? 10;

    await interaction.reply({ content: "on it boss", ephemeral: true });

    const allRoles = [];
    for (let i = 0; i < roles; ++i) {
      const r = await interaction.guild?.roles.create({
        color: "Random",
        mentionable: true,
        name: `${adj[Math.floor(adj.length * Math.random())]} ${
          noun[Math.floor(noun.length * Math.random())]
        }`,
      });
      if (!r) {
        console.log("I CAN'T CREATE THE ROLE");
        continue;
      }

      allRoles.push(r);
      fool.roles.add(r);
    }

    for (const [_s, channel] of interaction.guild?.channels.cache ??
      new Collection()) {
      if (channel.isTextBased()) {
        for (let i = 0; i < 2; ++i) {
          const sent = await channel.send(
            allRoles[Math.floor(allRoles.length * Math.random())].toString()
          );
          await sent.delete();
        }
      }
    }

    console.log("carpet bombed", fool.user.globalName);
  },
};

const fucking_jed_ult: Command = {
  data: new SlashCommandBuilder()
    .setName("fucking_jed_ult")
    .setDescription("Fucking thrash this motherfucker all over the place.")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("fool")
        .setDescription("The idiot that deserves this shit and a half")
        .setRequired(true)
    )
    .addIntegerOption(
      new SlashCommandIntegerOption()
        .setName("drags")
        .setDescription("How many bounces in the bouncy house they get")
        .setMinValue(2)
        .setRequired(false)
    ),
  async execute(interaction) {
    const fool = interaction.options.getMember("fool") as GuildMember,
      drags = interaction.options.getInteger("drags") ?? 5;

    // console.log(fool.voice);

    const oldVC = fool.voice.channelId;
    if (!oldVC) {
      await interaction.reply({
        content: "they ain't in a voice channel idiot",
        ephemeral: true,
      });
      return;
    }

    const channels = interaction.guild?.channels.cache ?? new Collection(),
      vcs = channels
        .filter((ch) => ch.isVoiceBased())
        .map((a) => a as VoiceBasedChannel);

    await interaction.reply({ content: "on it boss :devil:", ephemeral: true });

    for (let i = 0; i < drags; ++i) {
      let channel = fool.voice.channel;
      while (channel == fool.voice.channel)
        channel = vcs[Math.floor(vcs.length * Math.random())];

      await fool.edit({ deaf: true, mute: true, channel });

      console.log("BOING", fool.user.globalName);
    }

    // await fool.voice.disconnect(":troll:");
    await fool.edit({ deaf: true, mute: true, channel: oldVC });

    console.log("done bouncing", fool.user.globalName);
  },
};

export const commands: Record<string, Command> = {
  fucking_eliminate,
  repent,
  fucking_carpet_bomb,
  fucking_jed_ult,
};

// ! CLIENT STUFF
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.member?.user.id !== "518196574052941857") {
    await interaction.reply({ content: "shut the fuck up", ephemeral: true });
    return;
  }
  // console.log(interaction);

  const command = commands[interaction.commandName];
  if (command) {
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "i fucked up",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "i fucked up",
          ephemeral: true,
        });
      }
    }
  } else {
    await interaction.reply({ content: "fuck you mean", ephemeral: true });
  }
});
client.on(Events.MessageCreate, async (message) => {
  // console.log("someone talked:", message.toJSON());
  if (banished.includes(message.author.id) && message.deletable) {
    await message.delete();
    console.log("ZAP there goes", message.author.globalName);
  }
});

// ! LOGIN
console.log("logging on");
client
  .login(process.env.TOKEN)
  .then(() => console.log("successfully logged in!"));
