import * as vscode from "vscode";
import * as common from "./common";
import { FileInfo } from "./common";
import * as cd from "./condition";
import * as sc from "./SortCPP";

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

  if (sc.is_cpp(file_ext)) {
    file_ext = sc.cpp_common_ext;
  } else if (sc.is_hpp(file_ext)) {
    file_ext = sc.hpp_common_ext;
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
  RecordCPPInfo(files_info);
  Move2RightPos(files_info, 1, 0);
}

function RecordCPPInfo(files_info : Array<FileInfo>) {
  for (let i = 0; i < files_info.length; ++i) {
    if (sc.is_hpp(files_info[i].ext)) {
      sc.add(files_info[i].name, i);
    }
  }
}

function Move2RightPos(files_info : Array<FileInfo>, move_idx : number, iter_idx : number) {
  if (iter_idx < files_info.length) {
    if (!files_info[iter_idx].need_sort) {
      Move2RightPos(files_info, move_idx, ++iter_idx);
      return;
    }
    // move 文件
    let uri = vscode.Uri.file(files_info[iter_idx].path);
    vscode.commands.executeCommand('vscode.open', uri).then(() => {
      vscode.commands.executeCommand('moveActiveEditor', {to: "position", value: move_idx}).then(() => {
        let file_name = files_info[iter_idx].name;
        let file_ext = files_info[iter_idx].ext;
        if (file_ext === sc.cpp_common_ext && sc.has(file_name)) {
          let idx = sc.idx(file_name);
          if (idx === undefined) {
            common.ExceptionInSorting("hpp exists but idx undefined");
            return;
          }
          files_info[idx].need_sort = false;
          let hpp_uri = vscode.Uri.file(files_info[idx].path);
          vscode.commands.executeCommand('vscode.open', hpp_uri).then(() => {
            vscode.commands.executeCommand('moveActiveEditor', {to: "position", value: move_idx + 1}).then(() => {
              Move2RightPos(files_info, move_idx + 2, iter_idx + 1);
            });
          }); 
        } else {
          Move2RightPos(files_info, move_idx + 1, iter_idx + 1);
        }
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
        common.FinishSort();
        return undefined;
      } else {
        // 排序下一个 group
        sc.clear();
        SortThisGroup();
      }
    });
  });
}

