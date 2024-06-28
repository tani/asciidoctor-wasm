import { Asciidoctor as AsciidoctorWASM, wasmURL } from "./dist/browser.js";
import createAsciidoctorJS from "npm:@asciidoctor/core@3.0.4";
import { readFile } from "node:fs/promises";

const adocWASM = await AsciidoctorWASM.initFromURL(wasmURL);
const adocJS = createAsciidoctorJS();

const adoc = await readFile("sample.adoc", "utf-8");

Deno.bench("asciidoctor-wasm", async () => {
  await adocWASM.convert(adoc);
})

Deno.bench("asciidoctor-wasm sync", async () => {
  adocWASM.convertSync(adoc);
})

Deno.bench("asciidoctor-js", () => {
  adocJS.convert(adoc);
})
