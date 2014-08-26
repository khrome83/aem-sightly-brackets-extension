/*******************************************************************************
 * Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License 2.0.
 * http://www.apache.org/licenses/LICENSE-2.0
 ******************************************************************************/
/*global define*/
define({
    AEM_SLY_EXTENSION                                : 'AEM Sightly Extension',

    // Button labels
    BUTTON_OK                                        : 'OK',
    BUTTON_CANCEL                                    : 'Cancel',
	BUTTON_CREATE									 : 'Create',
	BUTTON_HELP										 : 'Help',

    // Menus
    // -- top level
    MENU_PROJECT_SETTINGS                            : 'Project Settings...',
    MENU_EXPORT_CONTENT_PACKAGE                      : 'Export Content Package',
    MENU_IMPORT_CONTENT_PACKAGE                      : 'Import Content Package',

    // -- contextual menus
    CONTEXTUAL_PULL_REMOTE                           : 'Import from Server',
    CONTEXTUAL_PUSH_REMOTE                           : 'Export to Server',
	CONTEXTUAL_AEM_GENERATOR						 : 'Create AEM Element...',

    // Project Settings dialogue
    PROJECT_SETTINGS                                 : 'Project Settings',
    PROJECT_SETTING_SERVER_URL                       : 'Server URL',
    PROJECT_SETTING_REMOTE_USER                      : 'Username',
    PROJECT_SETTING_REMOTE_USER_PASSWORD             : 'Password',
    PROJECT_SETTING_SERVER_URL_HINT                  : 'http://localhost:4502',
    PROJECT_SETTING_REMOTE_USER_HINT                 : 'admin',
    PROJECT_SYNCHRONISATION_SETTINGS                 : 'Synchronisation Settings',
    PROJECT_SETTING_SERVER_URL_ERROR_MISSING         : 'Please provide a server URL.',
    PROJECT_SETTING_SERVER_URL_ERROR_INVALID_PROTOCOL: 'Invalid protocol used for the server URL.',
    PROJECT_SETTING_SERVER_URL_ERROR_UNKNOWN         : 'Unknown error: server URL.',
    PROJECT_SETTING_SERVER_URL_ERROR_INVALID_CHAR    : 'Special characters like \'{0}\' must be %-encoded.',
    PROJECT_SETTING_REMOTE_USER_ERROR_EMPTY          : 'Please provide a username.',
    PROJECT_SETTING_REMOTE_USER_PASSWORD_ERROR_EMPTY : 'Please provide a password.',
	
	// Aem Generator dialogue
	AEM_GENERATOR									 : 'Create AEM Element',
	AEM_GENERATOR_TYPE_DIALOG					 	 : 'Create Dialog',
	AEM_GENERATOR_CREATE_DIALOG						 : 'Dialog',
	AEM_GENERATOR_CREATE_COMPONENT					 : 'Component',
	AEM_GENERATOR_CREATE_NODE						 : 'Node',
	AEM_GENERATOR_CREATE_DIALOG2				     : 'Dialog',
	
	

    // Synchronisation indicator tooltip
    SYNC_FULL                                        : 'All selected files were synced successfully.',
    SYNC_PARTIAL                                     : 'Some of the selected files were not synced successfully.',
    SYNC_NONE                                        : 'None of the selected files were synced.',
    SYNC_IN_PROGRESS                                 : 'Your selected files are synchronising.',

    // Synchronisation report dialogue
    SYNC_STATUS                                      : 'Synchronisation Status',
    SYNC_STATUS_TH_FILE                              : 'Entry',
    SYNC_STATUS_TH_STATUS                            : 'Synchronisation Status',
    SYNC_STATUS_SYNCED                               : 'synchronised',
    SYNC_STATUS_IGNORED                              : 'ignored by the filter configuration',
    SYNC_STATUS_EXCLUDED                             : 'excluded by the filter configuration',
    SYNC_STATUS_EXCLUDED_VLT                         : 'vlt file or file excluded by .vltignore pattern',
    SYNC_STATUS_DELETED_FROM_REMOTE                  : 'removed - the file was deleted on the server'

});