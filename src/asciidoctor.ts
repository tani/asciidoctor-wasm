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
  constructor(vm: RubyVM) {
    this.vm = vm;
  }
  async convert(content: string, options: AsciidoctorOptions = {}) {
    const convert = await this.vm.evalAsync(`
      require 'asciidoctor'
      option_converter = {
        attributes: ->(value) {
          attrs = {}
          JS.global[:Object].entries(value).forEach do |obj|
            key, value = obj.to_a
            if value.typeof == 'string'
              attrs[key.to_s] = value.to_s
            elsif value.typeof == 'boolean'
              attrs[key.to_s] = !!value
            elsif value == nil
              attrs[key.to_s] = nil
            else
              attrs[key.to_s] = value
            end
          end
          attrs
        },
        backend: ->(value) { value.to_s },
        doctype: ->(value) { value.to_s },
        standalone: ->(value) { !!value },
        sourcemap: ->(value) { !!value },
        safe: ->(value) { value.to_s.to_sym }
      }
      lambda do |js_content, js_options|
        content = js_content.to_s
        options = {}
        JS.global[:Object].entries(js_options).forEach do |obj|
          key, value = obj.to_a
          if converter = option_converter[key.to_s.to_sym]
            options[key.to_s.to_sym] = converter.call(value)
          end
        end
        Asciidoctor.convert(content, options)
      end
    `);
    const result = await convert.callAsync("call", this.vm.wrap(content), this.vm.wrap(options));
    return result.toString();
  }
  static async initFromModule(module: WebAssembly.Module, DefaultRubyVM: DefaultRubyVM): Promise<Asciidoctor> {
    const { vm } = await DefaultRubyVM(module);
    return new Asciidoctor(vm)
  }
}
