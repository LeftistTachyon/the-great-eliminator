import { REST, Routes } from "discord.js";
import { commands as c } from "./index";
import { config } from "dotenv";
config();

const commands = Object.values(c).map((command) => command.data.toJSON());
// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.TOKEN ?? "");

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationCommands(process.env.ID ?? ""),
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
    console.log(data);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
