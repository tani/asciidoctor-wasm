import type { RubyVM } from "@ruby/wasm-wasi/dist/vm";

type DefaultRubyVM = (module: WebAssembly.Module) => Promise<{ vm: RubyVM }>;

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
  static async initFromModule(module: WebAssembly.Module, DefaultRubyVM: DefaultRubyVM): Promise<Asciidoctor> {
    const { vm } = await DefaultRubyVM(module);
    return new Asciidoctor(vm)
  }
}
