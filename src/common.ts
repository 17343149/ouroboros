import * as vscode from "vscode";
import * as cd from "./condition";

export class FileInfo {
  path: string;
  name: string;
  ext: string;
  column: vscode.ViewColumn;

  constructor(file_path: string, file_name: string, file_ext: string, file_column: vscode.ViewColumn|undefined) {
    this.path = file_path;
    this.name = file_name;
    this.ext = file_ext;
    this.column = file_column? file_column: -1;
  }
}

export function GetFileNameInPath(file_path : string) : string | undefined {
  if (file_path.length <= 0) {
    return undefined;
  }
  let name = file_path.substring(file_path.lastIndexOf('/') + 1);
  return name;
}

export function GetFileExtInPath(file_path : string) : string | undefined {
  if (file_path.length <= 0) {
    return undefined;
  }
  let idx : number = file_path.lastIndexOf('/');
  let ex_idx : number = file_path.lastIndexOf('.');
  // 没有后缀
  if (ex_idx <= idx || ex_idx < 0) {
    return "ZZZ";
  }
  return file_path.substring(ex_idx + 1);
}

export function ShowErrorMessage(err : string) {
  if (vscode.window.state) {
    vscode.window.showErrorMessage("focused file is not open, u can close it or open it!");
  } else {
    vscode.window.showErrorMessage("exception => " + err);
  } 
}

export function ExceptionInSorting(err : string) {
  console.error(err);
  ShowErrorMessage(err);
  cd.SetSorting(false);
}