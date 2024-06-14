import { readFile } from "node:fs/promises";
import type { RubyVM } from "@ruby/wasm-wasi/dist/vm";

type DefaultRubyVM = (module: WebAssembly.Module) => Promise<{ vm: RubyVM }>;

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
 * @property {'safe' | 'unsafe' | 'server' | 'secure'} safe - The safe mode to use for rendering.
 */
export interface AsciidoctorOptions {
  attributes?: { [key: string]: string | null | false };
  backend?: "html5" | "docbook5" | "manpage";
  doctype?: "article" | "book" | "manpage" | "inline";
  standalone?: boolean;
  sourcemap?: boolean;
  safe?: "safe" | "unsafe" | "server" | "secure";
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
 * Initializes the Asciidoctor converter from a WebAssembly module.
 *
 * @async
 * @function initFromModule
 *
 * @param {WebAssembly.Module} module - The WebAssembly module to initialize from.
 * @returns {Promise<Convert>} A function that can be used to convert Asciidoctor content.
 */
export async function initFromModule(
  module: WebAssembly.Module,
  DefaultRubyVM: DefaultRubyVM
): Promise<Convert> {
  const { vm } = await DefaultRubyVM(module);
  const convert = await vm.evalAsync(`
    require 'asciidoctor'
    require 'json'
    lambda do |args|
      content, options = JSON.parse(args.to_s, symbolize_names: true)
      options[:safe] = options[:safe].to_sym if options.key?(:safe)
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
 * @param {URL} url - The URL of the WebAssembly binary.
 * @returns {Promise<Convert>} A function that can be used to convert Asciidoctor content.
 */
export async function initFromURL(url: string | URL, DefaultRubyVM: DefaultRubyVM): ReturnType<typeof initFromModule> {
  const module = await WebAssembly.compileStreaming(fetch(url));
  return initFromModule(module, DefaultRubyVM);
}

/**
 * Initializes the WebAssembly module from a given path.
 *
 * @param {string} path - The path to the WebAssembly file.
 * @returns {Promise<Convert>} - A promise that resolves to a Convert function.
 */
export async function initFromPath(path: string, DefaultRubyVM: DefaultRubyVM): ReturnType<typeof initFromModule> {
  const module = await WebAssembly.compile(await readFile(path));
  return initFromModule(module, DefaultRubyVM);
}
