const path = require('path')
const { getAST, getDependencies, transform } = require('./parser')

// console.log(getAST(path.join(__dirname, '../src/index.js')))

const ast = getAST(path.join(__dirname, '../src/index.js'))

const dependencies = getDependencies(ast)

console.log('dependencies', dependencies)

const source = transform(ast)

console.log('code: ', source)

require('./index')