import type { RubyVM } from "@ruby/wasm-wasi/dist/vm";

type DefaultRubyVM = (module: WebAssembly.Module) => Promise<{ vm: RubyVM }>;

export interface AsciidoctorOptions {
  attributes?: { [key: string]: string | null | false };
  backend?: "html5" | "docbook5" | "manpage";
  doctype?: "article" | "book" | "manpage" | "inline";
  standalone?: boolean;
  sourcemap?: boolean;
  safe?: "safe" | "unsafe" | "server" | "secure";
}

export class Asciidoctor {
  vm: RubyVM
  constructor(vm: RubyVM) {
    this.vm = vm;
  }
  async convert(content: string, options: AsciidoctorOptions = {}) {
    const args = JSON.stringify([content, options]);
    const convert = await this.vm.evalAsync(`
      require 'asciidoctor'
      require 'json'
      lambda do |args|
        content, options = JSON.parse(args.to_s, symbolize_names: true)
        options[:safe] = options[:safe].to_sym if options.key?(:safe)
        Asciidoctor.convert(content.to_s, options)
      end
    `);
    const result = await convert.callAsync("call", this.vm.wrap(args));
    return result.toString();
  }
  static async initFromModule(module: WebAssembly.Module, DefaultRubyVM: DefaultRubyVM): Promise<Asciidoctor> {
    const { vm } = await DefaultRubyVM(module);
    return new Asciidoctor(vm)
  }
}
