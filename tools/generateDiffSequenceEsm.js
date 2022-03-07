import { readFileSync, writeFileSync } from 'fs'

// The original file contains an export that doesn't play nice with Vite
// This script copies the source code and turns it into regular a ES module
// The original export looks like:
//
//     Object.defineProperty(exports, '__esModule', {
//       value: true
//     });
//     exports.default = diffSequence;
//
// The ESM export looks like:
//
//     export default diffSequence;

const commonjsFile = '../node_modules/diff-sequences/build/index.js'
const esmFile = '../src/lib/generated/diffSequence.js'
const commonjsCode = String(readFileSync(commonjsFile))

const commentsStart = commonjsCode.indexOf('/**')

const esmHeader = `// esm version of diff-sequences
// generated by ./tools/generateDiffSequenceEsm.js
export default diffSequence;

`

const esmCode = esmHeader + commonjsCode.slice(commentsStart)

writeFileSync(esmFile, esmCode)