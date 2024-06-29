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

export interface AsciidoctorOptions {
  attributes?: { [key: string]: string | null | false | true };
  backend?: "html5" | "docbook5" | "manpage";
  doctype?: "article" | "book" | "manpage" | "inline";
  standalone?: boolean;
  sourcemap?: boolean;
  safe?: "safe" | "unsafe" | "server" | "secure";
}

export class Asciidoctor {
  vm: RubyVM
  code: string
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
  convertSync(content: string, options: AsciidoctorOptions = {}): string {
    const convert = this.vm.eval(this.code);
    const result = convert.call("call", this.vm.wrap(content), this.vm.wrap(options));
    return result.toString();
  }
  async convert(content: string, options: AsciidoctorOptions = {}): Promise<string> {
    const convert = await this.vm.evalAsync(this.code);
    const result = await convert.callAsync("call", this.vm.wrap(content), this.vm.wrap(options));
    return result.toString();
  }
  static async initFromModule(module: WebAssembly.Module): Promise<Asciidoctor> {
    const { vm } = await DefaultRubyVM(module);
    return new Asciidoctor(vm)
  }
}
