# Context Menu Extra

Add commands to the context menu of the file explorer and editor.

The commands:

* `context-menu-extra.localhostRelativePath` : Add a `Copy Localhost Path` to the context menu. It fills the clipboard with the text `http://localhost:<portnumber>/<relativePath>`. It uses the configuration variables: `context-menu-extra.localhostPortNumber` and `context-menu-extra.fileroot`. The `<relativePath>` is the path relative to the root directory of the website.
* `context-menu-extra.fileName` : Add a `Copy File Name` to the context menu. It fills the clipboard with the file name.

The configuration:

* `context-menu-extra.localhostPortNumber` : The portnumber of the local webserver. (default: `8080`)
* `context-menu-extra.fileroot` : see the section [file root](#context-menu-extra.fileroot)


## `context-menu-extra.fileroot`

Is an array of strings that are the relative root directories of the websites in the workspace folder.

These strings are joined with the workspace folder to get the full website root folders.

Which folder is choosen as the website root folder is determined with the following steps:

1. rootfolder = workspace folder path of file
1. If a join of the workspace folder and an element of `fileroot` is the start of the current file path: rootfolder =  this join

If you have the following directory structure

```
/home/myname/WebProjects
             ├── .vscode
             │   └── settings.json
             ├── work
             │   └── siteFoo
             │       └── <website files>
             └── siteBar
                 └── <website files>
```

and you have opened `/home/myname/WebProjects` as a folder or part of a Multi Root Workspace you add this setting to the file `/home/myname/WebProjects/.vscode/settings.json`:

```
  "context-menu-extra.fileroot": [
    "work/siteFoo",
    "siteBar"
  ]
```

You can use the Settings GUI to modify this setting for any folder of the (MR) Workspace.

It does not make sence to use `context-menu-extra.fileroot` in the global user setting.
