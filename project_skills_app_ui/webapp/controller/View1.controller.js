sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment"
],
	function (Controller, JSONModel, Fragment) {
		"use strict";

		return Controller.extend("projectskillsappui.controller.View1", {

			onInit: function () {

			},

			// addSkill: function(oEvent) {

			// 	var oView = oEvent.getSource(),
			// 	oView = this.getView();
			//     console.log("Button Clicked");

			// 		this._pDialog = Fragment.load({
			// 			id: oView.getId(),
			// 			name: "projectskillsappui.view.Dialog",
			// 			controller: this
			// 		}).then(function(oDialog){
			// 			oView.addDependent(oDialog);
			// 			return oDialog;
			// 		});


			// 	// this._pDialog.then(function(oDialog){
			// 	// 	this._configDialog(oButton, oDialog);
			// 	// 	oDialog.open();
			// 	// }.bind(this));
			// }

			addSkill: function () {                     //display skills 
				var oView = this.getView();

				// Show the appropriate action buttons
				//oView.byId("table1").setVisible(true);  //displaying skills
				// oView.byId("evbox").setVisible(true); 

				if (!this.oDialog) {
					this.loadFragment({
						name: "projectskillsappui.view.Dialog"
					}).then(function (odialog) {
						this.oDialog = odialog;
						this.oDialog.open();

					}.bind(this))
				} else {
					this.oDialog.open();

				} //editing editing
			}

		});
	});
