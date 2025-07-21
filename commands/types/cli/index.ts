import type { CommandModule } from "yargs";
import console from "./console";
import { createGenerator } from "./types/generator";
import * as path from "node:path";

export const generateCommand: CommandModule = {
  command: "generate",
  describe: "Generates an SDK for a given schema",
  builder: {
    url: {
      type: "string",
      required: true,
      description: "The URL of the Directus instance to generate an SDK for",
      default: process.env["DIRECTUS_URL"] ?? "http://localhost:8055",
    },
    token: {
      type: "string",
      required: true,
      description: "An static token with admin role assigned.",
      default: process.env["DIRECTUS_TOKEN"] ?? undefined,
    },
    dir: {
      type: "string",
      required: false,
      description: "Set a custom directory instead of '.directus'",
      default: "./.directus/",
    },
    outputDir: {
      type: "string",
      required: false,
      description: "Set a custom directory instead of '.directus'",
      default: "./.directus/generated",
    },
    cache: {
      type: "boolean",
      required: false,
      description:
        "Whether to enable caching to avoid subsequent requests to the server.",
      default: false,
    },
  },
  handler: async (argv) => {
    try {
      const generator = await createGenerator({
        url: argv.url as string,
        token: argv.token as string,
        config: argv.dir as string,
        output:
          (argv.outputDir as string) ??
          path.join(argv.dir as string, "generated"),
        template: "default",
        useCache: argv.cache as boolean,
      });

      generator.on("schema.begin", async () =>
        console.start("Fetching schema"),
      );
      generator.on("schema.success", async () =>
        console.success("Schema fetched"),
      );
      generator.on("schema.failure", async (err) => {
        console.fail("Error fetching schema");
        console.error(err);
      });

      generator.on("file.format.error", async (file, err) => {
        console.error("Error formatting file", err);
      });

      generator.on("generation.begin", async () =>
        console.start("Starting generation"),
      );
      generator.on("generation.success", async () =>
        console.success("Generation finished"),
      );
      generator.on("generation.failure", async (err) => {
        console.fail("Generation errror", err);
        console.error(err);
      });

      await generator.initialize();
      await generator.generate();
    } catch (e) {
      console.error(e instanceof Error ? e.message : String(e));
      console.error(e);
      process.exit(1);
    }
  },
};

export default generateCommand;
