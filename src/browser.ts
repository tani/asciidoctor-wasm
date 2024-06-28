import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/browser';
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
    const decompressedRespnose = new Response(response.body!.pipeThrough(decpressionStream));
    // set content-type to application/wasm
    decompressedRespnose.headers.set('content-type', 'application/wasm');
    const module = await WebAssembly.compileStreaming(decompressedRespnose);
    const base = await AsciidoctorBase.initFromModule(module, DefaultRubyVM);
    return new Asciidoctor(base.vm);
  }
}
