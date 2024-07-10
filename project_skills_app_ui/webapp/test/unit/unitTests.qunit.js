/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"project_skills_app_ui/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
