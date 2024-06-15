import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/browser';
import { Asciidoctor } from './asciidoctor.ts';
export type { Asciidoctor, AsciidoctorOptions } from './asciidoctor.ts';

export const wasmURL = new URL('../dist/asciidoctor.wasm', import.meta.url);

/**
 * Initializes the Asciidoctor converter from a WebAssembly module.
 *
 * @async
 * @function initFromModule
 *
 * @param {WebAssembly.Module} module - The WebAssembly module to initialize from.
 * @returns {ReturnType<typeof initFromModule>} A function that can be used to convert Asciidoctor content.
 */
export const initFromModule = (module: WebAssembly.Module) => Asciidoctor.initFromModule(module, DefaultRubyVM);

/**
 * Initializes the Asciidoctor converter from a WebAssembly binary located at a URL.
 *
 * @async
 * @function initFromURL
 *
 * @param {URL} url - The URL of the WebAssembly binary.
 * @returns {ReturnType<typeof initFromModule>} A function that can be used to convert Asciidoctor content.
 */
export async function initFromURL(url: string | URL): ReturnType<typeof initFromModule> {
  const module = await WebAssembly.compileStreaming(fetch(url));
  return Asciidoctor.initFromModule(module, DefaultRubyVM);
}
