import * as vscode from "vscode";

export function getConfig(key: string) {
  return vscode.workspace.getConfiguration("comment-aligner").get("key") as any;
}

export function setConfig(key: string, value: any) {
  return vscode.workspace
    .getConfiguration("comment-aligner")
    .update(key, value, true);
}
