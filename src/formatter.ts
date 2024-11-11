import * as vscode from "vscode";
import { getCommentDelimiter, getConfig } from "./utils";

class Line {
  text: string;
  range: vscode.Range;
  constructor(text: string, range: vscode.Range) {
    this.text = text;
    this.range = range;
  }

  format(largest_length: number, delimiter: string) {
    const textSplit = this.text.split(delimiter);
    if (textSplit.length === 1) {
      // console.log(`No delimiter found in ${this.text}. Skipping`);
      return this.text;
    }
    if (textSplit[0].trim() === "") {
      // console.log(`No text before ${delimiter}. Skipping ${this.text}`);
      return this.text;
    }
    const startText = textSplit[0].trimEnd();
    const spaces = " ".repeat(largest_length - startText.length);
    // console.log(`Adding ${spaces} to ${this.text}`);
    return startText + spaces + delimiter + textSplit[1];
  }

  updateEdit(
    edit: vscode.TextEditorEdit,
    largest_length: number,
    delimiter: string
  ) {
    edit.replace(this.range, this.format(largest_length, delimiter));
  }
}

class Block {
  largest_length = 0;
  lines: Line[] = [];

  addLine(text: string, range: vscode.Range, delimiter: string) {
    const extraSpaceLength = getConfig("spacesBeforeComment");
    const preCommentText = text.split(delimiter)[0].trimEnd();
    const length = preCommentText.length + extraSpaceLength;
    console.log(`Adding ${length} spaces to ${text}`);
    if (length > this.largest_length) {
      this.largest_length = length;
    }
    this.lines.push(new Line(text, range));
  }

  updateEdit(edit: vscode.TextEditorEdit, delimiter: string) {
    this.lines.forEach((line) => {
      line.updateEdit(edit, this.largest_length, delimiter);
    });
  }
}

class Formatter {
  blocks: Block[] = [];

  run(editor: vscode.TextEditor) {
    const doc = editor.document;
    const text = doc.getText();
    const lines = text.split("\n");
    console.log(`Formatting ${lines.length} lines`);
    let block: Block | null = null;
    const commentDelimiter = getCommentDelimiter(editor);

    lines.forEach((lineText, index) => {
      const line = doc.lineAt(index);
      if (line.text.includes(commentDelimiter)) {
        if (!block) {
          block = new Block();
          this.blocks.push(block);
        }
        block.addLine(lineText, line.range, commentDelimiter);
      } else {
        block = null;
      }
    });

    editor.edit((edit) => {
      this.blocks.forEach((block) => {
        block.updateEdit(edit, commentDelimiter);
      });
    });
    this.blocks = [];
  }
}

const formatter = new Formatter();
export default formatter;
