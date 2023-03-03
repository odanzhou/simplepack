const fs = require('fs')
const babylon = require('babylon')
const traverse = require('babel-traverse').default
const { transformFromAst } = require('babel-core')

// 将文件转化为 AST
const getAST = (path) => {
  const source = fs.readFileSync(path, 'utf-8')
  return babylon.parse(source, {
    sourceType: 'module'
  })
}
// 分析依赖
const getDependencies = (ast) => {
  const dependencies = []
  traverse(ast, {
    // 分析 es_module 的 import 语句的
    ImportDeclaration: ({ node }) => {
      // 依赖值：node.source.value
      dependencies.push(node.source.value)
    }
  })
  return dependencies
}

// 将 AST 转化为源码
const transform = (ast) => {
  const { code } = transformFromAst(ast, null, {
    presets: ['env'], // 能解析的es语法，解析到最新的
  })
  return code
}

module.exports = {
  getAST,
  getDependencies,
  transform,
}