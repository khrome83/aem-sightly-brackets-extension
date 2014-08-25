/*******************************************************************************
 * by Khrome83 - Zane Milakovic
 *
 * Licensed under the Apache License 2.0.
 * http://www.apache.org/licenses/LICENSE-2.0
 ******************************************************************************/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";
    // Load dependent modules
	/*
	var AppInit             = brackets.getModule("utils/AppInit"),
        CodeHintManager     = brackets.getModule("editor/CodeHintManager"),
        HTMLUtils           = brackets.getModule("language/HTMLUtils"),
        TokenUtils          = brackets.getModule("utils/TokenUtils"),
        sightlyLanguage     = require("sly/SightlyLanguage"),
        beanMgr             = require("sly/BeanManager"),
        editorManager       = brackets.getModule("editor/EditorManager"),
		DocumentManager     = brackets.getModule('document/DocumentManager'),
        FileSystem          = brackets.getModule('filesystem/FileSystem'),
        ExtensionUtils      = brackets.getModule('utils/ExtensionUtils'),
        FileUtils           = brackets.getModule('file/FileUtils'),
        NodeDomain          = brackets.getModule('utils/NodeDomain'),
        Dialogs             = brackets.getModule('widgets/Dialogs'),
        DefaultDialogs      = brackets.getModule('widgets/DefaultDialogs'),
        SlyDomain           = new NodeDomain('sly', ExtensionUtils.getModulePath(module, 'node/SlyDomain')),
		Preferences         = require('sly/preferences/Preferences'),
        ToolBar             = require('sly/toolbar/ToolBar'),
        SessionStorage      = require('sly/SessionStorage'),
		*/
	var ProjectManager      = brackets.getModule('project/ProjectManager'),
		ProjectUtils        = require('sly/ProjectUtils'),
		Menus               = brackets.getModule('command/Menus'),
		CommandManager      = brackets.getModule('command/CommandManager'),
		Generator       		= require('sly/generator/Generator'),
		Strings             = require('strings'),
        CMD_AEM_GENERATOR = 'sly-aem-generator';

	/*
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
	*/

    function _toggleSyncContextMenu(toggle) {
        CommandManager.get(CMD_AEM_GENERATOR).setEnabled(toggle);
    }
	
	function createDialog(path) {
		Generator.openDialogGenerator();
	}

    function load(SLYDictionnary) {
        CommandManager.register(Strings.CONTEXTUAL_AEM_GENERATOR, CMD_AEM_GENERATOR, createDialog);
		
        var project_cmenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
        project_cmenu.addMenuDivider();
        project_cmenu.addMenuItem(CMD_AEM_GENERATOR);
		
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
});