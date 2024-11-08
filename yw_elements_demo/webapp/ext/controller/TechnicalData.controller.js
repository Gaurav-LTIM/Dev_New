// sap.ui.define([
//     "sap/ui/core/mvc/Controller",
//     "sap/m/MessageToast"
// ], function (Controller, MessageToast) {
//     "use strict";

//     return Controller.extend("ywelementsdemo.ext.controller.TechnicalData", {

//         onRadioButtonSelect: function (oEvent) {
//             console.log("Entered Button");
//             var sSelectedText = oEvent.getSource().getSelectedButton().getText();
//             MessageToast.show("You selected: " + sSelectedText);
//         }

//     });
// });

sap.ui.define([
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return {

        // onAfterRendering: function () {
        //     console.log("Inside Init");
        // },
        onShowTable: function () {
            console.log("Inside Table");

            var oJSONModel = new sap.ui.model.json.JSONModel();
            var oData = {
                fittings: [
                    { fitting: "Sink (tap nominal size 1/2\"/15mm)", noOfFittings: 0, loadingUnits: 3, totalLoadingUnits: 0 },
                    { fitting: "Sink (tap nominal size larger than 1/2\"/15mm)", noOfFittings: 0, loadingUnits: 5, totalLoadingUnits: 0 },
                    { fitting: "Wash basin in a house or flat", noOfFittings: 0, loadingUnits: 1.5, totalLoadingUnits: 0 },
                    { fitting: "Wash basin elsewhere", noOfFittings: 0, loadingUnits: 3, totalLoadingUnits: 0 },
                    { fitting: "Bath (tap nominal size 3/4\"/20mm)", noOfFittings: 0, loadingUnits: 10, totalLoadingUnits: 0 },
                    { fitting: "Bath (tap nominal size larger than 3/4\"/20mm)", noOfFittings: 0, loadingUnits: 22, totalLoadingUnits: 0 },
                    { fitting: "Shower", noOfFittings: 0, loadingUnits: 3, totalLoadingUnits: 0 },
                    { fitting: "Bidet", noOfFittings: 0, loadingUnits: 1.5, totalLoadingUnits: 0 },
                    { fitting: "Spray Tap", noOfFittings: 0, loadingUnits: 0.5, totalLoadingUnits: 0 },
                    { fitting: "WC Flushing Cistern (incl. for urinals)", noOfFittings: 0, loadingUnits: 2, totalLoadingUnits: 0 },
                    { fitting: "Domestic Appliances (2 default for infrastructure charge)", noOfFittings: 0, loadingUnits: 3, totalLoadingUnits: 0 },
                    { fitting: "Communal or Commercial Appliances not listed", noOfFittings: 0, loadingUnits: 10, totalLoadingUnits: 0 },
                    { fitting: "Any other water fitting or outlet (including a tap but excluding a urinal and water softener)", noOfFittings: 0, loadingUnits: 3, totalLoadingUnits: 0 }
                    // Add other fittings as needed
                ]
            };
            oJSONModel.setData(oData);
            this.getView().setModel(oJSONModel, "InfraTable");


        },
        onEditPress: function () {
            console.log("Inside Edit");
            var oView = this.getView();
            var oTable = oView.byId("InfraTableXML");
            var aItems = oTable.getItems();

            aItems.forEach(function (oItem) {
                var oInput = oItem.getCells()[1]; // Assuming the Input is the second cell
                oInput.setEditable(true);
            });

            var editButton = oView.byId("editbtn");
            editButton.setVisible(false);

            var calculateButton = oView.byId("calculatebtn");
            calculateButton.setVisible(true);
        },

        onCalculate: function () {

            var oView = this.getView();
            var oTable = oView.byId("InfraTableXML");

            var editButton = oView.byId("editbtn");
            editButton.setVisible(true);

            var calculateButton = oView.byId("calculatebtn");
            calculateButton.setVisible(false);

            var aItems = oTable.getItems();
            var oModel = oView.getModel("InfraTable");
            var oData = oModel.getData();

            aItems.forEach(function (oItem, index) {
                var oCells = oItem.getCells();
                var iNoOfFittings = oCells[1].getValue();
                oCells[1].setEditable(false);

                var iLoadingUnits = parseFloat(oCells[2].getText());
                var iTotalLoadingUnits = iNoOfFittings * iLoadingUnits;

                // Update the total loading units in the table
                oCells[3].setText(iTotalLoadingUnits);

                // Update the model data
                oData.fittings[index].totalLoadingUnits = iTotalLoadingUnits;
            });

            // Refresh the model to reflect changes
            oModel.refresh();
        },

        onRadioButtonSelect: function (oEvent) {
            var sSelectedText = oEvent.getSource().getSelectedButton().getText();
            MessageToast.show("You selected: " + sSelectedText);
        },

        // onLiveChange: function (oEvent) {
        //     var oInput = oEvent.getSource();
        //     var sValue = oInput.getValue();
        //     if (isNaN(sValue) || sValue.includes(".")) {
        //         oInput.setValue("");
        //         MessageToast.show("Please enter Integer Value", {
        //             duration: 1000, // Duration in milliseconds
        //             my: "center bottom", // Positioning
        //             at: "center bottom"
        //         });
        //     }
        // },



        onAdd: function () {

            var oInput1 = this.byId("input1");
            var oInput2 = this.byId("input2");
            var iNum1 = parseInt(oInput1.getValue(), 10) || 0;
            var iNum2 = parseInt(oInput2.getValue(), 10) || 0;
            var iSum = iNum1 + iNum2;
            this.byId("result").setText(" " + iSum);
        },

    };
});

