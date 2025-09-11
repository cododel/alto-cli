#!/usr/bin/env bun
import { cli } from "./cli";

cli().catch((error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
