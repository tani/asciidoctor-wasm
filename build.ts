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
  platform: 'browser',
  target: ['es2022'],
})

esbuild.build({
  ...commonConfig,
  entryPoints: ['./src/node.ts'],
  outdir: 'dist/',
  packages: 'external',
  platform: 'node',
  target: ['node20'],
})

esbuild.build({
  ...commonConfig,
  entryPoints: ['./src/browser.ts'],
  outdir: 'docs/',
  minify: true,
  platform: 'browser',
  target: ['es2022'],
})
