/* eslint-disable @typescript-eslint/naming-convention */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as common from "./common";
import * as cd from "./condition";
import { SortThisGroup } from "./SortForOneGroup";

function ExecSort() {
  if (cd.Sorting() || !cd.InitializeFocusedFiles()) {
    common.ExceptionInSorting("ExecSort()");
    return undefined;
  }
  cd.SetSorting(true);
  vscode.commands.executeCommand('moveActiveEditor', {to: "position", value: 1}).then(() => {
    SortThisGroup();
  });
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('sort.ouroboros', () => {
    console.log("this is from sort!");
    ExecSort();
  });
  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
