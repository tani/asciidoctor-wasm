import { dirname } from "jsr:@std/path";
import { DefaultRubyVM } from "./ruby.ts";

/**
 * Interface for Asciidoctor options.
 *
 * @interface AsciidoctorOptions
 *
 * @property {Object} attributes - Key-value pairs of attributes to be used by Asciidoctor.
 * @property {'html5' | 'docbook5' | 'manpage'} backend - The backend to use for rendering.
 * @property {'article' | 'book' | 'manpage' | 'inline'} doctype - The document type to use for rendering.
 * @property {boolean} standalone - Whether to produce a standalone document.
 * @property {boolean} sourcemap - Whether to include a sourcemap in the output.
 */
export interface AsciidoctorOptions {
  attributes?: { [key: string]: string | null | false };
  backend?: "html5" | "docbook5" | "manpage";
  doctype?: "article" | "book" | "manpage" | "inline";
  standalone?: boolean;
  sourcemap?: boolean;
}

/**
 * Type definition for a function that converts Asciidoctor content to another format.
 *
 * @param {string} content - The Asciidoctor content to convert.
 * @param {AsciidoctorOptions} [options] - Optional conversion options.
 *
 * @returns {Promise<string>} The converted content.
 */
export type Convert = (
  content: string,
  options?: AsciidoctorOptions,
) => Promise<string>;

/**
 * URL for the Asciidoctor WebAssembly binary.
 *
 * @constant wasmURL
 * @type {string}
 */
export const wasmURL: string = `${dirname(import.meta.url)}/asciidoctor.wasm`;

/**
 * Initializes the Asciidoctor converter from a WebAssembly module.
 *
 * @async
 * @function initFromModule
 *
 * @param {WebAssembly.Module} module - The WebAssembly module to initialize from.
 *
 * @returns {Promise<Convert>} A function that can be used to convert Asciidoctor content.
 */
export async function initFromModule(
  module: WebAssembly.Module,
): Promise<Convert> {
  const { vm } = await DefaultRubyVM(module);
  const convert = await vm.evalAsync(`
    require 'asciidoctor'
    require 'json'
    lambda do |args|
      content, options = JSON.parse(args.to_s, symbolize_names: true)
      Asciidoctor.convert(content.to_s, options)
    end
  `);
  return async function (content: string, options: AsciidoctorOptions = {}) {
    const args = JSON.stringify([content, options]);
    const result = await convert.callAsync("call", vm.wrap(args));
    return result.toString();
  };
}

/**
 * Initializes the Asciidoctor converter from a WebAssembly binary located at a URL.
 *
 * @async
 * @function initFromURL
 *
 * @param {string} [url=wasmURL] - The URL of the WebAssembly binary. Defaults to `wasmURL`.
 *
 * @returns {Promise<Convert>} A function that can be used to convert Asciidoctor content.
 */
export async function initFromURL(url: string = wasmURL): Promise<Convert> {
  const module = await WebAssembly.compileStreaming(fetch(url));
  return initFromModule(module);
}
