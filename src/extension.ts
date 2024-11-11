import * as vscode from "vscode";
import formatter from "./formatter";

export function activate(context: vscode.ExtensionContext) {
  let formatterCommand = vscode.commands.registerCommand(
    "comment-aligner.format",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        formatter.run(editor);
      }
    }
  );
}

export function deactivate() {}
