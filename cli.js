#!/usr/bin/env node

var optimist = require('optimist')
  , MLLC = require('./')

var argv = optimist
  .describe('l', 'Max number of characters per line')
  .alias('length', 'l')
  .default('length', 80)
  .argv

if (argv.help) {
  optimist.showHelp()
  return
}

argv.pattern = pattern = argv._[0] || '**/*'

var mllc = new MLLC(argv)
  , hadError = false

mllc.on('data', function (file, line) {
  console.error ( 'There is more than ' + argv.length + ' characters: %s:%s'
                , file.slice(process.cwd().length + 1)
                , line
                )
  hadError = true
})

mllc.on('end', function () {
  if (hadError) {
    process.exit(1)
  }
})

mllc.on('error', function (err) {
  throw err
})
