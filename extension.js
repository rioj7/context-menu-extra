const vscode = require('vscode');
const path = require('path');

function activate(context) {
  const errorMessage = (msg, noObject) => { vscode.window.showErrorMessage(msg); return noObject ? noObject : "Unknown";};
  const fileNotInFolderError = (noObject) => errorMessage('File not in Multi-root Workspace', noObject);
  const activeWorkspaceFolder = (uri, action, noWorkSpace) => {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) { return errorMessage('No folder open', noWorkSpace); }
    let folder = vscode.workspace.getWorkspaceFolder(uri);
    return folder ? action(folder) : fileNotInFolderError(noWorkSpace);
  };
  const contextURIToClipboard = (clipboardContent) => {
    const command = uri => {
      if (uri === undefined) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return errorMessage('No editor'); }
        uri = editor.document.uri;
      }
      vscode.env.clipboard.writeText(clipboardContent(uri)).then(v=>v, v=>null);
    };
    return command;
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('context-menu-extra.localhostRelativePath', contextURIToClipboard( uri => {
      return activeWorkspaceFolder(uri, workspaceFolder => {
        var config = vscode.workspace.getConfiguration('context-menu-extra', workspaceFolder.uri);
        var portNumber = config.get('localhostPortNumber');
        var fileroot = config.get('fileroot');
        let relativePath = vscode.workspace.asRelativePath(uri, false);
        let filerootFolder = '';
        for (const root of fileroot) {
          if (relativePath.startsWith(root)) {
            filerootFolder = root + '/';
            break;
          }
        }
        return `http://localhost:${portNumber}/${relativePath.substring(filerootFolder.length)}`;
      });
    }))
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('context-menu-extra.fileName', contextURIToClipboard( uri => path.basename(uri.path) ) )
  );
};

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
