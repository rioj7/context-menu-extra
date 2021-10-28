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
  function activeTextEditorVariable(action, args, noEditor, editorOptional) {
    const editor = vscode.window.activeTextEditor;
    if (!editorOptional) {
      if (!editor) { return errorMessage('No editor', noEditor); }
    }
    return action(editor, args);
  };
  function activeWorkspaceFolderEditor(action, noWorkSpace) {
    return activeTextEditorVariable( editor => activeWorkspaceFolder(editor.document.uri, folder => action(folder, editor), noWorkSpace) );
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
  context.subscriptions.push(
    vscode.commands.registerCommand('context-menu-extra.activeEditorRelativePath', contextURIToClipboard( uri =>
      activeWorkspaceFolderEditor( (editorWorkspaceFolder, editor) =>
        activeWorkspaceFolder(uri, uriWorkspaceFolder => {
          if (editorWorkspaceFolder.uri.path !== uriWorkspaceFolder.uri.path) { return errorMessage('Not in the same Workspace'); }
          var config = vscode.workspace.getConfiguration('context-menu-extra', editorWorkspaceFolder.uri);
          var singleDot = config.get('singleDot');
            let editorRelativePath = vscode.workspace.asRelativePath(editor.document.uri, false).split('/');
          let uriRelativePath = vscode.workspace.asRelativePath(uri, false).split('/');
          editorRelativePath.pop();
          while (editorRelativePath.length > 0 && uriRelativePath.length > 0 && editorRelativePath[0] === uriRelativePath[0]) {
            editorRelativePath.shift();
            uriRelativePath.shift();
          }
          if (editorRelativePath.length === 0 && singleDot) {
            editorRelativePath.push('.');
          } else {
            editorRelativePath.map(x => '..');
          }
          return editorRelativePath.concat(uriRelativePath).join('/');
        })
      ) ) )
  );
};

function deactivate() {}

module.exports = {
    activate,
    deactivate
}
