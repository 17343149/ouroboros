import * as vscode from "vscode";

var is_sorting : boolean = false;

var focused_files : Map<vscode.ViewColumn, string> = new Map();
var initial_focused_column : vscode.ViewColumn = -1;

export function Sorting() : boolean { return is_sorting; }

export function SetSorting(sorting : boolean) { is_sorting = sorting; }

export function GetFocusedFile(column : vscode.ViewColumn) : string | undefined {
  return focused_files.get(column);
}

export function GetInitialFocusedColumn() : vscode.ViewColumn {
  return initial_focused_column;
}

export function InitializeFocusedFiles() : boolean {
  clear();

  let column = vscode.window.activeTextEditor?.viewColumn;
  if (column === undefined) {
    return false;
  }
  initial_focused_column = column;

  let text_editors = vscode.window.visibleTextEditors;
  for (let editor of text_editors) {
    if (editor.viewColumn === undefined) {
      continue;
    }
    focused_files.set(editor.viewColumn, editor.document.fileName);
  }
  return true;
}

export function clear() {
  focused_files.clear();
  initial_focused_column = -1;
}