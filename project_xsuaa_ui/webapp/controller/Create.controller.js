sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/Sorter',
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageToast"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,MessageBox, Filter,FilterOperator, Sorter, JSONModel, MessageToast ) {
        "use strict";
         
       
        
        return Controller.extend("sap.btp.projectxsuaaui.controller.Create", {
            onInit: function () {
               
            },
           
          
            savedata: function(){
                const myUniversallyUniqueID = globalThis.crypto.randomUUID();
                var a = this.byId("name1");
                var fname = a.getValue();
                var b = this.byId("manager");
                var fmana = b.getValue();
                var c = this.byId("email");
                var fmail = c.getValue();
                var d = this.byId("department");
                var fdept = d.getSelectedKey();

                // var oHistory = History.getInstance();
                // var sPreviousHash = oHistory.getPreviousHash();
               
                var record = {
                    "ID": myUniversallyUniqueID,
                    "createdAt": null,
                    "createdBy": null,
                    "modifiedAt":null,
                    "modifiedBy":null,
                    "name": fname,
                    "email_id": fmail,
                    "manager": fmana,
                    "department_ID": fdept
                }
               
                console.log(record);
                jQuery.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/v2/odata/v4/employee-services/Employees",
                    data: JSON.stringify(record),
                    success: function (data) {
                        MessageBox.success("Data saved to local database successfully!", {
                            title: "Sucess",
                            onClose: function(sAction){
                            if(sAction === 'OK'){
                                window.history.go(-1);
                            }
                        }.bind(this),
                        actions:[sap.m.MessageBox.Action.OK],
                        emphasizedAction: sap.m.MessageBox.Action.OK,
                        });
                        
                        // handleCloseDialog();
                        // var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                        // oRouter.navTo("Page1");
                        
                    },
                    error: function (err) {
                        MessageBox.error("Error saving data to local database: " + err.responseText);
                    }
                });
           
            },
            
            
        });
        
    });