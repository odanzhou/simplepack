const path = require('path')
const fs = require('fs')
const { getAST, getDependencies, transform } = require('./parser')
module.exports = class Compiler {
  constructor(options) {
    const { entry, output } = options
    this.entry = entry
    this.output = output
    this.modules = []
  }
  run () {
    const entryModule = this.buildModule(this.entry, true)
    console.log('entryModule', entryModule)
    // 递归解析依赖文件
    this.modules.push(entryModule)
    this.modules.forEach((_module) => {
      _module.dependencies.forEach((dependency) => {
        this.modules.push(this.buildModule(dependency, false))
      })
    })
    // console.log('this.modules', this.modules)
    this.emitFiles()
  }
  // 构建模块
  buildModule(filename, isEntry) {
    let ast
    if(isEntry) {
      ast = getAST(filename)
    } else { // 模块依赖的文件，是相对路径
      const absoluePath = path.join(process.cwd(), './src', filename)
      ast = getAST(absoluePath)
    }

    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast)
    }
  }
  // 输出文件
  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename)
    let modules = ''
    console.log('this.modules', this.modules)
    this.modules.forEach((_module) => {
      modules += `'${_module.filename}': function (require, module, exports) {${_module.source}},`
    })
    // 一个自执行的函数
    const bundle = `(function(modules) {
      function require(filename) {
        var fn = modules[filename]
        var module = { exports: {}}
        fn(require, module, module.exports)
        return module.exports
      }
      require('${this.entry}')
    })({${modules}})`
    console.log('bundle', bundle)
    fs.writeFileSync(outputPath, bundle, 'utf-8')
  }
}