# Asciidoctor WebAssembly Module

## Overview

This module provides an interface for converting Asciidoctor content to various formats using WebAssembly. It supports conversion to `html5`, `docbook5`, and `manpage` backends, and allows for customization through various options. The conversion is powered by Ruby's Asciidoctor library running in a WebAssembly (WASM) environment.

## Installation

Ensure you have Node.js installed, then install the necessary dependencies:

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
const wasmURL = import.meta.resolve('asciidoctor-wasm/dist/asciidoctor.wasm')
const module = await WebAssembly.compileStreaming(fetch(wasmURL));
const convert = await Asciidoctor.init(module);
```

#### From a WebAssembly URL

To initialize the Asciidoctor converter from a WebAssembly binary located at a URL:

```typescript
const wasmURL = import.meta.resolve('asciidoctor-wasm/dist/asciidoctor.wasm')
const convert = await Asciidoctor.init(wasmURL);
```

#### From a WebAssembly Path

To initialize the Asciidoctor converter from a WebAssembly binary located at a path:

```typescript
import {fileURLToPath} from 'node:url';
const wasmURL = import.meta.resolve('asciidoctor-wasm/dist/asciidoctor.wasm')
const wasmPath = fileURLToPath(wasmURL);
const convert = await Asciidoctor.init(wasmPath);
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

## API


### `init(module: WebAssembly.Module | string): Promise<Convert>`

Initializes the Asciidoctor converter from a WebAssembly module.

* `module`: The WebAssembly module to initialize from.
* `url`: The URL of the WebAssembly binary.
* `path`: The path of the WebAssembly binary.

Returns a `Promise<Convert>`.

## License

WASM binary contains a copy of several OSSs as follows:

- Ruby: https://www.ruby-lang.org/en/about/license.txt
- Asciidoctor: https://github.com/asciidoctor/asciidoctor/blob/e070613f0932b18cfb64370a8f0b6a0831eee4cd/LICENSE
- ruby.wasm: https://github.com/ruby/ruby.wasm/blob/fac40c1b7ffcb65b8c25e3c7c719fd1eac885e47/LICENSE

If you notice the missing license information, please let us know.

This project is licensed under the MIT License. See the `LICENSE` file for details.
