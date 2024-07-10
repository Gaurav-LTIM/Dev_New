/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"project_skills_ui_test/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
