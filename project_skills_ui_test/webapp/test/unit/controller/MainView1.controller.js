/*global QUnit*/

sap.ui.define([
	"project_skills_ui_test/controller/MainView1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("MainView1 Controller");

	QUnit.test("I should test the MainView1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
