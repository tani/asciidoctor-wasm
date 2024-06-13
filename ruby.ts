import { RubyVM } from "npm:@ruby/wasm-wasi";
import type { Fd } from "npm:@bjorn3/browser_wasi_shim";
import {
  File,
  OpenFile,
  PreopenDirectory,
  WASI,
} from "npm:@bjorn3/browser_wasi_shim";
import { consolePrinter } from "npm:@ruby/wasm-wasi/dist/console";

// https://github.com/ruby/ruby.wasm/blob/fac40c1b7ffcb65b8c25e3c7c719fd1eac885e47/LICENSE
// https://github.com/ruby/ruby.wasm/blob/fac40c1b7ffcb65b8c25e3c7c719fd1eac885e47/packages/npm-packages/ruby-wasm-wasi/src/browser.ts

/**
 * Interface for default Ruby VM options.
 *
 * @interface
 * @property {boolean} consolePrint - Optional. If true, console print statements will be enabled.
 * @property {Record<string, string>} env - Optional. Environment variables to be passed to the Ruby VM.
 */
interface DefaultRubyVMOpts {
  consolePrint?: boolean;
  env?: Record<string, string>;
}

/**
 * Interface for the result of the default Ruby Virtual Machine (VM).
 *
 * @interface
 * @property {RubyVM} vm - The Ruby VM instance.
 * @property {WASI} wasi - The WebAssembly System Interface (WASI) instance.
 * @property {WebAssembly.Instance} instance - The WebAssembly instance.
 */
interface DefaultRubyVMResult {
  vm: RubyVM;
  wasi: WASI;
  instance: WebAssembly.Instance;
}

/**
 * Creates a default Ruby Virtual Machine (VM) with the provided options.
 *
 * @param {WebAssembly.Module} rubyModule - The WebAssembly module to instantiate.
 * @param {DefaultRubyVMOpts} options - Optional. The options for the Ruby VM.
 * @returns {Promise<DefaultRubyVMResult>} A promise that resolves to the result of the Ruby VM.
 */
export async function DefaultRubyVM(
  rubyModule: WebAssembly.Module,
  options: DefaultRubyVMOpts = {},
): Promise<DefaultRubyVMResult> {
  const args: string[] = [];
  const env: string[] = Object.entries(options.env ?? {}).map(
    ([k, v]) => `${k}=${v}`,
  );

  const fds: Fd[] = [
    new OpenFile(new File([])),
    new OpenFile(new File([])),
    new OpenFile(new File([])),
    new PreopenDirectory("/", new Map()),
  ];
  const wasi = new WASI(args, env, fds, { debug: false });
  const vm = new RubyVM();

  const imports = {
    wasi_snapshot_preview1: wasi.wasiImport,
  };
  vm.addToImports(imports);
  const printer = options.consolePrint ?? true ? consolePrinter() : undefined;
  printer?.addToImports(imports);

  const instance = await WebAssembly.instantiate(rubyModule, imports);
  await vm.setInstance(instance);

  printer?.setMemory(instance.exports.memory as WebAssembly.Memory);

  wasi.initialize(instance);
  vm.initialize();

  return { vm, wasi, instance };
}
