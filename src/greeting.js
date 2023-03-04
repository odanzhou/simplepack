
const greeting = (name) => {
  return 'hello ' + name
}

export const hello = (name) => {
  return 'hello, my name is ' + name
}

const test = () => {
  console.log('this is test')
}

export default test

export {
  greeting
}