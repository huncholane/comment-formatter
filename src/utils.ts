import * as vscode from "vscode";

export function getConfig(key: string) {
  return vscode.workspace.getConfiguration("comment-aligner").get("key") as any;
}

export function setConfig(key: string, value: any) {
  return vscode.workspace
    .getConfiguration("comment-aligner")
    .update(key, value, true);
}

export function getCommentDelimiter(editor: vscode.TextEditor) {
  switch (editor.document.languageId) {
    case "javascript":
      return "//";
    case "typescript":
      return "//";
    case "javascriptreact":
      return "//";
    case "typescriptreact":
      return "//";
    case "html":
      return "<!--";
    case "xml":
      return "<!--";
    case "css":
      return "/*";
    case "scss":
      return "/*";
    case "less":
      return "/*";
    case "json":
      return "//";
    case "python":
      return "#";
    case "ruby":
      return "#";
    case "shellscript":
      return "#";
    case "powershell":
      return "#";
    case "properties":
      return "#";
    case "plaintext":
      return "#";
    default:
      throw new Error("Unsupported language");
  }
}
