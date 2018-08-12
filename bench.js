'use strict'

const fs = require('fs')
const {Suite} = require('benchmark')
const stringify = require('csv-stringify')
const numeral = require('numeral')

const suite = new Suite()

suite.cacheSizes = [16 ** 2, 16 ** 3, 16 ** 4]

const single = process.argv[2]

if (single) {
  require(single)(suite)
} else {
  require('./benchmarks/uuid')(suite)
  require('./benchmarks/fast-uuid')(suite)
  require('./benchmarks/uuid-random')(suite)
  require('./benchmarks/sodium-uuid')(suite)
  require('./benchmarks/hyperid')(suite)
  require('./benchmarks/crypto.randomBytes')(suite)
  require('./benchmarks/crypto.randomFillSync')(suite)
  require('./benchmarks/crypto.randomFill')(suite)
  require('./benchmarks/dev-random')(suite)
}

const readmePath = 'README.md'
const csvPath = 'results.csv'
let csv = [['Method', 'Leaky', 'Format', 'Re-use', 'Cache', 'Sync', 'Ops/sec', 'Deviation', 'Mean', 'MOE', 'RME', 'Samples', 'SEM', 'Variance']]
let uuidTable = tableHeader()
let otherTable = tableHeader()

suite
  .on('cycle', function (event) {
    const t = event.target

    console.log(`${desc(t)} x ${numeral(t.hz).format('0,0')} ops/sec ±${t.stats.rme.toFixed(2)}% (${t.stats.sample.length} runs sampled)`)

    const row = `| [${t.name}] ${t.postfix || ''} | ${leaky(t)} | ${t.format} | ${check(t.reuse)} | ${t.cacheSize || 'n/a'} | ${check(!t.defer)} | ${numeral(t.hz).format('0,0')} | ±${t.stats.rme.toFixed(2)}% | ${t.stats.sample.length} |\n`
    if (t.format === 'other') {
      otherTable += row
    } else {
      uuidTable += row
    }

    csv.push([fullName(t), t.leaky ? 'Y' : 'N', t.format, t.reuse ? 'Y' : 'N', t.cacheSize || '', t.defer ? 'N' : 'Y', t.hz, t.stats.deviation, t.stats.mean, t.stats.moe, t.stats.rme, t.stats.sample.length, t.stats.sem, t.stats.variance])
  })
  .on('complete', function () {
    console.log('Fastest is ' + desc(this.filter('fastest')[0]))

    if (single) return // if running just a single benchmark, skip updating result files

    const marker = '<!-- AUTOGENERATED - DO NOT EDIT -->\n'
    const parts = fs.readFileSync(readmePath, 'utf8').split(marker)
    parts[1] = uuidTable
    parts[3] = otherTable
    const readme = parts.join(marker)

    fs.writeFileSync(readmePath, readme)

    stringify(csv, function (err, output) {
      if (err) throw err
      fs.writeFileSync(csvPath, output)
    })
  })
  .run()

function tableHeader () {
  return '| Method | Leaky | Format | Re-use | Cache | Sync | Ops/sec | RME | Samples |\n' +
         '|--------|-------|--------|--------|-------|------|---------|-----|---------|\n'
}

function fullName (t) {
  return t.name + (t.postfix ? ' ' + t.postfix : '')
}

function desc (t) {
  return `${fullName(t)} (format: ${t.format}, re-use: ${!!t.reuse}, cache: ${t.cacheSize || 'n/a'}, sync: ${!t.defer})`
}

function leaky (t) {
  return t.leaky ? '💦' : ''
}

function check (bool) {
  return bool ? '✅' : ''
}
