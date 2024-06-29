/**
 * This module provides the node-specific implementation of Asciidoctor.
 * @module
 */

import { promises as fs } from 'node:fs';
import { gunzip } from 'node:zlib';
import { promisify } from 'node:util';
import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/node';
import { Asciidoctor as AsciidoctorBase } from './asciidoctor.ts';
export type { AsciidoctorOptions } from './asciidoctor.ts';

/**
 * URL for the WebAssembly module.
 */
export const wasmURL: URL = new URL('../asciidoctor.wasm.gz', import.meta.url);

/**
 * Class representing Asciidoctor.
 */
export class Asciidoctor extends AsciidoctorBase {
  /**
   * Initialize Asciidoctor from a given path.
   * 
   * @param {string} path - The path to the WebAssembly module.
   * @returns {Promise<Asciidoctor>} - A promise that resolves to an instance of Asciidoctor.
   */
  static async initFromModule(module: WebAssembly.Module): Promise<Asciidoctor> {
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
