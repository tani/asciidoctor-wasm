/**
 * This module provides the browser-specific implementation of Asciidoctor.
 * @module
 */

import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/browser';
import { Asciidoctor as AsciidoctorBase } from './asciidoctor.ts';
export type { AsciidoctorOptions } from './asciidoctor.ts';

/**
 * URL for the WebAssembly module.
 */
export const wasmURL: URL = new URL('../asciidoctor.wasm.gz', import.meta.url);

/**
 * Class representing Asciidoctor.
 * @extends AsciidoctorBase
 */
export class Asciidoctor extends AsciidoctorBase {
  /**
   * Initialize Asciidoctor from a URL.
   * @param {string | URL} url - The URL to fetch the WebAssembly module from.
   * @return {Promise<Asciidoctor>} A promise that resolves to an instance of Asciidoctor.
   */
  static async initFromModule(module: WebAssembly.Module): Promise<Asciidoctor> {
    const base = await AsciidoctorBase.initFromModule(module, DefaultRubyVM);
    return new Asciidoctor(base.vm);
  }
/**
 * Initializes an Asciidoctor instance from a URL.
 *
 * This method fetches a WebAssembly module from the provided URL, decompresses it,
 * and initializes an Asciidoctor instance with it. The fetched WebAssembly module
 * is expected to be gzipped.
 *
 * @param url - The URL to fetch the WebAssembly module from.
 * @returns A promise that resolves to an Asciidoctor instance.
 */
static async initFromURL(url: string | URL): Promise<Asciidoctor> {
  const response = await fetch(url);
  const decpressionStream = new DecompressionStream('gzip');
  const decompressedResponse = new Response(response.body!.pipeThrough(decpressionStream));
  // set content-type to application/wasm
  decompressedResponse.headers.set('content-type', 'application/wasm');
  const module = await WebAssembly.compileStreaming(decompressedResponse);
  const base = await AsciidoctorBase.initFromModule(module, DefaultRubyVM);
  return new Asciidoctor(base.vm);
}
}
