import type { TemplateContext } from "../../../types/template";

function stringifyFirst(fn: (...args: any[]) => any) {
  return (_context: TemplateContext, first: any, ...args: any[]) => {
    return fn(`${first}`, ...args).toString();
  };
}

export const lower_case = stringifyFirst(toLower);
export const pascal_case = stringifyFirst(toPascal);
export const space_case = stringifyFirst(toSpace);
export const camel_case = stringifyFirst(toCamel);

/**
 * Converts a string to lower case.
 * Example: "HelloWorld" -> "hello world"
 * @param {string} str - The input string.
 * @returns {string} The lowercased string.
 * @throws {Error} If the argument is not a string.
 */
export function toLower(str: string) {
  if (typeof str !== "string") {
    throw new Error("Argument must be a string");
  }
  return str.toLowerCase();
}

/**
 * Converts a string to space case.
 * Example: "HelloWorld" -> "hello world"
 * @param {string} str - The input string.
 * @returns {string} The spacecased string.
 * @throws {Error} If the argument is not a string.
 */
export function toSpace(str: string) {
  if (typeof str !== "string") {
    throw new Error("Argument must be a string");
  }

  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[\-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Converts a string to PascalCase.
 * Example: "hello world" -> "HelloWorld"
 * @param {string} str - The input string.
 * @returns {string} The Pascalcased string.
 * @throws {Error} If the argument is not a string.
 */
export function toPascal(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}

/**
 * Converts a string to camelCase.
 * Example: "HelloWorld" -> "helloWorld"
 * @param {string} str - The input string.
 * @returns {string} The camelcased string.
 * @throws {Error} If the argument is not a string.
 */
export function toCamel(str: string): string {
  const pascal = toPascal(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
