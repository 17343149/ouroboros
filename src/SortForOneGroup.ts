import * as vscode from "vscode";
import * as common from "./common";
import { FileInfo } from "./common";
import * as cd from "./condition";

export function SortThisGroup() {
  let files_info : Array<FileInfo> = [];
  GetAllFilesInfo(files_info);
}

function GetAllFilesInfo(files_info : Array<FileInfo>) {
  let activate_editor = vscode.window.activeTextEditor;
  if (activate_editor === undefined) {
    common.ExceptionInSorting("GetAllFilesInfo() editor undefined");
    return undefined;
  }
  let file_path = activate_editor.document.fileName;
  let file_name = common.GetFileNameInPath(file_path);
  let file_ext = common.GetFileExtInPath(file_path);
  let file_column = activate_editor.viewColumn;
  if (file_name === undefined || file_column === undefined || file_ext === undefined) {
    common.ExceptionInSorting("GetAllFilesInfo() file name undefined");
    return undefined;
  }
  if (!!(files_info && files_info.length)) {
    if (file_column > 0 && file_column !== files_info[0].column) {
      // 另外一个 group
      vscode.commands.executeCommand('workbench.action.previousEditor').then(() => {
        MoveFiles(files_info);
      });
      return undefined;
    } else if (file_path === files_info[0].path && file_column === files_info[0].column) {
       // 回到了该 group, 只有一个 group
      MoveFiles(files_info); 
      return undefined;
    }
  } 

  files_info.push(new FileInfo(file_path, file_name, file_ext, file_column));
  vscode.commands.executeCommand('workbench.action.nextEditor').then(() => {
    GetAllFilesInfo(files_info);
  }); 
}

function MoveFiles(files_info : Array<FileInfo>) {
  if (files_info.length <= 0) {
    return undefined;
  }
  files_info.sort((a : FileInfo, b : FileInfo) => (a.ext === b.ext ? (a.name >= b.name? 1 : -1) : a.ext > b.ext ? 1 : -1));
  console.log(files_info);
  Move2RightPos(files_info, 1);
}

function Move2RightPos(files_info : Array<FileInfo>, move_idx : number) {
  if (files_info.length > move_idx) {
    // move 文件
    let uri = vscode.Uri.file(files_info[move_idx - 1].path);
    vscode.commands.executeCommand('vscode.open', uri).then(() => {
      vscode.commands.executeCommand('moveActiveEditor', {to: "position", value: move_idx}).then(() => {
        Move2RightPos(files_info, ++move_idx);
      });
    });
  } else {
    ReadySortNextGroup(files_info[0].column);
  }
}

function OpenFocusFileAsync(column : vscode.ViewColumn) {
  let focus_file = cd.GetFocusedFile(column);
  if (focus_file === undefined) {
    common.ExceptionInSorting("unexpect error");
    return undefined;
  }
  let uri = vscode.Uri.file(focus_file);
  vscode.commands.executeCommand('vscode.open', uri);
}

function ReadySortNextGroup(column : vscode.ViewColumn) {
  let focus_file = cd.GetFocusedFile(column);
  if (focus_file === undefined) {
    common.ExceptionInSorting("unexpect error");
    return undefined;
  }
  let uri = vscode.Uri.file(focus_file);
  vscode.commands.executeCommand('vscode.open', uri).then(() => {
    vscode.commands.executeCommand('workbench.action.focusNextGroup').then(() => {
      let editor = vscode.window.activeTextEditor;
      if (editor === undefined) {
        common.ExceptionInSorting("ReadySortNextGroup() editor undefined");
        return undefined;
      } else if (editor.viewColumn === cd.GetInitialFocusedColumn()) {
        // 全部 group 完成排序
        OpenFocusFileAsync(editor.viewColumn);
        cd.SetSorting(false);
        return undefined;
      } else {
        // 排序下一个 group
        SortThisGroup();
      }
    });
  });
}

