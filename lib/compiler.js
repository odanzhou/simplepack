const path = require('path')
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
    console.log('this.modules', this.modules)
  }

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

  emitFiles() {

  }
}