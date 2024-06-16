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
      require 'js'
      lambda do |js_content, js_options|
        options = {}
        JS.global[:Object].entries(js_options).forEach do |obj|
          key, value = obj.to_a
          case key.to_s
          in 'attributes'
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
            options[key.to_s.to_sym] = attrs
          in 'safe'
            options[key.to_s.to_sym] = value.to_s.to_sym
          in 'standalone', 'sourcemap'
            options[key.to_s.to_sym] = !!value
          in 'backend', 'doctype'
            options[key.to_s.to_sym] = value.to_s
          else
            options[key.to_s.to_sym] = value
          end
        end
        content = js_content.to_s
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
