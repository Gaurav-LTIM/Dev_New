sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("projectskillsuitest.controller.MainView1", {
        onInit: function () {

            var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                oModel.read("/Employee2Cluster", {
                    
                    success: function (response) {
                        oJSONModel.setData(response.results);
                        this.getView().setModel(oJSONModel, "EmployeesModel");
                    }.bind(this),
                    error: function (error) {
                        
                    }
                });

        },
        getGroup: function (oContext) {
            return oContext.getProperty('clust_JSC');
        },
         getGroupHeader: function (oGroup) {
            debugger;
            return new sap.m.GroupHeaderListItem({
                title: oGroup.key
            })
        }
    });
});
