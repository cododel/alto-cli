import * as fs from "node:fs";
import * as fsp from "node:fs/promises";
import * as path from "node:path";

import * as chokidar from "chokidar";
import EventEmitter, { type Listener } from "eventemitter2";
import * as prettier from "prettier";
import { z } from "zod";

import { Registry, createRegistry } from "./registry";
import { type Schema } from "./schema";

import { fetchSchema } from "./schema";
import { type TemplateRenderer, createRenderer } from "./template";
import { type TemplateFile } from "./template-loader";

const GeneratorOptionsSchema = z.object({
  url: z
    .string()
    .optional()
    .default(process.env.DIRECTUS_URL ?? "http://localhost:8055"),
  token: z
    .string()
    .optional()
    .default(process.env.DIRECTUS_TOKEN ?? ""),
  template: z.string().optional().default("default"),
  config: z.string().optional().default("./.directus"),
  output: z
    .string()
    .optional()
    .default("./.directus/generated")
    .transform((value) => {
      if (!fs.existsSync(value)) {
        fs.mkdirSync(value, { recursive: true });
      }
      return value;
    }),
  useCache: z.boolean().default(false),
  watch: z.boolean().default(false),
  log: z.string().optional().default("info"),
});

export type GeneratorOptions = z.input<typeof GeneratorOptionsSchema>;
export type CompleteGeneratorOptions = z.output<typeof GeneratorOptionsSchema>;

export type GeneratorError = Error & {
  message: string;
  context: string[];
};

export type TypedEvents = Record<string | symbol, (...args: any[]) => any>;

export declare interface TypedEventEmitter<Events extends TypedEvents> {
  on<Event extends keyof Events>(
    event: Event | Event[],
    listener: (
      ...args: Parameters<Events[Event]>
    ) => Promise<Awaited<ReturnType<Events[Event]>>>,
  ): this | Listener;

  on<Event extends keyof Events>(
    event: Event | Event[],
    listener: (...args: Parameters<Events[Event]>) => void,
  ): this | Listener;

  emitAsync<Event extends keyof Events>(
    event: Event | Event[],
    ...args: Parameters<Events[Event]>
  ): Promise<Awaited<ReturnType<Events[Event]>>[]>;
}

export class TypedEventEmitter<
  Events extends TypedEvents,
> extends EventEmitter {}

export type GeneratorEvents = {
  ["initialization.begin"]: () => void;
  ["initialization.end"]: () => void;

  ["schema.begin"]: () => void;
  ["schema.success"]: () => void;
  ["schema.failure"]: (err: GeneratorError) => void;
  ["schema.error"]: (err: GeneratorError) => void;
  ["schema.end"]: () => void;

  ["generation.begin"]: () => void;
  ["generation.success"]: () => void;
  ["generation.failure"]: (err: GeneratorError) => void;
  ["generation.error"]: (err: GeneratorError) => void;
  ["generation.end"]: () => void;

  ["file.begin"]: (file: TemplateFile) => void;
  ["file.format.error"]: (file: TemplateFile, err: GeneratorError) => void;
  ["file.error"]: (file: TemplateFile, err: GeneratorError) => void;
  ["file.output"]: (file: TemplateFile, output: string) => void;
  ["file.end"]: (file: TemplateFile) => void;
  ["error"]: (err: GeneratorError) => void;
};

export class Generator extends TypedEventEmitter<GeneratorEvents> {
  private watcher: chokidar.FSWatcher;
  private watching: boolean = false;
  private schema: Schema = {
    version: 0,
    collections: [],
    fields: [],
    directus: "",
    relations: [],
    vendor: "",
  };
  private engines: Record<string, TemplateRenderer> = {};

  // @ts-expect-error
  private registry: Registry;

  private initialized: boolean = false;

  constructor(private options: CompleteGeneratorOptions) {
    super();

    this.watcher = new chokidar.FSWatcher({
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: true,
      ignorePermissionErrors: true,
    });
  }

  async initialize() {
    if (this.initialized) {
      return;
    }

    await this.runTask("initialization", async () => {
      if (this.schema.version) {
        return;
      }

      await this.runTask("schema", async () => {
        this.schema = await fetchSchema(
          {
            url: this.options.url,
            token: this.options.token,
          },
          {
            cache: path.join(this.options.config, "cache/schema.json"),
            useCache: this.options.useCache,
          },
        );
        this.registry = createRegistry(this.schema);
        this.initialized = true;
      });
    });
  }

  watch() {
    this.watching = true;
    this.watcher.on("all", async (_event, _path) => {
      await this.generate();
    });
    return this;
  }

  async generate(template?: string) {
    await this.initialize();

    await this.runTask("generation", async () => {
      const templateName = template ?? this.options.template;
      const templateDirs = [
        path.join(__dirname, "../default"),
        path.join(__dirname, "../../default"),
        this.options.config,
      ].filter((dir) => fs.existsSync(dir));

      const key = JSON.stringify({
        templateName,
        templateDirs,
      });

      const render =
        this.engines[key] ?? (await createRenderer(templateName, templateDirs));
      if (!(key in this.engines)) {
        this.engines[key] = render;
      }

      if (this.watching) {
        // this.watcher.add([
        //   ...engine.directories.map((dir) => path.join(dir, "**/*.njk")),
        // ]);
      }

      for (const file of render.files) {
        const targetPath = path.join(this.options.output, file.output);
        if (fs.existsSync(targetPath)) {
          await fsp.rm(targetPath);
        }
      }

      for (const file of render.files) {
        await this.runTask("file", async (emit) => {
          let result: string;

          await emit("render", file);

          result = await render(file.input, {
            schema: this.schema,
            registry: this.registry,
          });

          const info = await prettier.getFileInfo(file.output);
          if (info.inferredParser) {
            try {
              result = await prettier.format(result, {
                parser: info.inferredParser,
              });
            } catch (err) {
              await this.emitAsync(
                "file.format.error",
                file,
                this.makeError(err as any),
              );
              await this.emitAsync(
                "generation.error",
                this.makeError(err as any),
              );
            }
          }

          const dir = path.dirname(path.join(this.options.output, file.output));
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }

          await fsp.writeFile(
            path.join(this.options.output, file.output),
            result,
            {
              encoding: "utf-8",
            },
          );
          await this.emitAsync("file.output", file, result);
        });
      }
    });

    return this;
  }

  private async runTask<T, Params extends any[], Result extends any>(
    name: string,
    task: (
      emit: (event: string, ...args: Params) => Promise<Result[]>,
    ) => Promise<T>,
  ): Promise<T> {
    try {
      await this.emitAsync(`${name}.begin` as any);
      const result = await task(async (event, ...args) =>
        this.emitAsync(`${name}.${event}` as any, ...args),
      );
      await this.emitAsync(`${name}.success` as any, result);
      return result;
    } catch (err) {
      let wrapped = this.makeError(err as any);
      await this.emitAsync(`${name}.error` as any, wrapped);
      throw err;
    } finally {
      await this.emitAsync(`${name}.end` as any);
    }
  }

  private makeError(
    err: (Error & { context?: string }) | string,
  ): GeneratorError {
    let message: string;
    let context: string[] = [];

    if (typeof err != "string" && err != null) {
      message = (err?.message ?? "")
        .replace(/, file:/g, "\n")
        .replace(/, line:/g, ":")
        .replace(/, col:/g, ":");
      if (err?.context) {
        console.log(err);
        if (typeof err?.context == "string") {
          context = err?.context?.split("\n") ?? [];
        }
      }
    } else {
      message = err ?? "Unknown error";
    }

    if (typeof err == "string") {
      err = new Error(message);
    }

    return Object.assign(err, { message, context });
  }
}

export async function createGenerator(options: GeneratorOptions) {
  const opts: CompleteGeneratorOptions =
    await GeneratorOptionsSchema.parse(options);
  return new Generator(opts);
}
