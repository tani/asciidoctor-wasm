import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/browser';
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
