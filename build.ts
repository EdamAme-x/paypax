/*
  This script is heavily inspired by `built.ts` used in @kaze-style/react.
  https://github.com/taishinaritomi/kaze-style/blob/main/scripts/build.ts
  MIT License
  Copyright (c) 2022 Taishi Naritomi
*/

import { exec } from 'child_process'
import fs from 'fs'
import * as fsp from 'fs/promises'
import path from 'path'
import arg from 'arg'
import { build } from 'esbuild'
import type { Plugin, PluginBuild, BuildOptions } from 'esbuild'
import glob from 'glob'

const args = arg({
  '--watch': Boolean,
})

const isWatch = args['--watch'] || false

const entryPoints = glob.sync('./src/**/*.ts', {
  ignore: ['./src/**/*.test.ts', './src/mod.ts'],
})

/*
  This plugin is inspired by the following.
  https://github.com/evanw/esbuild/issues/622#issuecomment-769462611
*/
const addExtension = (extension: string = '.js', fileExtension: string = '.ts'): Plugin => ({
  name: 'add-extension',
  setup(build: PluginBuild) {
    build.onResolve({ filter: /.*/ }, (args) => {
      if (args.importer) {
        const p = path.join(args.resolveDir, args.path)
        let tsPath = `${p}${fileExtension}`

        let importPath = ''
        if (fs.existsSync(tsPath)) {
          importPath = args.path + extension
        } else {
          tsPath = path.join(args.resolveDir, args.path, `index${fileExtension}`)
          if (fs.existsSync(tsPath)) {
            importPath = `${args.path}/index${extension}`
          }
        }
        return { path: importPath, external: true }
      }
    })
  },
})

const commonOptions: BuildOptions = {
  watch: isWatch,
  entryPoints,
  logLevel: 'info',
  platform: 'node',
}

const cjsBuild = () =>
  build({
    ...commonOptions,
    outbase: './src',
    outdir: './dist/cjs',
    format: 'cjs',
  })

const esmBuild = () =>
  build({
    ...commonOptions,
    bundle: true,
    outbase: './src',
    outdir: './dist',
    format: 'esm',
    plugins: [addExtension('.js')],
  })

Promise.all([esmBuild(), cjsBuild()])

exec(`tsc ${isWatch ? '-w' : ''} --emitDeclarationOnly --declaration --project tsconfig.build.json`)

async function copyFile(source, destination) {
  try {
    const data = await fsp.readFile(source)
    await fsp.writeFile(destination, data)
    console.log(`${source} を ${destination} にコピーしました。`)
  } catch (error) {
    console.error(`ファイルのコピー中にエラーが発生しました: ${error}`)
  }
}

const sourcePath = './package.cjs.json'
const distCjsPath = './dist/cjs/package.json'
const distTypesPath = './dist/types/package.json'

copyFile(sourcePath, distCjsPath)
copyFile(sourcePath, distTypesPath)
