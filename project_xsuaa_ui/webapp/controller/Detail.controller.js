sap.ui.define([
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"
], function(Fragment, Controller, JSONModel,MessageBox, History) {
"use strict";

var PageController = Controller.extend("sap.btp.projectxsuaaui.controller.Detail", {

    onInit: function (oEvent) {
            // set explored app's demo model on this sample
        
       
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.getRoute("Detail").attachPatternMatched(this._onRouteMatched, this);
        
        
    },

    _onRouteMatched: function(oEvent){
        var oModel = this.getOwnerComponent().getModel();
        oModel.attachRequestCompleted(function() {
            this.byId('edit').setEnabled(true);
        }.bind(this));
        this.getView().setModel(oModel);

        var sID= oEvent.getParameter("arguments").ID;

        this.getView().bindElement("/Employees("+sID+")?$expand=department");

        this._formFragments = {};

        // Set the initial form to be the display one
        this._showFormFragment("Display");

    },
    
    onNavBack: function () {


        // var oHistory = History.getInstance();
        // var sPreviousHash = oHistory.getPreviousHash();
      
        // if (sPreviousHash !== undefined) 
        // {
        //   window.history.go(-1);
        // } else
        // {
        //   var oRouter = this.getOwnerComponent().getRouter();
        //   oRouter.navTo("Page1", {}, true);
        // }

            var oHistory = sap.ui.core.routing.History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
       
            if (sPreviousHash !== undefined) {
              window.history.go(-1);
            } else {
              var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
              oRouter.navTo("Page1", {}, true);
            }
          

        
    },
    handleEditPress : function () {

        //Clone the data
        // this._oSupplier = Object.assign({}, this.getView().getModel().getData());
        // var abc =  this.getView().getModel();
        // console.log(abc);
        this._toggleButtonsAndView(true);

    },

    handleCancelPress : function () {

        // Restore the data
        // var oModel = this.getView().getBindingContext();
        // var oData = oModel.getData();

        // oData = this._oSupplier;

        // oModel.setData(oData);

        var z = this.byId("ID");
            z.setValue("");
        var a = this.byId("name");
            a.setValue("");
        var b = this.byId("manager");
            b.setValue("");
        var c = this.byId("email");
            c.setValue("");
        var d = this.byId("department");
            d.setValue("");

        // Show the appropriate action buttons

        this._toggleButtonsAndView(false);

    },

    handleSavePress : function () {

        var z = this.byId("ID");
        var fID = z.getValue();
        var a = this.byId("name");
        var fname = a.getValue();
        var b = this.byId("manager");
        var fmanager = b.getValue();
        var c = this.byId("email");
        var femail = c.getValue();
        var d = this.byId("department");
        var fdepar = d.getSelectedKey();
        console.log(fID,fname,fmanager,femail,fdepar);


        var oListItem = {
            "ID": fID,
            "name":fname,
            "email_id":femail,
            "manager":fmanager,
            "department_ID":fdepar
        };

        

        jQuery.ajax({
            type: "PUT",
            contentType: "application/json",
            url: "/v2/odata/v4/employee-services/Employees(" + fID + ")",
            data: JSON.stringify(oListItem),
            success: function (data) {
                MessageBox.success("Data Updated successfully!");
                
               
               window.location.reload();
                //window.history.go(-1);

            },
            error: function (err) {
                MessageBox.error("Error Updating data: " + err.responseText);
            }
        });
   
        this._toggleButtonsAndView(false);

    },

    _toggleButtonsAndView : function (bEdit) {
        var oView = this.getView();

        // Show the appropriate action buttons
        oView.byId("edit").setVisible(!bEdit);
        oView.byId("back").setVisible(!bEdit);
        oView.byId("save").setVisible(bEdit);
        oView.byId("cancel").setVisible(bEdit);

        // Set the right form type
        this._showFormFragment(bEdit ? "Change" : "Display");
    },

    _getFormFragment: function (sFragmentName) {
        var pFormFragment = this._formFragments[sFragmentName],
            oView = this.getView();

        if (!pFormFragment) {
            pFormFragment = Fragment.load({
                id: oView.getId(),
                name: "sap.btp.projectxsuaaui.view." + sFragmentName
            });
            this._formFragments[sFragmentName] = pFormFragment;
        }

        return pFormFragment;
    },
    

    _showFormFragment : function (sFragmentName) {
        var oPage = this.byId("page");

        oPage.removeAllContent();
        this._getFormFragment(sFragmentName).then(function(oVBox){
            oPage.insertContent(oVBox);
        });
    }

});

return PageController;

});