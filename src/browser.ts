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
  static async initFromURL(url: string | URL): Promise<Asciidoctor> {
    const response = await fetch(url);
    const decpressionStream = new DecompressionStream('gzip');
    const decompressedResponse = new Response(response.body!.pipeThrough(decpressionStream));
    decompressedResponse.headers.set('content-type', 'application/wasm');
    const module = await WebAssembly.compileStreaming(decompressedResponse);
    return this.initFromModule(module);
  }
}
