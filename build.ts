import esbuild from "esbuild";

const commonConfig = {
  bundle: true,
  sourcemap: true,
  treeShaking: true,
  format: 'esm',
} as const;

esbuild.build({
  ...commonConfig,
  entryPoints: ['./src/browser.ts'],
  outdir: 'dist/',
  packages: 'external',
  platform: 'browser'
})

esbuild.build({
  ...commonConfig,
  entryPoints: ['./src/node.ts'],
  outdir: 'dist/',
  packages: 'external',
  platform: 'node'
})

esbuild.build({
  ...commonConfig,
  entryPoints: ['./src/browser.ts'],
  outdir: 'docs/',
  minify: true,
  platform: 'browser'
})
