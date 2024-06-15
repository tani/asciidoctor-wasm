import { promises as fs } from 'node:fs';
import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/node';
import * as asciidoctor from './asciidoctor.ts';

/**
 * Initializes the Asciidoctor converter from a WebAssembly module.
 *
 * @async
 * @function initFromModule
 *
 * @param {WebAssembly.Module} module - The WebAssembly module to initialize from.
 * @returns {Promise<Convert>} A function that can be used to convert Asciidoctor content.
 */
export const initFromModule = (module: WebAssembly.Module) => asciidoctor.initFromModule(module, DefaultRubyVM);

/**
 * Initializes the Asciidoctor converter from a WebAssembly binary located at a URL.
 *
 * @async
 * @function initFromURL
 *
 * @param {URL} url - The URL of the WebAssembly binary.
 * @returns {Promise<Convert>} A function that can be used to convert Asciidoctor content.
 */
export async function initFromURL(url: string | URL): ReturnType<typeof initFromModule> {
  const module = await WebAssembly.compileStreaming(fetch(url));
  return asciidoctor.initFromModule(module, DefaultRubyVM);
}

/**
 * Initializes the WebAssembly module from a given path.
 *
 * @param {string} path - The path to the WebAssembly file.
 * @returns {Promise<Convert>} - A promise that resolves to a Convert function.
 */
export async function initFromPath(path: string): ReturnType<typeof initFromModule> {
  const module = await WebAssembly.compile(await fs.readFile(path));
  return asciidoctor.initFromModule(module, DefaultRubyVM);
}
