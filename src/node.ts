import { promises as fs } from 'node:fs';
import { gunzip } from 'node:zlib';
import { promisify } from 'node:util';
import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/node';
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
    const module = await WebAssembly.compileStreaming(decompressedRespnose);
    const base = await AsciidoctorBase.initFromModule(module, DefaultRubyVM);
    return new Asciidoctor(base.vm);
  }
  static async initFromPath(path: string): Promise<Asciidoctor> {
    const compressed = await fs.readFile(path);
    const decompressed = await promisify(gunzip)(compressed);
    const module = await WebAssembly.compile(decompressed);
    const base = await AsciidoctorBase.initFromModule(module, DefaultRubyVM);
    return new Asciidoctor(base.vm);
  }
}
