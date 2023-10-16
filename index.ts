import {
  CacheType,
  ChannelType,
  ChatInputCommandInteraction,
  Client,
  ClientUser,
  Collection,
  Events,
  GatewayIntentBits,
  GuildMember,
  MessageType,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandNumberOption,
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
    if (fool.id === client.user?.id) {
      await interaction.reply({
        content: "not so fast, fucker",
        ephemeral: true,
      });
      return;
    }

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
    // un-eliminate
    const fool = interaction.options.getMember("fool") as GuildMember;
    if (fool.id === client.user?.id) {
      await interaction.reply({
        content: "you better, fucker",
        ephemeral: true,
      });
      return;
    }

    banished.splice(banished.indexOf(fool.id));

    // demagnetize
    delete magnetMap[fool.id];

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
    if (fool.id === client.user?.id) {
      await interaction.reply({
        content: "not so fast, fucker",
        ephemeral: true,
      });
      return;
    }

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
    if (fool.id === client.user?.id) {
      await interaction.reply({
        content: "not so fast, fucker",
        ephemeral: true,
      });
      return;
    }

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

    await interaction.reply({ content: "on it boss", ephemeral: true });

    for (let i = 0; i < drags; ++i) {
      let channel = fool.voice.channel;
      while (channel === fool.voice.channel)
        channel = vcs[Math.floor(vcs.length * Math.random())];

      await fool.edit({ deaf: true, mute: true, channel });

      console.log("BOING", fool.user.globalName);
    }

    // await fool.voice.disconnect(":troll:");
    await fool.edit({ deaf: true, mute: true, channel: oldVC });

    await interaction.followUp({
      content: "bouncing complete",
      ephemeral: true,
    });

    console.log("done bouncing", fool.user.globalName);
  },
};

const magnetMap: Record<string, () => Promise<void>> = {};
const fucking_magnetize: Command = {
  data: new SlashCommandBuilder()
    .setName("fucking_magnetize")
    .setDescription("suck up the fucker")
    .addUserOption(
      new SlashCommandUserOption()
        .setName("fool")
        .setDescription(
          "The idiot that has too much iron in their motherfucking blood"
        )
        .setRequired(true)
    )
    .addChannelOption(
      new SlashCommandChannelOption()
        .addChannelTypes(ChannelType.GuildVoice)
        .setName("vc")
        .setDescription("The voice channel to vacuum the fucker into")
        .setRequired(true)
    )
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName("duration")
        .setDescription(
          "In minutes, how long this idiot should be ferromagnetic"
        )
        .setMinValue(0)
        .setRequired(false)
    ),
  async execute(interaction) {
    const fool = interaction.options.getMember("fool") as GuildMember,
      vc = interaction.options.getChannel("vc") as VoiceBasedChannel,
      duration = interaction.options.getNumber("duration");
    if (fool.id === client.user?.id) {
      await interaction.reply({
        content: "not so fast, fucker",
        ephemeral: true,
      });
      return;
    }

    // const oldVC = fool.voice.channelId;
    // if (!oldVC) {
    //   await interaction.reply({
    //     content: "they ain't in a voice channel idiot",
    //     ephemeral: true,
    //   });
    //   return;
    // }

    await interaction.reply({ content: "on it boss", ephemeral: true });

    async function magnet() {
      if (fool.voice.channel && fool.voice.channel !== vc)
        await fool.edit({ channel: vc });
    }
    magnetMap[fool.id] = magnet;
    await magnet();

    if (duration) {
      setTimeout(async () => {
        delete magnetMap[fool.id];
        await interaction.followUp({
          content: "punishment complete",
          ephemeral: true,
        });
      }, duration * 60_000);
    }
  },
};

export const commands: Record<string, Command> = {
  fucking_eliminate,
  repent,
  fucking_carpet_bomb,
  fucking_jed_ult,
  fucking_magnetize,
};

// ! CLIENT STUFF
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
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

// ! EVENT LISTENERS
client.on(Events.MessageCreate, async (message) => {
  // console.log("someone talked:", message.toJSON());
  // elimination logic
  if (banished.includes(message.author.id) && message.deletable) {
    await message.delete();
    console.log("ZAP there goes", message.author.globalName);
  } else if (message.type === MessageType.UserJoin) {
    // new user logic
    await message.reply({ content: "you smell" });
  }
  // console.log(message.mentions.users);
  // console.log(client.user);
  else {
    // reply logic
    if (message.mentions.has(client.user as ClientUser)) {
      await message.reply({
        content:
          message.type === MessageType.Reply
            ? "fuck off ni-"
            : "the fuck you want",
      });
    }

    // plasmaphobia code logic
    if (/\d{6}/gi.test(message.content)) {
      await message.reply({
        content: `https://nhentai.net/g/${message.content}`,
        allowedMentions: { repliedUser: false },
      });
    }
  }
});
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
  // console.log("someone updated:", newState);
  if (magnetMap[newState.id]) {
    // console.log("updating...", oldState.channel?.name);
    await magnetMap[newState.id]();
    // console.log("update complete", oldState.channel?.name);
  }
});

// ! LOGIN
console.log("logging on...");
client
  .login(process.env.TOKEN)
  .then(() => console.log("successfully logged in!"));
