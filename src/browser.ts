// import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/browser';
import { DefaultRubyVM } from './ruby.ts';
import { Asciidoctor as AsciidoctorBase } from './asciidoctor.ts';
export type { AsciidoctorOptions } from './asciidoctor.ts';

export const wasmURL: URL = new URL('../asciidoctor.wasm.gz', import.meta.url);

export class Asciidoctor extends AsciidoctorBase {
  static async initFromModule(module: WebAssembly.Module): Promise<Asciidoctor> {
    const base = await AsciidoctorBase.initFromModule(module, DefaultRubyVM);
    return new Asciidoctor(base.vm);
  }
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
