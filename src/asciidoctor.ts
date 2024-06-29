import { RubyVM } from "@ruby/wasm-wasi/dist/vm";
import { WASI, useAll } from "uwasi";

interface Result {
  vm: RubyVM,
  wasi: WASI,
  instance: WebAssembly.Instance
}

// This code is based on ruby/wasm-wasi licensed under the MIT License
async function DefaultRubyVM(rubyModule: WebAssembly.Module): Promise<Result> {
  const wasi = new WASI({features: [useAll()]});
  const vm = new RubyVM();
  const imports = { wasi_snapshot_preview1: wasi.wasiImport };
  vm.addToImports(imports);
  const instance = await WebAssembly.instantiate(rubyModule, imports);
  await vm.setInstance(instance);
  wasi.initialize(instance);
  vm.initialize();
  return { vm, wasi, instance };
};

/**
 * Interface for the options that can be passed to the Asciidoctor converter.
 * @interface
 * @property {Object} attributes - Key-value pairs of attributes to be used in the AsciiDoc content.
 * @property {"html5"|"docbook5"|"manpage"} backend - The backend to use for the conversion. Default is "html5".
 * @property {"article"|"book"|"manpage"|"inline"} doctype - The doctype to use for the conversion. Default is "article".
 * @property {boolean} standalone - Whether to produce a standalone document. Default is false.
 * @property {boolean} sourcemap - Whether to include a sourcemap in the output. Default is false.
 * @property {"safe"|"unsafe"|"server"|"secure"} safe - The safe mode to use for the conversion. Default is "secure".
 */
export interface AsciidoctorOptions {
  attributes?: { [key: string]: string | null | false | true };
  backend?: "html5" | "docbook5" | "manpage";
  doctype?: "article" | "book" | "manpage" | "inline";
  standalone?: boolean;
  sourcemap?: boolean;
  safe?: "safe" | "unsafe" | "server" | "secure";
}

/**
 * The Asciidoctor class is a TypeScript wrapper for the Asciidoctor Ruby library.
 * It uses a Ruby virtual machine (VM) to run Asciidoctor and convert AsciiDoc content to other formats.
 */
export class Asciidoctor {
  vm: RubyVM
  code: string

  /**
   * The constructor for the Asciidoctor class.
   * @param {RubyVM} vm - The Ruby virtual machine to use for running Asciidoctor.
   */
  constructor(vm: RubyVM) {
    this.vm = vm;
    this.code = `
      require 'asciidoctor'
      require 'js'
      require 'json'
      lambda do |js_content, js_options|
        options = {}
        for key, value in JSON.parse(JS.global[:JSON].stringify(js_options).to_s)
          options[key.to_sym] = value
        end
        content = js_content.to_s
        Asciidoctor.convert(content, options)
      end
    `
  }

  /**
   * Synchronously converts AsciiDoc content to another format using Asciidoctor.
   * @param {string} content - The AsciiDoc content to convert.
   * @param {AsciidoctorOptions} options - The options to use for the conversion.
   * @returns {string} The converted content.
   */
  convertSync(content: string, options: AsciidoctorOptions = {}): string {
    const convert = this.vm.eval(this.code);
    const result = convert.call("call", this.vm.wrap(content), this.vm.wrap(options));
    return result.toString();
  }

  /**
   * Asynchronously converts AsciiDoc content to another format using Asciidoctor.
   * @param {string} content - The AsciiDoc content to convert.
   * @param {AsciidoctorOptions} options - The options to use for the conversion.
   * @returns {Promise<string>} A promise that resolves to the converted content.
   */
  async convert(content: string, options: AsciidoctorOptions = {}): Promise<string> {
    const convert = await this.vm.evalAsync(this.code);
    const result = await convert.callAsync("call", this.vm.wrap(content), this.vm.wrap(options));
    return result.toString();
  }

  /**
   * Initializes an Asciidoctor instance from a WebAssembly module.
   * @param {WebAssembly.Module} module - The WebAssembly module to use for initializing the Ruby VM.
   * @returns {Promise<Asciidoctor>} A promise that resolves to an Asciidoctor instance.
   */
  static async initFromModule(module: WebAssembly.Module): Promise<Asciidoctor> {
    const { vm } = await DefaultRubyVM(module);
    return new Asciidoctor(vm)
  }
}
