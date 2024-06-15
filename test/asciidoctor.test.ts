import test from "node:test";
import assert from "node:assert";
import * as Asciidoctor from "../dist/node.js";

test("Test Asciidoctor WebAssembly conversion from AsciiDoc to HTML", async () => {
  const path = `${import.meta.dirname}/../dist/asciidoctor.wasm`;
  const asciidoctor = await Asciidoctor.initFromPath(path);
  const adoc = "= Hello, AsciiDoc!\n\nThis is AsciiDoc.\n";
  const actualHtml = await asciidoctor.convert(adoc);
  const expectedHtml = "<div class=\"paragraph\">\n<p>This is AsciiDoc.</p>\n</div>";
  assert.strictEqual(actualHtml, expectedHtml);
})

test("Test Asciidoctor WebAssembly conversion from AsciiDoc to HTML", async () => {
  const path = `${import.meta.dirname}/../dist/asciidoctor.wasm`;
  const asciidoctor = await Asciidoctor.initFromPath(path);
  const adoc = `
:source-highlighter: rouge
:rouge-style: github

[source,ruby]
----
puts "Hello, World!"
----
  `
  const actualHtml = await asciidoctor.convert(adoc, { safe: "safe" });
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
