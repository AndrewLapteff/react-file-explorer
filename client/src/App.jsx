import { useEffect, useState } from 'react'
import './App.css'
import PropTypes from 'prop-types'

const Directory = ({ fileName, files, margin }) => {
  const [isExpanded, setExpanded] = useState(true)
  return (
    <div style={{ marginLeft: margin }} key={fileName}>
      <button className='folder' onClick={() => setExpanded(!isExpanded)}>
        {fileName}</button >
      {!isExpanded && <FilesTraversal files={files[fileName]} margin={margin} />}
    </div>)
}

const File = ({ fileName, fileContent, margin }) => {
  return <div style={{ marginLeft: margin + 7 }}>
    <button className='file' onClick={() => console.log(fileContent)}>{fileName}</button>
  </div>
}

const FilesTraversal = ({ files, margin }) => {
  // проходимось по іменам папок/файлів
  return Object.keys(files).map(fileName => {
    // якщо значення властивості це об'єкт, це означає що це папка
    if (typeof files[fileName] === 'object') {
      return (
        // я використав компоненту а не просто JSX для того, щоб кожна директорія мала свій стан
        // isExpanded, тому що використавши useState в цій функції, він підв'язувався під всі директорії
        // одного рівня вложеності об'єкту files
        <Directory key={fileName} fileName={fileName} files={files} margin={margin} />
      )
      // якщо ж значення властивості це строка, то це просто файл
    } else if (typeof files[fileName] === 'string') {
      return (
        <File
          key={fileName}
          fileName={fileName}
          fileContent={files[fileName]}
          margin={margin}
        />
      )
    }
  })
}

function App() {
  const [files, setFiles] = useState(null)
  useEffect(() => {
    const handler = async () => {
      let data = await fetch('http://localhost:3000')
      data = await data.json()
      setFiles(data)
    }
    handler()
  }, [])

  if (files)
    return (
      <FilesTraversal files={files} margin={7} />
    )
}

export default App

Directory.propTypes = {
  fileName: PropTypes.string,
  files: PropTypes.object,
  margin: PropTypes.number
}
File.propTypes = {
  fileName: PropTypes.string,
  fileContent: PropTypes.string,
  margin: PropTypes.number
}