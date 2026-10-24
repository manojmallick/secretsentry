import * as vscode from "vscode";
import { agentIgnoreTemplate, scanText } from "./logic/index.js";

export function activate(context: vscode.ExtensionContext) {
  const scan = vscode.commands.registerCommand(
    "secretsentry.scanActive",
    async () => {
      const ed = vscode.window.activeTextEditor;
      if (!ed) {
        vscode.window.showWarningMessage("No active editor");
        return;
      }
      const findings = scanText(ed.document.getText(), ed.document.fileName);
      if (findings.length === 0) {
        vscode.window.showInformationMessage("SecretSentry: no patterns found");
        return;
      }
      const msg = findings
        .map((f) => `${f.name}${f.line ? ` L${f.line}` : ""}: ${f.excerpt}`)
        .join("\n");
      const doc = await vscode.workspace.openTextDocument({
        content: `# SecretSentry\n\n${msg}\n`,
        language: "markdown",
      });
      await vscode.window.showTextDocument(doc, { preview: true });
    },
  );

  const writeIgnore = vscode.commands.registerCommand(
    "secretsentry.writeAgentIgnore",
    async () => {
      const root = vscode.workspace.workspaceFolders?.[0]?.uri;
      if (!root) {
        vscode.window.showWarningMessage("Open a workspace folder first");
        return;
      }
      const uri = vscode.Uri.joinPath(root, ".agentignore");
      await vscode.workspace.fs.writeFile(
        uri,
        Buffer.from(agentIgnoreTemplate(), "utf8"),
      );
      vscode.window.showInformationMessage("Wrote .agentignore");
    },
  );

  context.subscriptions.push(scan, writeIgnore);
}

export function deactivate() {}
