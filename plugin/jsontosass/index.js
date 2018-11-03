// copy from "jsontosass-loader"
const fs = require('fs')
const path = require('path')

module.exports = function(content) {
  this.cacheable()
  let contentPath = path.resolve(this.query.path)
  this.addDependency(contentPath)
  let obj = JSON.parse(fs.readFileSync(contentPath, 'utf8'))

  let sass = jsonToSass(obj)
  return sass ? sass + '\n' + content : content
}

module.exports.jsonToSass = jsonToSass

function jsonToSass(obj, indent) {
  // Make object root properties into sass variables
  let sass = ''
  for (let key in obj) {
    sass += '$' + key + ': ' + JSON.stringify(obj[key], null, indent) + ';\n'
  }
  if (!sass) return sass

  // Store string values (so they remain unaffected)
  let storedStrings = []
  sass = sass.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, function(str) {
    let id = '___JTS' + storedStrings.length
    storedStrings.push({id: id, value: str})
    return id
  })

  // Convert js lists and objects into sass lists and maps
  sass = sass.replace(/[{[]/g, '(').replace(/[}\]]/g, ')')

  // Put string values back (now that we're done converting)
  storedStrings.forEach(function(str) {
    str.value = str.value.replace(/["']/g, '')
    sass = sass.replace(str.id, str.value)
  })

  return sass
}
