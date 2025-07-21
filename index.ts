#!/usr/bin/env bun
import { cli } from "./cli.js";

cli().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
