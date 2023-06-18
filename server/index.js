const fs = require('fs')
const path = require('path')
const http = require('http')


// Функція для побудови дерева файлів і папок
function buildDirectoryTree(rootDir) {
  const tree = {} // Початкове пусте дерево

  function traverseDirectory(currentDir, currentTree) {
    const files = fs.readdirSync(currentDir) // Отримання списку файлів і папок в поточній директорії

    files.forEach(file => {
      if (file == 'node_modules' || file == '.git') return // node_modules занадто велика директорія
      const filePath = path.join(currentDir, file) // Формування повного шляху до файлу або папки
      const stats = fs.statSync(filePath) // Отримання статистики про файл або папку

      if (stats.isDirectory()) {
        const subTree = {} // Створення пустого дерева для піддиректорії
        currentTree[file] = subTree // Додавання піддерева до поточної папки в дереві
        traverseDirectory(filePath, subTree) // Рекурсивний виклик для піддиректорій
      } else {
        const fileContent = fs.readFileSync(filePath, 'utf-8') // Зчитування вмісту файлу
        currentTree[file] = fileContent // Запис вмісту
      }
    })
  }

  traverseDirectory(rootDir, tree)
  return tree
}

const rootDir = '../'
const directoryTree = buildDirectoryTree(rootDir)


const hostname = 'localhost'
const port = 3000

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET')
  res.setHeader('Access-Control-Max-Age', 2592000)
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  res.end(JSON.stringify(directoryTree))
})

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`)
})