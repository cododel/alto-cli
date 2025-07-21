import type { CommandModule } from "yargs";
import { generateCommand } from "./cli";

export const typesCommand: CommandModule = {
  command: "types",
  describe: "Generate types for a Directus project",
  builder: (yargs) => {
    return yargs
      .command(generateCommand)
      .demandCommand(
        1,
        "You need to specify a command. Use --help for more information.",
      )
      .help();
  },
  handler: () => {},
};
