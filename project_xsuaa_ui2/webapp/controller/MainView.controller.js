sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    'sap/ui/model/Sorter',
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageToast",
    'sap/ui/core/util/MockServer',
	'sap/ui/export/library',
	'sap/ui/export/Spreadsheet',
	'sap/ui/model/odata/v2/ODataModel'
],
    function (Controller, MessageBox, Filter, FilterOperator, Sorter, JSONModel, MessageToast,MockServer, exportLibrary, Spreadsheet, ODataModel) {
        "use strict";

        return Controller.extend("projectxsuaaui2.controller.MainView", {
            onInit: function () {

                var oModel, oView, sServiceUrl;

			/* Export requires an absolute path */
			sServiceUrl = "https://3d0fb91atrial-dev-project-emp-xsuaa-srv.cfapps.us10-001.hana.ondemand.com/v2/odata/v4/employee-services/Employees";

			this._oMockServer = new MockServer({
				rootUri: sServiceUrl
			});

			var sPath = sap.ui.require.toUrl('sap/ui/export/sample/localService');
			this._oMockServer.simulate(sPath + '/metadata.xml', sPath + '/mockdata');
			this._oMockServer.start();

			// oModel = new ODataModel(sServiceUrl);
			// oView = this.getView();
			// oView.setModel(oModel);

                this._onReadEmpData();
            },

            _onReadEmpData: function () {

                var oView = this.getView();
                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                oView.byId("page").setBusy(true);
                
                oModel.read("/Employees", {
                    urlParameters: {
                        "$expand": "department"
                    },
                    success: function (response) {
                        oView.byId("page").setBusy(false);
                        oJSONModel.setData(response.results);
                        this.getView().setModel(oJSONModel, "Employees");
                    }.bind(this),
                    error: function (error) {
                        oView.byId("page").setBusy(false);
                    }
                });

            },

            onSearch: function () {

                var a = this.byId("inputS");
                var fil = a.getValue();
                var fil = a.getValue();
                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var oView = this.getView();

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

                oView.byId("page").setBusy(true);
                oModel.read("/Employees", {
                    urlParameters: {
                        "$expand": "department"
                    },
                    filters: [InputFilter],
                    success: function (response) {
                        oView.byId("page").setBusy(false);
                        oJSONModel.setData(response.results);
                        this.getView().setModel(oJSONModel, "Employees");

                    }.bind(this),
                    error: function (error) {
                        oView.byId("page").setBusy(false);
                    }
                });
            },

            onRefresh: function (oEvent) {

                this._onReadEmpData();
            },

            onExport: function() {
                var aCols, oRowBinding, oSettings, oSheet, oTable;
    
                if (!this._oTable) {
                    this._oTable = this.byId('table1');
                }
    
                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();
    
                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Table export sample.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };
    
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function() {
                    oSheet.destroy();
                });
            },

            createColumnConfig: function() {
                var aCols = [];
    
                aCols.push({
                    label: 'Employee ID',
                    property: 'ID',
                });

                aCols.push({
                    label: 'Name',
                    property: 'name',
                    
                });
    
                aCols.push({
                    label: 'Department',
                    property: 'department/dep_name',
                });

                aCols.push({
                    label: 'Email',
                    property: 'email_id',
                });

                
    
                return aCols;
            },

            onAdd: function () {
                var oView = this.getView();

                // Show the appropriate action buttons
                oView.byId("table1").setVisible(false);
                oView.byId("Form").setVisible(true);
            },


            onSaveData: function () {


                var oView = this.getView();
                var that = this;

                oView.byId("page").setBusy(true);

                const myUniversallyUniqueID = globalThis.crypto.randomUUID();
                var a = this.byId("name1");
                var fname = a.getValue();
                var b = this.byId("manager");
                var fmana = b.getValue();
                var c = this.byId("email");
                var fmail = c.getValue();
                var d = this.byId("department");
                var fdept = d.getSelectedKey();

                var record = {
                    "ID": myUniversallyUniqueID,
                    "name": fname,
                    "email_id": fmail,
                    "manager": fmana,
                    "department_ID": fdept
                }

                console.log(record);


                var odataModel = oView.getModel();
                odataModel.create("/Employees", record, {
                    success: function (data) {
                        oView.byId("page").setBusy(false);
                        MessageBox.success("Data saved to local database successfully!", {
                            title: "Sucess",
                            onClose: function (sAction) {
                                if (sAction === 'OK') {
                                    that._onReadEmpData();
                                    that.onCancel();
                                }
                            }.bind(this),
                            actions: [sap.m.MessageBox.Action.OK],
                            emphasizedAction: sap.m.MessageBox.Action.OK,
                        });

                    },
                    error: function (err) {
                        oView.byId("page").setBusy(false);
                        MessageBox.error("Error saving data to local database: " + err.responseText);
                        that.onCancel();
                    }
                });

            },

            onCancel: function () {
                var oView = this.getView();

                // Show the appropriate action buttons
                oView.byId("table1").setVisible(true);
                oView.byId("Form").setVisible(false);
                var a = this.byId("name1");
                a.setValue("");
                var b = this.byId("manager");
                b.setValue("");
                var c = this.byId("email");
                c.setValue("");
                var d = this.byId("department");
                d.setValue("");
            },

            onDelete: function (oEvent) {

                var that = this;
                var oView = this.getView();
                var oTable = that.getView().byId("table1");
                var items = oTable.getSelectedItem();
                if (items === null) {
                    sap.m.MessageBox.warning("Please Select Records");
                }
                else {

                    MessageBox.confirm("Are you sure you want to delete the record(s)?", {
                        title: "Alert",
                        onClose: function (sAction) {
                            if (sAction === 'OK') {

                               
                                oView.byId("page").setBusy(true);

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
                                        oView.byId("page").setBusy(false);
                                        sap.m.MessageBox.success("Record(s) Deleted Successfully");
                                        that._onReadEmpData();
                                    }
                                    
                                }, function (oError) {
                                    // Error callback function
                                    oView.byId("page").setBusy(false);
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

            onNavToDetails: function (oEvent) {
                var oView = this.getView();

                // Show the appropriate action buttons
                oView.byId("table1").setVisible(false);
                oView.byId("vbox").setVisible(true);

                var sID = oEvent.getSource().getCells()[0].getText();
                console.log(sID);

                oView.byId("page").setBusy(true);

                var oModel = this.getOwnerComponent().getModel();
                var oJSONModel = new sap.ui.model.json.JSONModel();
                var oFilter = new sap.ui.model.Filter("ID", "EQ", sID);
                oModel.read("/Employees", {
                    urlParameters: {
                        "$expand": "department"
                    },
                    filters: [oFilter],
                    success: function (resp) {
                        oView.byId("page").setBusy(false);
                        oJSONModel.setData(resp.results);
                        this.getView().setModel(oJSONModel, "newemp");

                    }.bind(this),
                    error: function (error) {
                        oView.byId("page").setBusy(false);
                    }
                })
            },

            onNavBack: function () {
                var oView = this.getView();

                // Show the appropriate action buttons
                oView.byId("table1").setVisible(true);
                oView.byId("vbox").setVisible(false);
            },

            onvEdit: function () {
                var oView = this.getView();

                // Show the appropriate action buttons
                oView.byId("vbox").setVisible(false);
                oView.byId("evbox").setVisible(true);

            },

            onDeleteSingle: function () {

                var that = this
                var oID = this.byId("ID2");
                var sID = oID.getValue();
                console.log(sID);

                var oModel = that.getOwnerComponent().getModel();

                MessageBox.confirm("Are you sure you want to delete this record?", {
                    title: "Alert",
                    onClose: function (sAction) {
                        if (sAction === 'OK') {

                            var oBusyDialog = new sap.m.BusyDialog({
                                title: "Deleting",
                                text: "Please wait..."
                            });
                            oBusyDialog.open();
                            oModel.remove("/Employees(" + sID + ")", {
                                success: function (response) {
                                    oBusyDialog.close();
                                    that.onNavBack();
                                    sap.m.MessageBox.success("Record Deleted Successfully");
                                    that._onReadEmpData();

                                }.bind(this),
                                error: function (error) {
                                    oBusyDialog.close();
                                }
                            });

                        }
                    }.bind(this),
                    actions: [sap.m.MessageBox.Action.OK,
                    sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                })


            },

            onEditSave: function () {

                var oView = this.getView();
                var that = this;
                oView.byId("page").setBusy(true);

                var d = this.byId("ID");
                var uid = d.getValue();
                console.log(uid);
                var a = this.byId("name");
                var uname = a.getValue();
                var b = this.byId("eemail");
                var uemail = b.getValue();
                var c = this.byId("emanager");
                var umanager = c.getValue();
                var d = this.byId("edepartment");
                var udepartment = d.getSelectedKey();

                var urecord = {
                    "ID": uid,
                    "name": uname,
                    "email_id": uemail,
                    "manager": umanager,
                    "department_ID": udepartment
                }

                var path = "/Employees(" + uid + ")";
                var odataModel = this.getView().getModel();
                // @ts-ignore
                odataModel.update(path, urecord, {
                    success: function (data, response) {
                        MessageBox.success("Data Successfully Updated");
                        that.onEditCancel();
                        that._onReadEmpData();
                    },
                    error: function (error) {
                        oView.byId("page").setBusy(false);
                        MessageBox.error("Error while updating the data" + err.responseText);
                    }
                });

                // jQuery.ajax({
                //     type: "PUT",
                //     contentType: "application/json",
                //     url: "/v2/odata/v4/employee-services/Employees(" + uid + ")",
                //     data: JSON.stringify(urecord),
                //     success: function (data) {
                //         oView.byId("page").setBusy(false);
                //         MessageBox.success("Data Updated successfully!");
                //         //window.location.reload();
                //         that.onEditCancel();
                //         that._onReadEmpData();
                //     },
                //     error: function (err) {
                //         oView.byId("page").setBusy(false);
                //         MessageBox.error("Error Updating data: " + err.responseText);
                //     }
                // });

                // var list = this.getView().byId("list");
                // var selItem = list.getSelectedItem();
                // var title = selItem.getTitle();
                // var description = selItem.getDescription();
                // var Name = this.getView().byId("nameinput").getValue();
                // var payload = {
                //     ID: parseInt(title),
                //     Name: Name
                // };



            },

            onEditCancel: function () {
                var oView = this.getView();

                // Show the appropriate action buttons
                oView.byId("vbox").setVisible(true);
                oView.byId("evbox").setVisible(false);

            },

            onExit: function () {
                this.oModel = null;
                this.oExpandedLabel = null;
                this.oSnappedLabel = null;
                this.oFilterBar = null;
                this.oTable = null;
            },

            // fetchData: function () {
            //     var aData = this.oFilterBar.getAllFilterItems().reduce(function (aResult, oFilterItem) {
            //         aResult.push({
            //             groupName: oFilterItem.getGroupName(),
            //             fieldName: oFilterItem.getName(),
            //             fieldData: oFilterItem.getControl().getSelectedKeys()
            //         });

            //         return aResult;
            //     }, []);

            //     return aData;
            // },

            // applyData: function (aData) {
            //     aData.forEach(function (oDataObject) {
            //         var oControl = this.oFilterBar.determineControlByName(oDataObject.fieldName, oDataObject.groupName);
            //         oControl.setSelectedKeys(oDataObject.fieldData);
            //     }, this);
            // },

            // getFiltersWithValues: function () {
            //     var aFiltersWithValue = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
            //         var oControl = oFilterGroupItem.getControl();

            //         if (oControl && oControl.getSelectedKeys && oControl.getSelectedKeys().length > 0) {
            //             aResult.push(oFilterGroupItem);
            //         }

            //         return aResult;
            //     }, []);

            //     return aFiltersWithValue;
            // },

            // onSelectionChange: function (oEvent) {
            //     this.oFilterBar.fireFilterChange(oEvent);
            // },

            // onSearch1: function () {
            //     var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
            //         var oControl = oFilterGroupItem.getControl(),
            //             aSelectedKeys = oControl.getSelectedKeys(),
            //             aFilters = aSelectedKeys.map(function (sSelectedKey) {
            //                 return new Filter({
            //                     path: oFilterGroupItem.getName(),
            //                     operator: FilterOperator.Contains,
            //                     value1: sSelectedKey
            //                 });
            //             });

            //         if (aSelectedKeys.length > 0) {
            //             aResult.push(new Filter({
            //                 filters: aFilters,
            //                 and: false
            //             }));
            //         }

            //         return aResult;
            //     }, []);

            //     this.oTable.getBinding("items").filter(aTableFilters);
            //     this.oTable.setShowOverlay(false);
            // },

            // onFilterChange: function () {
            //     this._updateLabelsAndTable();
            // },

            // onAfterVariantLoad: function () {
            //     this._updateLabelsAndTable();
            // },


            // _updateLabelsAndTable: function () {
            //     this.oTable.setShowOverlay(true);
            // },


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
