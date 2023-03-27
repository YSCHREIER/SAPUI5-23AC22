sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,Filter,FilterOperator,JSONModel) {
        "use strict";

        return Controller.extend("employees.controller.App", {
            onInit: function () {

                let oJSONModelEmployees = new JSONModel(),
                    oJSONModelCountries = new JSONModel(),
                    oJSONModelConfig = new JSONModel(),

                    oView = this.getView(),
                    oResourceBundle = oView.getModel("i18n").getResourceBundle();

                    oJSONModelEmployees.loadData("../localService/mockdata/Employees.json");
                    oView.setModel(oJSONModelEmployees,"jsonEmployees");

                    oJSONModelCountries.loadData("../localService/mockdata/Countries.json");
                    oView.setModel(oJSONModelCountries,"jsonCountries");

                    oJSONModelConfig.loadData("../localService/mockdata/Config.json");
                    oView.setModel(oJSONModelConfig,"jsonConfig");
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

            onFilter:function(){

                var oJSONModel = this.getView().getModel("jsonCountries").getData(),
                    aFilters = [];

                if(oJSONModel.EmployeeId)
                {
                    //aFilters.push(new Filter("EmployeeID",FilterOperator.Contains, oJSONModel.EmployeeId  ));

                    aFilters.push(new Filter({
                        filters:[
                            new Filter("EmployeeID",FilterOperator.Contains, oJSONModel.EmployeeId  ),
                            new Filter("FirstName",FilterOperator.Contains, oJSONModel.EmployeeId  )
                        ],
                        and :false

                     }));

                }
                
                if(oJSONModel.CountryKey)
                {
                    aFilters.push(new Filter("Country",FilterOperator.EQ, oJSONModel.CountryKey));
                }

                let oTable = this.byId("tableEmployee"),
                    oBinding = oTable.getBinding("items");
                    oBinding.filter(aFilters);

            },
            onClearFilter : function(){

                let oModel = this.getView().getModel("jsonCountries");

                oModel.setProperty("/EmployeeId");
                oModel.setProperty("/CountryKey");

                let oTable = this.byId("tableEmployee"),
                    oBinding = oTable.getBinding("items");

                oBinding.filter([]);

            },

            onMessage: function(oEvent){

                let oBindingContext = oEvent.getSource().getBindingContext("jsonEmployees");

                console.log(oBindingContext.getObject());

                new sap.m.MessageToast.show(oBindingContext.getObject().PostalCode)


            },

            onShowCity: function ()
            {
                    let oModelConfig = this.getView().getModel("jsonConfig");
                         
                    oModelConfig.setProperty("/visibleCity",true);
                    oModelConfig.setProperty("/visibleBtnShowCity",false);
                    oModelConfig.setProperty("/visibleBtnHideCity",true);


            },

            onHideCity: function ()
            {
                let oModelConfig = this.getView().getModel("jsonConfig");
                         
                oModelConfig.setProperty("/visibleCity",false);
                oModelConfig.setProperty("/visibleBtnShowCity",true);
                oModelConfig.setProperty("/visibleBtnHideCity",false);


            },

            onShowOrders: function(oEvent)
            {
                let oOrderTable = this.getView().byId("OrderTable");

                //LIMPIAR EL CONTENEDOR POR SI YA EXISTE
                oOrderTable.destroyItems();

                //OBTENER LAS ORDENES DEL EMPLEADO SELECCIONADO
                let oBindingContext = oEvent.getSource().getBindingContext("jsonEmployees");
                let oOrders = oBindingContext.getProperty("Orders");

                //2 formas para obtener el ORDER
                console.log(oBindingContext.getObject().Orders);
                console.log(oOrders);

                let aColumns = [],
                    aItems = [];

                //CREAMOS LAS COLUMNAS POR SEPARADO
                let aColumnOrderId = new sap.m.Column({header: new sap.m.Label({text:"{i18n>OrderId}"})}),
                    aColumnFreight = new sap.m.Column({header: new sap.m.Label({text:"{i18n>Freight}"})}),
                    aColumnShipAddress = new sap.m.Column({header: new sap.m.Label({text:"{i18n>ShipAddress}"})});

                //AGREGAMOS LAS COLUMNAS AL ARRAY
                aColumns.push(aColumnOrderId,aColumnFreight,aColumnShipAddress);

                //CREAMOS LOS ITEMS

                oOrders.forEach((oOrder) => {
                    let oTemplate = new sap.m.ColumnListItem({
                        
                        cells: [
                                //new sap.m.ObjectIdentifier({title:oOrder.OrderID}),
                                new sap.m.ObjectIdentifier({title: oOrder.OrderID}),
                                new sap.m.Text({text: oOrder.Freight}),
                                new sap.m.Text({text: oOrder.ShipAddress})                                
                            ]
                    })

                    aItems.push(oTemplate);
                });

            //CREAMOS LA TABLA

            let oTable = new sap.m.Table({
                columns : aColumns,
                items: aItems,
                width : "auto"
            }).addStyleClass("sapUiSmallMargin");

            //oOrderTable.addItem(oTable);

            //OTRA FORMA DE CREAR TABLA
            let oNewTable = new sap.m.Table();
            oNewTable.setWidth("auto");
            oNewTable.addStyleClass("sapUiSmallMargin");

            //CREAR LAS COLUMNAS

            let oColumnOrderId2 = new sap.m.Column(),
                oLabelOrderId2 = new sap.m.Label();

                oLabelOrderId2.bindProperty("text","i18n>OrderId" );
                oColumnOrderId2.setHeader(oLabelOrderId2);
                oNewTable.addColumn(oColumnOrderId2);

            
            let oColumnFreight2 = new sap.m.Column(),
                oLabelFreight2 = new sap.m.Label();

                oLabelFreight2.bindProperty("text","i18n>Freight" );
                oColumnFreight2.setHeader(oLabelFreight2);
                oNewTable.addColumn(oColumnFreight2);

            let oColumnShipAddress2 = new sap.m.Column(),
                oLabelShipAddress2 = new sap.m.Label();

                oLabelShipAddress2.bindProperty("text","i18n>ShipAddress" );
                oColumnShipAddress2.setHeader(oLabelShipAddress2);
                oNewTable.addColumn(oColumnShipAddress2);

            let oTemplate2 = new sap.m.ColumnListItem();

            let oCellOrderId = new sap.m.ObjectIdentifier();
            oCellOrderId.bindProperty("title","jsonEmployees>OrderID" );
            oTemplate2.addCell(oCellOrderId);

            let oCellOFreight = new sap.m.Text();
            oCellOFreight.bindProperty("text","jsonEmployees>Freight" );
            oTemplate2.addCell(oCellOFreight);

            let oCellShipAddress = new sap.m.Text();
            oCellShipAddress.bindProperty("text","jsonEmployees>ShipAddress" );
            oTemplate2.addCell(oCellShipAddress);

            //CREAMOS EL BINDING

            let oBinding = {
                path : 'Orders',
                model : 'jsonEmployees',
                template : oTemplate2
            };

            oNewTable.bindAggregation("items", oBinding);
            oNewTable.bindElement("jsonEmployees>" + oBindingContext.getPath());
             
            oOrderTable.addItem(oNewTable);

            }

        });
    });
