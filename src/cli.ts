import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { typesCommand } from "./commands/types";

export function cli() {
  const yargsInstance = yargs(hideBin(process.argv))
    .scriptName("alto")
    .usage("$0 <command> [options]")
    .command(typesCommand)
    .demandCommand(1, "You need at least one command")
    .version()
    .alias("v", "version")
    .help()
    .completion("completion", "Generate bash completion script")
    .recommendCommands()
    .strict();

  return yargsInstance.argv as Promise<any>;
}
