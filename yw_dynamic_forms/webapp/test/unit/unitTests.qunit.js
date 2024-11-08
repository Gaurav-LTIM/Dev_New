/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"yw_dynamic_forms/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
