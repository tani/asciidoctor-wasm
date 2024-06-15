import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/browser';
import { Asciidoctor as AsciidoctorBase } from './asciidoctor.ts';
export type { AsciidoctorOptions } from './asciidoctor.ts';

export const wasmURL = new URL('../dist/asciidoctor.wasm', import.meta.url);

export class Asciidoctor extends AsciidoctorBase {
  static async initFromModule(module: WebAssembly.Module) {
    const base = await AsciidoctorBase.initFromModule(module, DefaultRubyVM);
    return new Asciidoctor(base.vm);
  }
  static async initFromURL(url: string | URL) {
    const module = await WebAssembly.compileStreaming(fetch(url));
    const base = await AsciidoctorBase.initFromModule(module, DefaultRubyVM);
    return new Asciidoctor(base.vm);
  }
}
