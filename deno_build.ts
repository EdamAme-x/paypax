import * as fs from 'fs'
import glob from 'glob'

console.log('Deleting test file in dist...')

const testFiles = glob.sync('./deno_dist/**/*.test.ts', {})

testFiles.forEach((file) => {
    fs.unlinkSync(file)
})

console.log('Done!')