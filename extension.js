// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const dictionary = require('./dictionary')

const { yopta } = dictionary
const yoptaReversed = yopta.map(([key, val]) => [val, key])

const getDocument = () => vscode.window.activeTextEditor.document
const getRange = () => {
  const doc = getDocument()
  const firstLine = doc.lineAt(0)
  const lastLine = doc.lineAt(doc.lineCount - 1)
  const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end)

  return textRange
}

const getText = () => getDocument().getText()

const getTranslate = (text, dict) => {
  const dictObj = Object.fromEntries(dict)
  const dictFind = key => dictObj?.[key] ?? key
  const dictRegExp = new RegExp(
    Object.keys(dictObj)
      .map(v => `\\b${v}\\b`)
      .join('|'),
    'g'
  )

  const translated = text.replace(dictRegExp, dictFind)

  return translated
}

function activate(context) {
  const toJs = vscode.commands.registerCommand('yopta-translate.toJs', () => {
    const editor = vscode.window.activeTextEditor
    const start = editor.document.positionAt(0)

    const text = getText()
    const range = getRange()

    const dictObj = Object.fromEntries(yoptaReversed)
    const dictFind = key => dictObj?.[key] ?? key
    const dictRegExp = new RegExp(Object.keys(dictObj).join('|'), 'gi')

    const translated = text.replace(dictRegExp, dictFind)

    editor.edit(editBuilder => {
      editBuilder.delete(range)
      editBuilder.insert(start, translated)
    })
  })
  const toYopta = vscode.commands.registerCommand('yopta-translate.toYopta', () => {
    const editor = vscode.window.activeTextEditor
    const start = editor.document.positionAt(0)

    const text = getText()
    const range = getRange()
    const dictObj = Object.fromEntries(yopta)
    const dictFind = key => dictObj?.[key] ?? key
    const dictRegExp = new RegExp(
      Object.keys(dictObj)
        .map(v => `\\b${v}\\b`)
        .join('|'),
      'g'
    )

    const translated = text.replace(dictRegExp, dictFind)

    editor.edit(editBuilder => {
      editBuilder.delete(range)
      editBuilder.insert(start, translated)
    })
  })

  context.subscriptions.push(toJs)
  context.subscriptions.push(toYopta)
}

module.exports = {
  activate
}
