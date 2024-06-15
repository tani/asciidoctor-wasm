# Asciidoctor WASM

## Overview

This module provides an interface for converting Asciidoctor content to various formats using WebAssembly.
It supports conversion to `html5`, `docbook5`, and `manpage` backends, and allows for customization through various options.
The conversion is powered by Ruby's Asciidoctor library running in a WebAssembly (WASM) environment.

## Playground

You can try out the Asciidoctor WASM in the [Playground](https://tani.github.io/asciidoctor-wasm/).

## Installation

Ensure you have Node.js installed, then install the necessary dependencies:

```sh
npm install asciidoctor-wasm
```

## Usage

### Importing the Module

You can import the necessary functions and constants from the module:

```typescript
import * as Asciidoctor from "asciidoctor-wasm/node";
// import * as Asciidoctor from "asciidoctor-wasm/browser";
```

### Initializing the Converter

#### From a WebAssembly Module

To initialize the Asciidoctor converter from a WebAssembly module:

```typescript
const wasmURL = import.meta.resolve('asciidoctor-wasm/dist/asciidoctor.wasm');
const module = await WebAssembly.compileStreaming(fetch(wasmURL));
const convert = await Asciidoctor.initFromModule(module);
```

#### From a WebAssembly URL

To initialize the Asciidoctor converter from a WebAssembly binary located at a URL:

```typescript
const wasmURL = import.meta.resolve('asciidoctor-wasm/dist/asciidoctor.wasm');
const convert = await Asciidoctor.initFromURL(wasmURL);
```

#### From a WebAssembly Path

To initialize the Asciidoctor converter from a WebAssembly binary located at a path:

```typescript
import {fileURLToPath} from 'node:url';
const wasmURL = import.meta.resolve('asciidoctor-wasm/dist/asciidoctor.wasm');
const wasmPath = fileURLToPath(wasmURL);
const convert = await Asciidoctor.initFromPath(wasmPath);
```

### Converting Asciidoctor Content

Once the converter is initialized, you can use it to convert Asciidoctor content:

```typescript
const asciidoctorContent = "= Asciidoctor\nDoc Writer\n\nHello, Asciidoctor!";
const options: AsciidoctorOptions = {
  backend: "html5",
  doctype: "article",
  standalone: true,
};

const convertedContent = await convert(asciidoctorContent, options);
console.log(convertedContent);
```

## Versioning

This module follows the versioning of the Asciidoctor library it is based on.

- `0.<asciidoctor>.<asciidoctor-wasm>`
    - `<asciidoctor>`: Asciidoctor version; e.g., `2023` is based on Asciidoctor 2.0.23.
    - `<asciidoctor-wasm>`: Asciidoctor WebAssembly module version.

## License

WASM binary contains a copy of several OSSs as follows:

- Ruby: https://www.ruby-lang.org/en/about/license.txt
    - libyaml: https://github.com/yaml/libyaml/blob/840b65c40675e2d06bf40405ad3f12dec7f35923/License
    - zlib: https://github.com/madler/zlib/blob/0f51fb4933fc9ce18199cb2554dacea8033e7fd3/LICENSE
    - OpenSSL: https://www.openssl.org/source/license.html
- Asciidoctor: https://github.com/asciidoctor/asciidoctor/blob/e070613f0932b18cfb64370a8f0b6a0831eee4cd/LICENSE
    - rouge: https://github.com/rouge-ruby/rouge/blob/c150ef96045f0c054d0d28f37a5228cb3779fc7d/LICENSE
- ruby.wasm: https://github.com/ruby/ruby.wasm/blob/fac40c1b7ffcb65b8c25e3c7c719fd1eac885e47/LICENSE
    - wasi-vfs: https://github.com/kateinoigakukun/wasi-vfs/blob/ad74438287035ea01f3ce895e495740f7981215c/LICENSE
    - @bjorn3/browser_wasi_shim: https://github.com/bjorn3/browser_wasi_shim/blob/377fbebf89dc95ba2375b69d3ffbb5b39632b834/LICENSE-MIT

If you notice the missing license information, please let us know.

This project is licensed under the MIT License. See the `LICENSE` file for details.
