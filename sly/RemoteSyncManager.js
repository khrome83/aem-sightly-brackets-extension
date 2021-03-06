/*******************************************************************************
 * Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License 2.0.
 * http://www.apache.org/licenses/LICENSE-2.0
 ******************************************************************************/
/*global define, brackets, $*/
define(function (require, exports, module) {
    'use strict';
    var DocumentManager         = brackets.getModule('document/DocumentManager'),
        FileSystem              = brackets.getModule('filesystem/FileSystem'),
        ExtensionUtils          = brackets.getModule('utils/ExtensionUtils'),
        FileUtils               = brackets.getModule('file/FileUtils'),
        NodeDomain              = brackets.getModule('utils/NodeDomain'),
        CommandManager          = brackets.getModule('command/CommandManager'),
        ProjectManager          = brackets.getModule('project/ProjectManager'),
        Menus                   = brackets.getModule('command/Menus'),
        Dialogs                 = brackets.getModule('widgets/Dialogs'),
        DefaultDialogs          = brackets.getModule('widgets/DefaultDialogs'),
        SlyDomain               = new NodeDomain('sly', ExtensionUtils.getModulePath(module, 'node/SlyDomain')),
        Preferences             = require('sly/preferences/Preferences'),
        ProjectUtils            = require('sly/ProjectUtils'),
        ToolBar               = require('sly/toolbar/ToolBar'),
        SessionStorage          = require('sly/SessionStorage'),
        Strings                 = require('strings'),
        CMD_PUSH_REMOTE = 'sly-push-remote',
        CMD_PULL_REMOTE = 'sly-pull-remote',
        neighbours;

    function _uploadSlingDependencies() {
        var slingPath = FileUtils.getNativeModuleDirectoryPath(module) + '/../sling/',
            slingDir  = FileSystem.getDirectoryForPath(slingPath);
        if (slingDir) {
            slingDir.getContents(function (err, contents) {
                console.log('updating sling remote with ' + contents);
                if (contents && contents.length > 0) {
                    contents.forEach(function (file) {
                        SlyDomain.exec('postFile', '/apps/system/install', file.fullPath).fail(
                            function(err) {
                                console.error(err);
                            }
                        );
                    });
                }
            });
        }
    }
    
    function handleSyncToRemote(path) {
        var cmd      = Preferences.get('pushCommand'),
            selected = ProjectManager.getSelectedItem(),
            pathToSync;
        if (selected === null && path === undefined) {
            return;
        } else {
            pathToSync = path || selected.fullPath;
        }
        if (!cmd) {
            ProjectUtils.getJcrRoot().then(
                function (root) {
                    if (root && pathToSync.indexOf(root) === 0) {
                        ProjectUtils.getFilterFile().then(
                            function (filterFile) {
                                ToolBar.updateStatusIndicator(true, ToolBar.states.SYNC_IN_PROGRESS);
                                return SlyDomain.exec('pushVault', pathToSync, filterFile).then(
                                    function (fileSyncStatus) {
                                        _calculateSyncStatus(fileSyncStatus);
                                    },
                                    function (err) {
                                        ToolBar.updateStatusIndicator(true, ToolBar.states.SYNC_NONE, err, err);
                                        Dialogs.showModalDialog(
                                            DefaultDialogs.DIALOG_ID_ERROR,
                                            'Synchronisation error',
                                            err
                                        );
                                    }
                                );
                            }
                        ).done();
                    }
                }
            ).done();
        } else {
            SlyDomain.exec('syncChildProcess', cmd, selected.fullPath).done();
        }
    }

    function handleSyncFromRemote(path) {
        var cmd      = Preferences.get('pullCommand'),
            selected = ProjectManager.getSelectedItem(),
            pathToSync;
        if (selected === null && path === undefined) {
            return;
        } else {
            pathToSync = path || selected.fullPath;
        }
        if (!cmd) {
            ProjectUtils.getJcrRoot().then(
                function (root) {
                    if (root && pathToSync.indexOf(root) === 0) {
                        ProjectUtils.getFilterFile().then(
                            function (filterFile) {
                                ToolBar.updateStatusIndicator(true, ToolBar.states.SYNC_IN_PROGRESS);
                                return SlyDomain.exec('pullVault', pathToSync, filterFile).then(
                                    function (fileSyncStatus) {
                                        _calculateSyncStatus(fileSyncStatus);
                                    },
                                    function (err) {
                                        ToolBar.updateStatusIndicator(true, ToolBar.states.SYNC_NONE, err, err);
                                        Dialogs.showModalDialog(
                                            DefaultDialogs.DIALOG_ID_ERROR,
                                            'Synchronisation error',
                                            err
                                        );
                                    }
                                );
                            }
                        ).done();
                    }

                }
            ).done();
        } else {
            SlyDomain.exec('syncChildProcess', cmd, selected.fullPath).done();
        }
    }
    
    /* return sling path from document */
    function _syncDoc(doc) {
        var cmd = Preferences.get('pushCommand');
        if (!cmd) {
            ProjectUtils.getJcrRoot().then(
                function (root) {
                    if (root) {
                        if (doc.file.fullPath.indexOf(root) === 0) {
                            if (doc.language && (Preferences.getSyncedLanguages().indexOf(doc.language.getId()) >= 0)) {
                                var path = doc.file.fullPath;
                                if (doc.file.name === '.content.xml') {
                                    path = doc.file.parentPath;
                                }
                                ProjectUtils.getFilterFile().then(
                                    function (filterFile) {
                                        ToolBar.updateStatusIndicator(true, ToolBar.states.SYNC_IN_PROGRESS);
                                        return SlyDomain.exec('pushVault', path, filterFile).then(
                                            function (fileSyncStatus) {
                                                _calculateSyncStatus(fileSyncStatus);
                                            },
                                            function (err) {
                                                ToolBar.updateStatusIndicator(true, ToolBar.states.SYNC_NONE, err, err);
                                                Dialogs.showModalDialog(
                                                    DefaultDialogs.DIALOG_ID_ERROR,
                                                    'Synchronisation error',
                                                    err
                                                );

                                            }
                                        );
                                    }
                                ).done();
                            } else {
                                console.debug('document is not managed in sync languages : ' + Preferences.getSyncedLanguages());
                            }
                        }
                    }
                }
            ).done();
        } else {
            SlyDomain.exec('syncChildProcess', cmd, doc.file.fullPath).done();
        }
    }
        
    function _onSave(event, doc) {
        _syncDoc(doc);
    }

    function _calculateSyncStatus(fileSyncStatus) {
        if (fileSyncStatus instanceof Array) {
            var syncedFiles = 0;
            var syncStatus = [];
            for (var i = 0; i < fileSyncStatus.length; i++) {
                var result = fileSyncStatus[i].result;
                var status = '';
                switch (result) {
                    case 1:
                        syncedFiles++;
                        status = Strings.SYNC_STATUS_SYNCED;
                        break;
                    case 0:
                        status = Strings.SYNC_STATUS_IGNORED;
                        break;
                    case -1:
                        status = Strings.SYNC_STATUS_EXCLUDED;
                        break;
                    case -2:
                        status = Strings.SYNC_STATUS_EXCLUDED_VLT;
                        break;
                    case -3:
                        syncedFiles++;
                        status = Strings.SYNC_STATUS_DELETED_FROM_REMOTE;
                        break;
                }
                syncStatus.push({path: fileSyncStatus[i].path, status: status});
            }
            SessionStorage.put('syncStatus', syncStatus);
            if (syncedFiles === 0) {
                ToolBar.updateStatusIndicator(true, ToolBar.states.SYNC_NONE);
            } else if (syncedFiles === fileSyncStatus.length) {
                ToolBar.updateStatusIndicator(true, ToolBar.states.SYNC_FULL);
            } else {
                ToolBar.updateStatusIndicator(true, ToolBar.states.SYNC_PARTIAL);
            }
        }
    }

    /* return neighbours of a given doc in the hierarchy */
    function findNeighbours(doc) {
        var dfd = $.Deferred();
        if (!neighbours || neighbours.currentDoc !== doc) {
            neighbours = {
                currentDoc: doc,
                paths: []
            };
            var path = doc.file.fullPath,
                parentPath = path.substring(0, path.lastIndexOf('/')),
                parentDir = FileSystem.getDirectoryForPath(parentPath);
            parentDir.getContents(function (err, contents) {
                if (contents && contents.length > 0) {
                    contents.forEach(function (file) {
                        if (file.fullPath !== path) {
                            neighbours.paths.push(file.fullPath);
                        }
                    });
                    dfd.resolve(neighbours.paths);
                } else {
                    dfd.reject('not able to find ' + path + ' neighbours');
                }
            });
        } else {
            dfd.done(neighbours.paths);
        }
        return dfd;
    }

    function _toggleSyncContextMenu(toggle) {
        CommandManager.get(CMD_PULL_REMOTE).setEnabled(toggle);
        CommandManager.get(CMD_PUSH_REMOTE).setEnabled(toggle);
    }

    function exportContentPackage() {
        ProjectUtils.getJcrRoot().then(
            function (root) {
                if (root) {
                    ProjectUtils.getFilterFile().then(
                        function (filterFile) {
                            if (filterFile) {
                                CommandManager.get(CMD_PUSH_REMOTE).execute(root);
                            }
                        }
                    ).done();
                }
            }
        ).done();
    }

    function importContentPackage() {
        ProjectUtils.getJcrRoot().then(
            function (root) {
                if (root) {
                    ProjectUtils.getFilterFile().then(
                        function (filterFile) {
                            if (filterFile) {
                                CommandManager.get(CMD_PULL_REMOTE).execute(root);
                            }
                        }
                    ).done();
                }
            }
        ).done();
    }

    function load(SLYDictionary) {
        $(DocumentManager).on('documentSaved', _onSave);
        _uploadSlingDependencies();
        CommandManager.register(Strings.CONTEXTUAL_PULL_REMOTE, CMD_PULL_REMOTE, handleSyncFromRemote);
        CommandManager.register(Strings.CONTEXTUAL_PUSH_REMOTE, CMD_PUSH_REMOTE, handleSyncToRemote);
        var project_cmenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
        project_cmenu.addMenuDivider();
        project_cmenu.addMenuItem(CMD_PUSH_REMOTE);
        project_cmenu.addMenuItem(CMD_PULL_REMOTE);

        $(project_cmenu).on('beforeContextMenuOpen', function () {
            ProjectUtils.getJcrRoot().then(
                function (root) {
                    var selected = ProjectManager.getSelectedItem();
                    if (!selected) {
                        _toggleSyncContextMenu(false);
                    }
                    if (selected.fullPath.indexOf(root) === 0) {
                        _toggleSyncContextMenu(true);
                    } else {
                        _toggleSyncContextMenu(false);
                    }
                }
            ).done();
        });

    }
    exports.load = load;
    exports.findNeighbours = findNeighbours;
    exports.importContentPackage = importContentPackage;
    exports.exportContentPackage = exportContentPackage;
});
