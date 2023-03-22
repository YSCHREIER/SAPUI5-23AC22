sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("employees.controller.App", {
            onInit: function () {

            },

            onLiveChangeInputEmployee: function (oEvent) {

                console.log(oEvent.getParameters());

                let sValue = oEvent.getParameter("newValue"),
                    oInput = oEvent.getSource();

                console.log(oInput);

                if(sValue.length === oInput.getMaxLength()){
                    oInput.setDescription("OK");
                    this.getView().byId("lblCountry").setVisible(true);
                    this.getView().byId("selectCountry").setVisible(true);
                    
                }
                else{

                    oInput.setDescription("not OK");
                    this.getView().byId("lblCountry").setVisible(false);
                    this.getView().byId("selectCountry").setVisible(false);
                }

            },
        });
    });
