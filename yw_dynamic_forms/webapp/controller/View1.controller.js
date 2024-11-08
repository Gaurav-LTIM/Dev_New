sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/layout/form/SimpleForm",
    "sap/m/MessageBox"
],
    function (Controller, SimpleForm, MessageBox) {
        "use strict";

        return Controller.extend("ywdynamicforms.controller.View1", {
            onInit: function () {

                var oData = {
                    Questions: [
                        { "question": "What is Your Name", "answerType": "Input" },
                        { "question": "What is your DOB", "answerType": "DatePicker" },
                        { "question": "What is your Domain", "answerType": "ComboBox" }
                    ]
                };

                var oModel = new sap.ui.model.json.JSONModel(oData);
                this.getView().setModel(oModel, "QuestionModel");

                this.onAddQuestionFromModel();

            },

            onAddQuestionFromModel: function () {

                var oSimpleForm = this.getView().byId("SimpleForm");
                var aQuestions = this.getView().getModel("QuestionModel").getProperty("/Questions");

                aQuestions.forEach(function (oELement) {

                    var oQuestion, oAnswer, oButton;

                    var oQuestion = new sap.m.Label({
                        text: oELement.question,
                        design: "Bold"
                    });

                    switch (oELement.answerType) {
                        case "Input":
                            oAnswer = new sap.m.Input({
                                placeholder: "Enter your answer"
                            });

                            break;

                        case "DatePicker":
                            oAnswer = new sap.m.DatePicker({
                                valueFormat: "dd-MM-yyyy",
                                displayFormat: "dd-MM-yyyy"
                            });
                            break;

                        case "ComboBox":
                            oAnswer = new sap.m.ComboBox();
                            oAnswer.addItem(new sap.ui.core.Item({ key: "SAP ABAP", text: "SAP ABAP" }));
                            oAnswer.addItem(new sap.ui.core.Item({ key: "SAP Digital", text: "SAP Digital" }));
                            oAnswer.addItem(new sap.ui.core.Item({ key: "SAP MM", text: "SAP MM" }));
                            break;

                        default:
                            console.log("no Element")
                            break;
                    }

                    var oButton = new sap.m.Button({
                        text: "Remove",
                        width: "150px",
                        press: this.onDeleteQuestion.bind(this)
                    });

                    // var oHBox = new sap.m.HBox({
                    //     items:[oLabel,oButton],
                    //     justifyContent:"SpaceBetween"
                    // })

                    // var oVBox = new sap.m.VBox({
                    //     items: [oHBox,oAnswer]
                    // })

                    oButton.data("controls", [oQuestion, oAnswer, oButton])

                    oSimpleForm.addContent(oQuestion);
                    oSimpleForm.addContent(oAnswer);
                    oSimpleForm.addContent(oButton);

                }.bind(this));

            },


            onAddQuestion: function () {

                var oView = this.getView();
                var sQuestion = oView.byId("questionInput").getValue();

                if (sQuestion) {
                    var oSimpleFormToolbar = oView.byId("SimpleForm");

                    var oLabel = new sap.m.Label({
                        text: sQuestion,
                        design: "Bold"
                    });

                    var oAnswerInput = new sap.m.Input({
                        placeholder: "Enter your answer"
                    });

                    var oButton = new sap.m.Button({
                        text: "Remove",
                        width: "150px",
                        press: this.onDeleteQuestion.bind(this)
                    });

                    oButton.data("controls", [oLabel, oAnswerInput, oButton])

                    oView.byId("questionInput").setValue("");

                    oSimpleFormToolbar.addContent(oLabel);
                    oSimpleFormToolbar.addContent(oAnswerInput);
                    oSimpleFormToolbar.addContent(oButton);

                }
                else {

                    MessageBox.alert("Please Enter Question")
                }

                // ------------------------------------------------------------------------------------------------------------------- //

                // Create a new HBox for each question
                // var oQuestionBox = new sap.m.HBox({
                //     items: [
                //         new sap.m.Input({
                //             text: sQuestion+" :",
                //             enable:false
                //         }).addStyleClass("sapUiSmallMarginEnd"),
                //         new sap.m.Input({
                //             placeholder: "Enter Answer"
                //         }).addStyleClass("sapUiSmallMarginEnd"),
                //         new sap.m.Button({
                //             text: "Remove",
                //             press: this.onDeleteQuestion.bind(this)
                //         }).addStyleClass("sapUiSmallMarginEnd")
                //     ]
                // });

                // // Add the new question to the container
                // oForm.addItem(oQuestionBox);
            },

            // ------------------------------------------------------------------------------------------------------------------ //

            // var oQuestionContainer = new sap.m.HBox({
            //     items: [oLabel, oAnswerInput, oButton],
            //     alignItems: "Center"
            // });

            // oSimpleFormToolbar.addItem(oQuestionContainer);

            // ------------------------------------------------------------------------------------------------------------------ //

            onDeleteQuestion: function (oEvent) {

                var oButton = oEvent.getSource();
                // Retrieve the controls that were stored in the button
                var aControls = oButton.data("controls");
                // Get the SimpleForm
                var oSimpleFormToolbar = this.getView().byId("SimpleForm");
                // Remove each control from the form 

                aControls.forEach(function (oControl) {
                    oSimpleFormToolbar.removeContent(oControl);
                    oControl.destroy();
                    // Clean up the control properly 
                });

                // var oButton = oEvent.getSource();
                // var oQuestionBox = oButton.getParent();

                // // Remove the question box from the container
                // var oSimpleForm = this.getView().byId("SimpleForm");
                // oSimpleForm.removeContent(oQuestionBox);
            }

        });
    });
