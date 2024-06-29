import { Asciidoctor as AsciidoctorBase } from './asciidoctor.ts';
export type { AsciidoctorOptions } from './asciidoctor.ts';

export const wasmURL: URL = new URL('../asciidoctor.wasm.gz', import.meta.url);

export class Asciidoctor extends AsciidoctorBase {
  static async initFromURL(url: string | URL): Promise<Asciidoctor> {
    const response = await fetch(url);
    const decpressionStream = new DecompressionStream('gzip');
    const decompressedResponse = new Response(response.body!.pipeThrough(decpressionStream));
    decompressedResponse.headers.set('content-type', 'application/wasm');
    const module = await WebAssembly.compileStreaming(decompressedResponse);
    return this.initFromModule(module);
  }
}
