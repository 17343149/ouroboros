
var cpp_set : Map<string, string> = new Map();

var cpp_ext : Set<string> = new Set(["c", "cpp", "cc"]);
var hpp_ext : Set<string> = new Set(["h", "hpp"]);

export var cpp_common_ext = "c";
export var hpp_common_ext = "h";

export function has_cpp(file_name : string) : boolean {
  let idx = file_name.lastIndexOf('.');
  if (idx >= 0) {
    return cpp_set.has(file_name.substring(0, idx - 1));
  } else {
    return cpp_set.has(file_name);
  }
}

export function add_cpp(file_name : string, uri : string) {
  let idx = file_name.lastIndexOf('.');
  if (idx >= 0) {
    cpp_set.set(file_name.substring(0, idx - 1), uri);
  } else {
    cpp_set.set(file_name, uri);
  }
}

export function get_cpp_path(file_name : string) : string | undefined {
  let idx = file_name.lastIndexOf('.');
  if (idx >= 0) {
    return cpp_set.get(file_name.substring(0, idx - 1));
  } else {
    return cpp_set.get(file_name);
  }
}

export function clear() {
  cpp_set.clear();
}

export function is_cpp(file_ext : string) : boolean {
  return cpp_ext.has(file_ext);
}

export function is_hpp(file_ext : string) : boolean {
  return hpp_ext.has(file_ext);
}
