import { DefaultRubyVM } from '@ruby/wasm-wasi/dist/node';
import * as asciidoctor from './asciidoctor.ts';

export const initFromModule = (module: WebAssembly.Module) => asciidoctor.initFromModule(module, DefaultRubyVM);
export const initFromURL = (url: string | URL) => asciidoctor.initFromURL(url, DefaultRubyVM);
export const initFromPath = (path: string) => asciidoctor.initFromPath(path, DefaultRubyVM);
