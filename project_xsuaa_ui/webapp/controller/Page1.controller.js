sap.ui.define([
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/Label',
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/comp/smartvariants/PersonalizableInfo',
    'sap/m/MessageBox',
    'sap/ui/core/routing/History'
],
    function (Controller, JSONModel, Label, Filter, FilterOperator, PersonalizableInfo, MessageBox, History) {
        "use strict";

        return Controller.extend("sap.btp.projectxsuaaui.controller.Page1", {
            onInit: function () {
                // this.applyData = this.applyData.bind(this);
                // this.fetchData = this.fetchData.bind(this);
                // this.getFiltersWithValues = this.getFiltersWithValues.bind(this);

                // this.oFilterBar = this.getView().byId("filterbar");
                // this.oTable = this.getView().byId("table");

                // this.oFilterBar.registerFetchData(this.fetchData);
                // this.oFilterBar.registerApplyData(this.applyData);
                // this.oFilterBar.registerGetFiltersWithValues(this.getFiltersWithValues);

                this._onReadEmpData();

            },



            _onReadEmpData: function () {

                //     var oModel = this.getOwnerComponent().getModel();
                //     var oJSONModel = new sap.ui.model.json.JSONModel();
                //     // var oBusyDialog = new sap.m.BusyDialog({
                //     //     title: "Loading Data",
                //     //     text: "PLZ Wait ....."
                //     // });
                //    // oBusyDialog.open();
                //     oModel.read("/Employees",{

                //     urlParameters:{
                //         "$expand": "department"
                //     },

                //         success: function(resp){
                //            // oBusyDialog.close();
                //             oJSONModel.setData(resp.results);
                //             this.getView().setModel(oJSONModel,"Employees");
                //         }.bind(this),
                //         error: function(error){
                //            // oBusyDialog.close();
                //         }
                //     });

                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var oBusyDialog = new sap.m.BusyDialog({
                    title: "Loading",
                    text: "Please wait..."
                });
                oBusyDialog.open();
                oModel.read("/Employees", {
                    urlParameters: {
                        "$expand": "department"
                    },
                    success: function (response) {
                        oBusyDialog.close();
                        oJSONModel.setData(response.results);
                        this.getView().setModel(oJSONModel, "Employees");
                    }.bind(this),
                    error: function (error) {
                        oBusyDialog.close();
                    }
                });

            },

            onclickbtn: function () {
                var a = this.byId("inputS");
                var fil = a.getValue();
                var fil = a.getValue();
                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                //var ofilter = new sap.ui.model.Filter("name", "EQ", fil);

                var InputFilter = new Filter({
                    filters: [

                        new Filter({
                            path: 'email_id',
                            operator: FilterOperator.Contains,
                            value1: fil,
                            caseSensitive: false
                        }),
                        new Filter({
                            path: 'name',
                            operator: FilterOperator.Contains,
                            value1: fil,
                            caseSensitive: false
                        }),
                        new Filter({
                            path: 'department/dep_name',
                            operator: FilterOperator.Contains,
                            value1: fil,
                            caseSensitive: false
                        })

                    ],
                    and: false
                });

                oModel.read("/Employees", {
                    urlParameters: {
                        "$expand": "department"
                    },
                    filters: [InputFilter],
                    success: function (response) {
                        var b = this.byId("table1").setVisible(false);
                        var c = this.byId("table2").setVisible(true);
                        oJSONModel.setData(response.results);
                        this.getView().setModel(oJSONModel, "Employeesnew");
                    }.bind(this),
                    error: function (error) {
                    }
                });
            },

            onNavToDetails: function (oEvent) {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                var sID = oEvent.getSource().getCells()[0].getText();
                oRouter.navTo("Detail", { ID: sID });
            },

            onRowClick: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Create");
            },

            onRefresh: function (oEvent) {

                this._onReadEmpData();
            },

            onExit: function () {
                this.oModel = null;
                this.oExpandedLabel = null;
                this.oSnappedLabel = null;
                this.oFilterBar = null;
                this.oTable = null;
            },

            fetchData: function () {
                var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
                    aResult.push({
                        groupName: oFilterItem.getGroupName(),
                        fieldName: oFilterItem.getName(),
                        fieldData: oFilterItem.getControl().getSelectedKeys()
                    });

                    return aResult;
                }, []);

                return aData;
            },

            applyData: function (aData) {
                aData.forEach(function (oDataObject) {
                    var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
                    oControl.setSelectedKeys(oDataObject.fieldData);
                }, this);
            },

            getFiltersWithValues: function () {
                var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl();

                    if (oControl && oControl.getSelectedKeys && oControl.getSelectedKeys().length > 0) {
                        aResult.push(oFilterGroupItem);
                    }

                    return aResult;
                }, []);

                return aFiltersWithValue;
            },

            onSelectionChange: function (oEvent) {
                this.oFilterBar.fireFilterChange(oEvent);
            },

            onSearch: function () {
                var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl(),
                        aSelectedKeys = oControl.getSelectedKeys(),
                        aFilters = aSelectedKeys.map(function (sSelectedKey) {
                            return new Filter({
                                path: oFilterGroupItem.getName(),
                                operator: FilterOperator.Contains,
                                value1: sSelectedKey
                            });
                        });

                    if (aSelectedKeys.length > 0) {
                        aResult.push(new Filter({
                            filters: aFilters,
                            and: false
                        }));
                    }

                    return aResult;
                }, []);

                this.oTable.getBinding("items").filter(aTableFilters);
                this.oTable.setShowOverlay(false);
            },

            onFilterChange: function () {
                this._updateLabelsAndTable();
            },

            onAfterVariantLoad: function () {
                this._updateLabelsAndTable();
            },


            _updateLabelsAndTable: function () {
                this.oTable.setShowOverlay(true);
            },

            onDelete: function (oEvent) {

                //var oTable = this.getView().byId("table1");
                //var aSelectedItems = oTable.getSelectedItems();
                //var aListData = [];
                //var that = this;

                // that._onReadEmpData();

                var that = this;

                var oTable = that.getView().byId("table1");
                var items = oTable.getSelectedItem();
                if (items === null) {
                    sap.m.MessageBox.warning("Please Select Records");
                }
                else {

                    MessageBox.confirm("Are you sure you want to delete this record?", {
                        title: "Alert",
                        onClose: function (sAction) {
                            if (sAction === 'OK') {

                                var oBusyDialog = new sap.m.BusyDialog({
                                    title: "Deleting",
                                    text: "Please wait..."
                                });
                                oBusyDialog.open();

                                var url = that.getOwnerComponent().getModel().sServiceUrl;
                                var oDataModel = new sap.ui.model.odata.ODataModel(url);
                                var batchChanges = [];
                                var jModel = that.getView().byId("table1").getSelectedItems();
                                for (var i = 0; i < jModel.length; i++) {
                                    var oEntry = jModel[i].getBindingContext("Employees").getObject();
                                    var SCACGroupVal = oEntry.ID;
                                    console.log(SCACGroupVal);
                                    var uPath = "/Employees(" + SCACGroupVal + ")";
                                    batchChanges.push(oDataModel.createBatchOperation(uPath, "DELETE", oEntry));
                                }
                                oDataModel.addBatchChangeOperations(batchChanges);
                                oDataModel.submitBatch(function (oData, oResponse) {
                                    // Success callback function
                                    if (oResponse.statusCode === "202" || oResponse.statusCode === 202) {
                                        sap.m.MessageBox.success("Records Deleted Successfully");
                                        that._onReadEmpData();
                                        oBusyDialog.close();
                                    }
                                    // Handle the response data
                                }, function (oError) {
                                    // Error callback function
                                    oBusyDialog.close();
                                    sap.m.MessageBox.success("failed");
                                    // Handle the error
                                });


                            }
                        }.bind(this),
                        actions: [sap.m.MessageBox.Action.OK,
                        sap.m.MessageBox.Action.CANCEL],
                        emphasizedAction: sap.m.MessageBox.Action.OK,
                    })



                }

                //  aSelectedItems.forEach(function (oItem) {

                //     var oContext = oItem.getBindingContext("Employees");
                //     var oData = oContext.getObject();  
                //     var oModel = that.getOwnerComponent().getModel();

                //         console.log(oData);                
                //         MessageBox.confirm("Are you sure you want to delete this record?", {
                //             title: "Alert",
                //             onClose: function(sAction){
                //                 if(sAction === 'OK'){

                //                     var oBusyDialog = new sap.m.BusyDialog({
                //                         title: "Deleting",
                //                         text: "Please wait..."
                //                     });
                //                     oBusyDialog.open();
                //                     oModel.remove("/Employees(" + oData.ID + ")", {
                //                         success: function(response){
                //                             oBusyDialog.close();
                //                             that._onReadEmpData();
                //                         }.bind(this),
                //                         error: function(error){
                //                             oBusyDialog.close();
                //                         }
                //                     });

                //                 }
                //             }.bind(this),
                //             actions:[sap.m.MessageBox.Action.OK,
                //             sap.m.MessageBox.Action.CANCEL],
                //             emphasizedAction: sap.m.MessageBox.Action.OK,
                //         })



                //     // var oListItem = {
                //     //     ID: oData.ID,
                //     //     createdAt: oData.createdAt,
                //     //     createdBy: oData.createdBy,
                //     //     ContactTitle: oData.ContactTitle,
                //     //     modifiedAt: oData.modifiedAt,
                //     //     modifiedBy: oData.modifiedBy,
                //     //     name: oData.name,
                //     //     email_id: oData.email_id,
                //     //     manager: oData.manager,
                //     //     department_ID: oData.department_ID
                //     // };

                //     // var na = oListItem.ID;
                //     // jQuery.ajax({
                //     //     type: "DELETE",
                //     //     contentType: "application/json",
                //     //     url: "/v2/odata/v4/employee-services/Employees(" + na + ")",
                //     //     //data: JSON.stringify(oListItem),
                //     //     success: function (data) {
                //     //         MesssageBox.success("Data Is Deleted", {
                //     //             title: "Sucess",
                //     //             onClose: function(sAction){
                //     //             if(sAction === 'OK'){
                //     //                 window.location.reload();
                //     //             }
                //     //         }.bind(this),
                //     //         actions:[sap.m.MessageBox.Action.OK],
                //     //         emphasizedAction: sap.m.MessageBox.Action.OK,
                //     //         });

                //     //     },
                //     //     error: function (err) {
                //     //         MesssageBox.error("Error saving data to local database: " + err.responseText);
                //     //     }
                //     // });

                //  });
            },

            _onDeleteRecord: function (oRecord) {
                var oModel = this.getOwnerComponent().getModel();

                // var oBusyDialog = new sap.m.BusyDialog({
                //     title: "Deleting",
                //     text: "Please wait..."
                // });
                // oBusyDialog.open();
                // console.log(oRecord.ID);
                // oModel.remove("Employees(" + oRecord.ID + ")", {
                //     success: function(response){
                //         oBusyDialog.close();
                //         this.onReadEmpData();
                //     }.bind(this),
                //     error: function(error){
                //         oBusyDialog.close();
                //     }
                // });
            }

        });
    });