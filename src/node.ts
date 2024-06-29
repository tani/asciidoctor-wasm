import { promises as fs } from 'node:fs';
import { gunzip } from 'node:zlib';
import { promisify } from 'node:util';
import { Asciidoctor as AsciidoctorBase } from './asciidoctor.ts';
export type { AsciidoctorOptions } from './asciidoctor.ts';

export const wasmURL: URL = new URL('../asciidoctor.wasm.gz', import.meta.url);

export class Asciidoctor extends AsciidoctorBase {
  static async initFromPath(path: string): Promise<Asciidoctor> {
    const compressed = await fs.readFile(path);
    const decompressed = await promisify(gunzip)(compressed);
    const module = await WebAssembly.compile(decompressed);
    return this.initFromModule(module);
  }
}
