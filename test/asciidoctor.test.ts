import test from "node:test";
import assert from "node:assert";
import AsciidoctorJS from "npm:@asciidoctor/core";
import { Asciidoctor, wasmURL } from "../src/browser.ts";

const adocJS = AsciidoctorJS();
const adocWASM = await Asciidoctor.initFromURL(wasmURL);

test("Test Asciidoctor WebAssembly conversion from AsciiDoc to HTML", async () => {
  const adoc = "= Hello, AsciiDoc!\n\nThis is AsciiDoc.\n";

  assert.strictEqual(adocJS.convert(adoc), await adocWASM.convert(adoc));
});

test("Test Asciidoctor WebAssembly conversion with attributes", async () => {
  const adocWithAttributes = "= Hello, AsciiDoc!\n\nThis is AsciiDoc with an attribute.\n:author: John Doe";
  const options = { attributes: { 'showtitle': true } } as const;

  assert.strictEqual(adocJS.convert(adocWithAttributes, options), await adocWASM.convert(adocWithAttributes, options));
});

test("Test Asciidoctor WebAssembly conversion with backend option", async () => {
  const options = { backend: "html5" } as const;
  const adoc = "= Hello, AsciiDoc!\n\nThis is AsciiDoc.\n";

  assert.strictEqual(adocJS.convert(adoc, options), await adocWASM.convert(adoc, options));
});

test("Test Asciidoctor WebAssembly conversion with doctype option", async () => {
  const options = { doctype: "book" } as const;
  const adoc = "= Hello, AsciiDoc!\n\nThis is AsciiDoc.\n";

  assert.strictEqual(adocJS.convert(adoc, options), await adocWASM.convert(adoc, options));
});

test("Test Asciidoctor WebAssembly conversion with standalone option", async () => {
  const options = { standalone: false } as const;
  const adoc = "= Hello, AsciiDoc!\n\nThis is AsciiDoc.\n";

  assert.strictEqual(adocJS.convert(adoc, options), await adocWASM.convert(adoc, options));
});

test("Test Asciidoctor WebAssembly conversion with sourcemap option", async () => {
  const options = { sourcemap: true } as const;
  const adoc = "= Hello, AsciiDoc!\n\nThis is AsciiDoc.\n";

  assert.strictEqual(adocJS.convert(adoc, options), await adocWASM.convert(adoc, options));
});

test("Test Asciidoctor WebAssembly conversion with safe mode", async () => {
  const options = { safe: "secure" } as const;
  const adoc = "= Hello, AsciiDoc!\n\nThis is AsciiDoc.\n";

  assert.strictEqual(adocJS.convert(adoc, options), await adocWASM.convert(adoc, options));
});

test("Test Asciidoctor WebAssembly conversion with different content", async () => {
  const differentAdoc = "= Different Document\n\nThis is a different AsciiDoc content.\n";

  assert.strictEqual(adocJS.convert(differentAdoc), await adocWASM.convert(differentAdoc));
});


test("Test Asciidoctor WebAssembly conversion from AsciiDoc (codeblock) to HTML", async () => {
  const adoc = `
:source-highlighter: rouge
:rouge-style: github

[source,ruby]
----
puts "Hello, World!"
----
  `
  const actualHtml = await adocWASM.convert(adoc, { safe: "safe" });
  const expectedHtml =
    '<div class="listingblock">\n'+
    '<div class="content">\n'+
    '<pre class="rouge highlight">'+
    '<code data-lang="ruby">'+
    '<span class="nb">puts</span> <span class="s2">"Hello, World!"</span>'+
    '</code>'+
    '</pre>\n'+
    '</div>\n'+
    '</div>'
  assert.strictEqual(actualHtml, expectedHtml);
})

test("Test Asciidoctor WebAssembly conversion from AsciiDoc (codeblock) to HTML wit attrs", async () => {
  const adoc = `
[source,ruby]
----
puts "Hello, World!"
----
  `
  const actualHtml = await adocWASM.convert(adoc, {
    safe: "safe",
    attributes: {
      "source-highlighter": "rouge",
      "rouge-style": "github",
    }});
  const expectedHtml =
    '<div class="listingblock">\n'+
    '<div class="content">\n'+
    '<pre class="rouge highlight">'+
    '<code data-lang="ruby">'+
    '<span class="nb">puts</span> <span class="s2">"Hello, World!"</span>'+
    '</code>'+
    '</pre>\n'+
    '</div>\n'+
    '</div>'
  assert.strictEqual(actualHtml, expectedHtml);
})
