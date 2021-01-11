const vscode = require('vscode');

function activate(context) {
  const errorMessage = (msg, noObject) => { vscode.window.showErrorMessage(msg); return noObject ? noObject : "Unknown";};
  const fileNotInFolderError = (noObject) => errorMessage('File not in Multi-root Workspace', noObject);
  const activeWorkspaceFolder = (uri, action, noWorkSpace) => {
    const folders = vscode.workspace.workspaceFolders;
    if (!folders) { return errorMessage('No folder open', noWorkSpace); }
    let folder = vscode.workspace.getWorkspaceFolder(uri);
    return folder ? action(folder) : fileNotInFolderError(noWorkSpace);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('context-menu-extra.localhostRelativePath', uri => {
      if (uri === undefined) {
        const editor = vscode.window.activeTextEditor;
        if (!editor) { return errorMessage('No editor'); }
        uri = editor.document.uri;
      }
      activeWorkspaceFolder(uri, workspaceFolder => {
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
        vscode.env.clipboard.writeText(`http://localhost:${portNumber}/${relativePath.substring(filerootFolder.length)}`).then(v=>v, v=>null);
      })
    })
  );
};

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
