# mllc

max line length checker

## CLI Usage

  $ mllc -l 100 '**/*.js'

## API Usage

```js
var m = mllc('**/*.js', function (err, result) {
  if (err) throw err
  console.log(result)
})
```

## Install

    $ npm install -g mllc

## License

MIT
