import test from "node:test";
import assert from "node:assert";
import * as Asciidoctor from "../dist/node.mjs";

test("Test Asciidoctor WebAssembly conversion from AsciiDoc to HTML", async () => {
  const path = `${__dirname}/../dist/asciidoctor.wasm`;
  const convert = await Asciidoctor.initFromPath(path);
  const adoc = "= Hello, AsciiDoc!\n\nThis is AsciiDoc.\n";
  const actualHtml = await convert(adoc);
  const expectedHtml = "<div class=\"paragraph\">\n<p>This is AsciiDoc.</p>\n</div>";
  assert.strictEqual(actualHtml, expectedHtml);
})

test("Test Asciidoctor WebAssembly conversion from AsciiDoc to HTML", async () => {
  const path = `${__dirname}/../dist/asciidoctor.wasm`;
  const convert = await Asciidoctor.initFromPath(path);
  const adoc = `
:source-highlighter: rouge
:rouge-style: github

[source,ruby]
----
puts "Hello, World!"
----
  `
  const actualHtml = await convert(adoc, { safe: "safe" });
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
