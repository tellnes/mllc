var mllc = require('./')

var m = mllc('**/*.js', { length: 80 }, function (err, result) {
  if (err) throw err
  console.log(result)
})
