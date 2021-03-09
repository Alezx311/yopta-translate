// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')

const dictionary = require('./dictionary')
const { yopta } = dictionary

const getDocument = () => vscode.window.activeTextEditor.document
const getRange = (doc = getDocument()) => {
  const firstLine = doc.lineAt(0)
  const lastLine = doc.lineAt(doc.lineCount - 1)
  const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end)

  return textRange
}
const getText = (doc = getDocument()) => doc.getText()
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
  const toYopta = vscode.commands.registerCommand('yopta-translate.toYopta', () => {
    const editor = vscode.window.activeTextEditor
    const start = editor.document.positionAt(0)

    const text = getText()
    const range = getRange()
    const translated = getTranslate(text, yopta)

    editor.edit(editBuilder => {
      editBuilder.delete(range)
      editBuilder.insert(start, translated)
    })
  })

  context.subscriptions.push(toYopta)
}

module.exports = {
  activate
}
