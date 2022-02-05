// <file_name, idx>
var hpp_set : Map<string, number> = new Map();

var cpp_ext : Set<string> = new Set(["c", "cpp", "cc"]);
var hpp_ext : Set<string> = new Set(["h", "hpp"]);

export var cpp_common_ext = "c";
export var hpp_common_ext = "h";

export function has(file_name : string) : boolean {
  let idx = file_name.lastIndexOf('.');
  if (idx >= 0) {
    return hpp_set.has(file_name.substring(0, idx - 1));
  } else {
    return hpp_set.has(file_name);
  } 
}

export function idx(file_name : string) {
  let idx = file_name.lastIndexOf('.');
  if (idx >= 0) {
    return hpp_set.get(file_name.substring(0, idx - 1));
  } else {
    return hpp_set.get(file_name);
  }
}

export function add(file_name : string, sorted_idx : number) {
  let idx = file_name.lastIndexOf('.');
  if (idx >= 0) {
    hpp_set.set(file_name.substring(0, idx - 1), sorted_idx);
  } else {
    hpp_set.set(file_name, sorted_idx);
  }
}

export function clear() {
  hpp_set.clear();
}

export function is_cpp(file_ext : string) : boolean {
  return cpp_ext.has(file_ext);
}

export function is_hpp(file_ext : string) : boolean {
  return hpp_ext.has(file_ext);
}
