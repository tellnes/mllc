var glob = require('glob')
  , split = require('split')
  , fs = require('fs')
  , path = require('path')
  , EventEmitter = require('events').EventEmitter
  , util = require('util')

util.inherits(MLLC, EventEmitter)
module.exports = MLLC

function MLLC() {
  var args = Array.prototype.slice.call(arguments)
    , pattern, options, cb

  if (!(this instanceof MLLC))
    cb = args.pop()

  if (args.length == 1) {
    if (typeof args[0] === 'string') {
      options = {}
      options.pattern = args[0]
    } else {
      options = args[0]
    }
  } else {
    options = args[1]
    options.pattern = args[0]
  }

  if (!(this instanceof MLLC)) {
    var mllc = new MLLC(options)
      , results = []
    mllc.on('data', function (file, line) {
      results.push({ file: file, line: line })
    })
    mllc.on('end', function () {
      cb(null, results)
    })
    mllc.on('error', cb)
    return
  }

  EventEmitter.call(this)

  if (!options.cwd) options.cwd = process.cwd()
  if (!options.length) options.length = 80

  var self = this

  glob(options.pattern, { mark: true }, function (err, files) {
    if (err) return self.emit('error', err)

    function next(err) {
      if (err) return self.emit('error', err)

      var filename = files.pop()
      if (!filename) return self.emit('end')

      if (filename[filename.length - 1] == '/') return next()

      var filepath = path.join(options.cwd, filename)
        , linenumber = 0

      fs.createReadStream(filepath)
      .on('error', next)
      .pipe(split())
      .on('data', function (lineStr) {
        linenumber++
        if (lineStr.length > options.length) {
          self.emit('data', filepath, linenumber)              
        }
      })
      .on('end', next)
      .on('error', next)
    }
    next()
  })
}
