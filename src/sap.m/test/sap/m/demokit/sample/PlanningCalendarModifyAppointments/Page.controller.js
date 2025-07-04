sap.ui.define([
		'sap/m/Label',
		'sap/m/Popover',
		'sap/ui/core/library',
		'sap/ui/core/format/DateFormat',
		'sap/ui/core/Fragment',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		'sap/base/Log',
		'sap/ui/core/date/UI5Date'
	],
	function(Label, Popover, coreLibrary, DateFormat, Fragment, Controller, JSONModel, Log, UI5Date) {
		"use strict";

		var ValueState = coreLibrary.ValueState;

		return Controller.extend("sap.m.sample.PlanningCalendarModifyAppointments.Page", {

			onInit: function () {
				var oModel = new JSONModel();
				oModel.setData({
					startDate: UI5Date.getInstance("2017", "0", "15", "8", "0"),
					people: [{
						pic: "test-resources/sap/ui/documentation/sdk/images/John_Miller.png",
						name: "John Miller",
						role: "team member",
						appointments: [
							{
								start: UI5Date.getInstance("2017", "0", "8", "08", "30"),
								end: UI5Date.getInstance("2017", "0", "8", "09", "30"),
								title: "Meet Max Mustermann",
								type: "Type02",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "11", "10", "0"),
								end: UI5Date.getInstance("2017", "0", "11", "12", "0"),
								title: "Team meeting",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "12", "11", "30"),
								end: UI5Date.getInstance("2017", "0", "12", "13", "30"),
								title: "Lunch",
								info: "canteen",
								type: "Type03",
								tentative: true
							},
							{
								start: UI5Date.getInstance("2017", "0", "15", "08", "30"),
								end: UI5Date.getInstance("2017", "0", "15", "09", "30"),
								title: "Meet Max Mustermann",
								type: "Type02",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "15", "10", "0"),
								end: UI5Date.getInstance("2017", "0", "15", "12", "0"),
								title: "Team meeting",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "15", "11", "30"),
								end: UI5Date.getInstance("2017", "0", "15", "13", "30"),
								title: "Lunch",
								info: "canteen",
								type: "Type03",
								tentative: true
							},
							{
								start: UI5Date.getInstance("2017", "0", "15", "13", "30"),
								end: UI5Date.getInstance("2017", "0", "15", "17", "30"),
								title: "Discussion with clients",
								info: "online meeting",
								type: "Type02",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "16", "04", "00"),
								end: UI5Date.getInstance("2017", "0", "16", "22", "30"),
								title: "Discussion of the plan",
								info: "Online meeting",
								type: "Type04",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "18", "08", "30"),
								end: UI5Date.getInstance("2017", "0", "18", "09", "30"),
								title: "Meeting with the manager",
								type: "Type02",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "18", "11", "30"),
								end: UI5Date.getInstance("2017", "0", "18", "13", "30"),
								title: "Lunch",
								info: "canteen",
								type: "Type03",
								tentative: true
							},
							{
								start: UI5Date.getInstance("2017", "0", "18", "1", "0"),
								end: UI5Date.getInstance("2017", "0", "18", "22", "0"),
								title: "Team meeting",
								info: "regular",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "21", "00", "30"),
								end: UI5Date.getInstance("2017", "0", "21", "23", "30"),
								title: "New Product",
								info: "room 105",
								type: "Type03",
								tentative: true
							},
							{
								start: UI5Date.getInstance("2017", "0", "25", "11", "30"),
								end: UI5Date.getInstance("2017", "0", "25", "13", "30"),
								title: "Lunch",
								type: "Type01",
								tentative: true
							},
							{
								start: UI5Date.getInstance("2017", "0", "29", "10", "0"),
								end: UI5Date.getInstance("2017", "0", "29", "12", "0"),
								title: "Team meeting",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "30", "08", "30"),
								end: UI5Date.getInstance("2017", "0", "30", "09", "30"),
								title: "Meet Max Mustermann",
								type: "Type02",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "30", "10", "0"),
								end: UI5Date.getInstance("2017", "0", "30", "12", "0"),
								title: "Team meeting",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "30", "11", "30"),
								end: UI5Date.getInstance("2017", "0", "30", "13", "30"),
								title: "Lunch",
								type: "Type03",
								tentative: true
							},
							{
								start: UI5Date.getInstance("2017", "0", "30", "13", "30"),
								end: UI5Date.getInstance("2017", "0", "30", "17", "30"),
								title: "Discussion with clients",
								type: "Type02",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "0", "31", "10", "00"),
								end: UI5Date.getInstance("2017", "0", "31", "11", "30"),
								title: "Discussion of the plan",
								info: "Online meeting",
								type: "Type04",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "1", "3", "08", "30"),
								end: UI5Date.getInstance("2017", "1", "13", "09", "30"),
								title: "Meeting with the manager",
								type: "Type02",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "1", "4", "10", "0"),
								end: UI5Date.getInstance("2017", "1", "4", "12", "0"),
								title: "Team meeting",
								info: "room 1",
								type: "Type01",
								pic: "sap-icon://sap-ui5",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2017", "2", "30", "10", "0"),
								end: UI5Date.getInstance("2017", "4", "33", "12", "0"),
								title: "Working out of the building",
								type: "Type07",
								pic: "sap-icon://sap-ui5",
								tentative: false
							}
						],
						headers: [
							{
								start: UI5Date.getInstance("2017", "0", "15", "8", "0"),
								end: UI5Date.getInstance("2017", "0", "15", "10", "0"),
								title: "Reminder",
								type: "Type06"
							},
							{
								start: UI5Date.getInstance("2017", "0", "15", "17", "0"),
								end: UI5Date.getInstance("2017", "0", "15", "19", "0"),
								title: "Reminder",
								type: "Type06"
							},
							{
								start: UI5Date.getInstance("2017", "8", "1", "0", "0"),
								end: UI5Date.getInstance("2017", "10", "30", "23", "59"),
								title: "New quarter",
								type: "Type10",
								tentative: false
							},
							{
								start: UI5Date.getInstance("2018", "1", "1", "0", "0"),
								end: UI5Date.getInstance("2018", "3", "30", "23", "59"),
								title: "New quarter",
								type: "Type10",
								tentative: false
							}
						]
					},
						{
							pic: "test-resources/sap/ui/documentation/sdk/images/Donna_Moore.jpg",
							name: "Donna Moore",
							role: "team member",
							appointments: [
								{
									start: UI5Date.getInstance("2017", "0", "10", "18", "00"),
									end: UI5Date.getInstance("2017", "0", "10", "19", "10"),
									title: "Discussion of the plan",
									info: "Online meeting",
									type: "Type04",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "9", "10", "0"),
									end: UI5Date.getInstance("2017", "0", "13", "12", "0"),
									title: "Workshop out of the country",
									type: "Type07",
									pic: "sap-icon://sap-ui5",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "15", "08", "00"),
									end: UI5Date.getInstance("2017", "0", "15", "09", "30"),
									title: "Discussion of the plan",
									info: "Online meeting",
									type: "Type04",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "15", "10", "0"),
									end: UI5Date.getInstance("2017", "0", "15", "12", "0"),
									title: "Team meeting",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "15", "18", "00"),
									end: UI5Date.getInstance("2017", "0", "15", "19", "10"),
									title: "Discussion of the plan",
									info: "Online meeting",
									type: "Type04",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "16", "10", "0"),
									end: UI5Date.getInstance("2017", "0", "31", "12", "0"),
									title: "Workshop out of the country",
									type: "Type07",
									pic: "sap-icon://sap-ui5",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2018", "0", "1", "0", "0"),
									end: UI5Date.getInstance("2018", "2", "31", "23", "59"),
									title: "New quarter",
									type: "Type10",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "01", "11", "10", "0"),
									end: UI5Date.getInstance("2017", "02", "20", "12", "0"),
									title: "Team collaboration",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "3", "01", "10", "0"),
									end: UI5Date.getInstance("2017", "3", "31", "12", "0"),
									title: "Workshop out of the country",
									type: "Type07",
									pic: "sap-icon://sap-ui5",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "4", "01", "10", "0"),
									end: UI5Date.getInstance("2017", "4", "31", "12", "0"),
									title: "Out of the office",
									type: "Type08",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "7", "1", "0", "0"),
									end: UI5Date.getInstance("2017", "7", "31", "23", "59"),
									title: "Vacation",
									info: "out of office",
									type: "Type04",
									tentative: false
								}
							],
							headers: [
								{
									start: UI5Date.getInstance("2017", "0", "15", "9", "0"),
									end: UI5Date.getInstance("2017", "0", "15", "10", "0"),
									title: "Payment reminder",
									type: "Type06"
								},
								{
									start: UI5Date.getInstance("2017", "0", "15", "16", "30"),
									end: UI5Date.getInstance("2017", "0", "15", "18", "00"),
									title: "Private appointment",
									type: "Type06"
								}
							]
						},
						{
							pic: "sap-icon://employee",
							name: "Max Mustermann",
							role: "team member",
							appointments: [
								{
									start: UI5Date.getInstance("2017", "0", "15", "08", "30"),
									end: UI5Date.getInstance("2017", "0", "15", "09", "30"),
									title: "Meet John Miller",
									type: "Type02",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "15", "10", "0"),
									end: UI5Date.getInstance("2017", "0", "15", "12", "0"),
									title: "Team meeting",
									info: "room 1",
									type: "Type01",
									pic: "sap-icon://sap-ui5",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "15", "13", "00"),
									end: UI5Date.getInstance("2017", "0", "15", "16", "00"),
									title: "Discussion with clients",
									info: "online",
									type: "Type02",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "16", "0", "0"),
									end: UI5Date.getInstance("2017", "0", "16", "23", "59"),
									title: "Vacation",
									info: "out of office",
									type: "Type08",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "17", "1", "0"),
									end: UI5Date.getInstance("2017", "0", "18", "22", "0"),
									title: "Workshop",
									info: "regular",
									type: "Type08",
									pic: "sap-icon://sap-ui5",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "19", "08", "30"),
									end: UI5Date.getInstance("2017", "0", "19", "18", "30"),
									title: "Meet John Doe",
									type: "Type08",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "19", "10", "0"),
									end: UI5Date.getInstance("2017", "0", "19", "16", "0"),
									title: "Team meeting",
									info: "room 1",
									type: "Type08",
									pic: "sap-icon://sap-ui5",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "19", "07", "00"),
									end: UI5Date.getInstance("2017", "0", "19", "17", "30"),
									title: "Discussion with clients",
									type: "Type08",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "20", "0", "0"),
									end: UI5Date.getInstance("2017", "0", "20", "23", "59"),
									title: "Vacation",
									info: "out of office",
									type: "Type08",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "0", "22", "07", "00"),
									end: UI5Date.getInstance("2017", "0", "27", "17", "30"),
									title: "Discussion with clients",
									info: "out of office",
									type: "Type08",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "2", "13", "9", "0"),
									end: UI5Date.getInstance("2017", "2", "17", "10", "0"),
									title: "Payment week",
									type: "Type08"
								},
								{
									start: UI5Date.getInstance("2017", "03", "10", "0", "0"),
									end: UI5Date.getInstance("2017", "05", "16", "23", "59"),
									title: "Vacation",
									info: "out of office",
									type: "Type04",
									tentative: false
								},
								{
									start: UI5Date.getInstance("2017", "07", "1", "0", "0"),
									end: UI5Date.getInstance("2017", "09", "31", "23", "59"),
									title: "New quarter",
									type: "Type10",
									tentative: false
								}
							],
							headers: [
								{
									start: UI5Date.getInstance("2017", "0", "16", "0", "0"),
									end: UI5Date.getInstance("2017", "0", "16", "23", "59"),
									title: "Private",
									type: "Type05"
								}
							]
						}
					]
				});
				this.getView().setModel(oModel);
			},

			_aDialogTypes: [
				{ title: "Create Appointment", type: "create_appointment" },
				{ title: "Create Appointment", type: "create_appointment_with_context"},
				{ title: "Edit Appointment", type: "edit_appointment" }],

			handleAppointmentSelect: function (oEvent) {
				var oAppointment = oEvent.getParameter("appointment");

				if (oAppointment) {
					this._handleSingleAppointment(oAppointment);
				} else {
					this._handleGroupAppointments(oEvent);
				}
			},

			_addNewAppointment: function(oAppointment){
				var oModel = this.getView().getModel(),
					sPath = "/people/" + this.byId("selectPerson").getSelectedIndex().toString(),
					oPersonAppointments;

				if (this.byId("isIntervalAppointment").getSelected()){
					sPath += "/headers";
				} else {
					sPath += "/appointments";
				}

				oPersonAppointments = oModel.getProperty(sPath);

				oPersonAppointments.push(oAppointment);

				oModel.setProperty(sPath, oPersonAppointments);
			},

			handleCancelButton: function () {
				this.byId("detailsPopover").close();
			},

			handleAppointmentCreate: function () {
				this._arrangeDialogFragment(this._aDialogTypes[0].type);
			},

			handleAppointmentAddWithContext: function (oEvent) {
				this.oClickEventParameters = oEvent.getParameters();
				this._arrangeDialogFragment(this._aDialogTypes[1].type);
			},

			_validateDateTimePicker: function (oDateTimePickerStart, oDateTimePickerEnd) {
				var oStartDate = oDateTimePickerStart.getDateValue(),
					oEndDate = oDateTimePickerEnd.getDateValue(),
					sValueStateText = "Start date should be before End date";

				if (oStartDate && oEndDate && oEndDate.getTime() <= oStartDate.getTime()) {
					oDateTimePickerStart.setValueState(ValueState.Error);
					oDateTimePickerEnd.setValueState(ValueState.Error);
					oDateTimePickerStart.setValueStateText(sValueStateText);
					oDateTimePickerEnd.setValueStateText(sValueStateText);
				} else {
					oDateTimePickerStart.setValueState(ValueState.None);
					oDateTimePickerEnd.setValueState(ValueState.None);
				}
			},

			updateButtonEnabledState: function (oDialog) {
				var oStartDate = this.byId("startDate"),
					oEndDate = this.byId("endDate"),
					bEnabled = oStartDate.getValueState() !== ValueState.Error
					&& oStartDate.getValue() !== ""
					&& oEndDate.getValue() !== ""
					&& oEndDate.getValueState() !== ValueState.Error;

					oDialog.getBeginButton().setEnabled(bEnabled);
			},

			handleCreateChange: function (oEvent) {
				var oDateTimePickerStart = this.byId("startDate"),
					oDateTimePickerEnd = this.byId("endDate");

				if (oEvent.getParameter("valid")) {
					this._validateDateTimePicker(oDateTimePickerStart, oDateTimePickerEnd);
				} else {
					oEvent.getSource().setValueState(ValueState.Error);
				}

				this.updateButtonEnabledState(this.byId("createDialog"));
			},

			_removeAppointment: function(oAppointment, sPersonId){
				var oModel = this.getView().getModel(),
					sTempPath,
					aPersonAppointments,
					iIndexForRemoval;

				if (!sPersonId){
					sTempPath = this.sPath.slice(0,this.sPath.indexOf("appointments/") + "appointments/".length);
				} else {
					sTempPath = "/people/" + sPersonId + "/appointments";
				}

				aPersonAppointments = oModel.getProperty(sTempPath);
				iIndexForRemoval = aPersonAppointments.indexOf(oAppointment);

				if (iIndexForRemoval !== -1){
					aPersonAppointments.splice(iIndexForRemoval, 1);
				}

				oModel.setProperty(sTempPath, aPersonAppointments);
			},

			handleDeleteAppointment: function(){
				var oDetailsPopover = this.byId("detailsPopover"),
					oBindingContext = oDetailsPopover.getBindingContext(),
					oAppointment = oBindingContext.getObject(),
					iPersonIdStartIndex = oBindingContext.getPath().indexOf("/people/") + "/people/".length,
					iPersonId = oBindingContext.getPath()[iPersonIdStartIndex];

				oDetailsPopover.close();
				this._removeAppointment(oAppointment, iPersonId);
			},

			handleEditButton: function(){
				var oDetailsPopover = this.byId("detailsPopover");
				this.sPath = oDetailsPopover.getBindingContext().getPath();
				oDetailsPopover.close();
				this._arrangeDialogFragment(this._aDialogTypes[2].type);

			},

			_arrangeDialogFragment: function (iDialogType) {
				var oView = this.getView();

				if (!this._pNewAppointmentDialog) {
					this._pNewAppointmentDialog = Fragment.load({
						id: oView.getId(),
						name: "sap.m.sample.PlanningCalendarModifyAppointments.Create",
						controller: this
					}).then(function(oDialog) {
						oView.addDependent(oDialog);
						return oDialog;
					});
				}
				this._pNewAppointmentDialog.then(function(oDialog) {
					this._arrangeDialog(iDialogType, oDialog);
				}.bind(this));
			},

			_arrangeDialog: function(sDialogType, oDialog) {
				var sTempTitle = "";
				oDialog._sDialogType = sDialogType;
				if (sDialogType === "edit_appointment"){
					this._setEditAppointmentDialogContent(oDialog);
					sTempTitle = this._aDialogTypes[2].title;
				} else if (sDialogType === "create_appointment_with_context"){
					this._setCreateWithContextAppointmentDialogContent();
					sTempTitle = this._aDialogTypes[1].title;
				} else if (sDialogType === "create_appointment"){
					this._setCreateAppointmentDialogContent();
					sTempTitle = this._aDialogTypes[0].title;
				} else {
					Log.error("Wrong dialog type.");
				}

				this.updateButtonEnabledState(oDialog);
				oDialog.setTitle(sTempTitle);
				oDialog.open();
			},

			handleAppointmentTypeChange: function(oEvent){
				var oAppointmentType = this.byId("isIntervalAppointment");

				oAppointmentType.setSelected(oEvent.getSource().getSelected());
			},

			handleDialogCancelButton: function(){
				this.byId("createDialog").close();
			},

			_editAppointment: function(oAppointment, bIsIntervalAppointment, iPersonId, oNewAppointmentDialog){
				var sAppointmentPath = this._appointmentOwnerChange(oNewAppointmentDialog),
					oModel = this.getView().getModel();

				if (bIsIntervalAppointment) {
					this._convertToHeader(oAppointment, oNewAppointmentDialog);
				} else {
					if (this.sPath !== sAppointmentPath) {
						this._addNewAppointment(oNewAppointmentDialog.getModel().getProperty(this.sPath));
						this._removeAppointment(oNewAppointmentDialog.getModel().getProperty(this.sPath));
					}
					oModel.setProperty(sAppointmentPath + "/title", oAppointment.title);
					oModel.setProperty(sAppointmentPath + "/info", oAppointment.info);
					oModel.setProperty(sAppointmentPath + "/type", oAppointment.type);
					oModel.setProperty(sAppointmentPath + "/start", oAppointment.start);
					oModel.setProperty(sAppointmentPath + "/end", oAppointment.end);
				}
			},

			_convertToHeader: function(oAppointment, oNewAppointmentDialog){
				var sPersonId = this.byId("selectPerson").getSelectedIndex().toString();

				this._removeAppointment(oNewAppointmentDialog.getModel().getProperty(this.sPath), sPersonId);
				this._addNewAppointment({start: oAppointment.start, end: oAppointment.end, title: oAppointment.title, type: oAppointment.type});
			},

			handleDialogSaveButton: function(){
				var oStartDate = this.byId("startDate"),
					oEndDate = this.byId("endDate"),
					sInfoValue = this.byId("moreInfo").getValue(),
					sInputTitle = this.byId("inputTitle").getValue(),
					iPersonId = this.byId("selectPerson").getSelectedIndex(),
					oModel = this.getView().getModel(),
					bIsIntervalAppointment = this.byId("isIntervalAppointment").getSelected(),
					oNewAppointmentDialog = this.byId("createDialog"),
					oNewAppointment;

					if (oStartDate.getValueState() !== ValueState.Error
					&& oEndDate.getValueState() !== ValueState.Error){
						if (this.sPath && oNewAppointmentDialog._sDialogType === "edit_appointment") {
							this._editAppointment({
								title: sInputTitle,
								info: sInfoValue,
								type: this.byId("detailsPopover").getBindingContext().getObject().type,
								start: oStartDate.getDateValue(),
								end: oEndDate.getDateValue()}, bIsIntervalAppointment, iPersonId, oNewAppointmentDialog);
						} else {
							if (bIsIntervalAppointment) {
								oNewAppointment = {
									title: sInputTitle,
									start: oStartDate.getDateValue(),
									end: oEndDate.getDateValue()
								};
							} else {
								oNewAppointment = {
									title: sInputTitle,
									info: sInfoValue,
									start: oStartDate.getDateValue(),
									end: oEndDate.getDateValue()
								};
							}
							this._addNewAppointment(oNewAppointment);
					}

					oModel.updateBindings();

					oNewAppointmentDialog.close();
				}
			},

			_appointmentOwnerChange: function(oNewAppointmentDialog){
				var iSpathPersonId = this.sPath[this.sPath.indexOf("/people/") + "/people/".length],
					iSelectedPerson = this.byId("selectPerson").getSelectedIndex(),
					sTempPath = this.sPath,
					iLastElementIndex = oNewAppointmentDialog.getModel().getProperty("/people/" + iSelectedPerson.toString() + "/appointments/").length.toString();

				if (iSpathPersonId !== iSelectedPerson.toString()){
					sTempPath = "".concat("/people/", iSelectedPerson.toString(), "/appointments/", iLastElementIndex.toString());
				}

				return sTempPath;
			},

			_setCreateAppointmentDialogContent: function(){
				var oAppointmentType = this.byId("isIntervalAppointment"),
					oDateTimePickerStart = this.byId("startDate"),
					oDateTimePickerEnd =  this.byId("endDate"),
					oTitleInput = this.byId("inputTitle"),
					oMoreInfoInput = this.byId("moreInfo"),
					oPersonSelected = this.byId("selectPerson");

				//Set the person in the first row as selected.
				oPersonSelected.setSelectedItem(this.byId("selectPerson").getItems()[0]);
				oDateTimePickerStart.setValue("");
				oDateTimePickerEnd.setValue("");
				oDateTimePickerStart.setValueState(ValueState.None);
				oDateTimePickerEnd.setValueState(ValueState.None);
				oTitleInput.setValue("");
				oMoreInfoInput.setValue("");
				oAppointmentType.setSelected(false);
			},

			_setCreateWithContextAppointmentDialogContent: function(){
				var aPeople = this.getView().getModel().getProperty('/people/'),
					oSelectedIntervalStart = this.oClickEventParameters.startDate,
					oStartDate = this.byId("startDate"),
					oSelectedIntervalEnd = this.oClickEventParameters.endDate,
					oEndDate = this.byId("endDate"),
					oDateTimePickerStart = this.byId("startDate"),
					oDateTimePickerEnd =  this.byId("endDate"),
					oAppointmentType = this.byId("isIntervalAppointment"),
					oTitleInput = this.byId("inputTitle"),
					oMoreInfoInput = this.byId("moreInfo"),
					sPersonName,
					oPersonSelected;

				if (this.oClickEventParameters.row){
					sPersonName = this.oClickEventParameters.row.getTitle();
					oPersonSelected = this.byId("selectPerson");

					oPersonSelected.setSelectedIndex(aPeople.indexOf(aPeople.filter(function(oPerson){return  oPerson.name === sPersonName;})[0]));

				}

				oStartDate.setDateValue(oSelectedIntervalStart);

				oEndDate.setDateValue(oSelectedIntervalEnd);

				oTitleInput.setValue("");

				oMoreInfoInput.setValue("");

				oAppointmentType.setSelected(false);

				oDateTimePickerStart.setValueState(ValueState.None);
				oDateTimePickerEnd.setValueState(ValueState.None);

				delete this.oClickEventParameters;
			},

			_setEditAppointmentDialogContent: function(oDialog){
				var oAppointment = oDialog.getModel().getProperty(this.sPath),
					oSelectedIntervalStart = oAppointment.start,
					oSelectedIntervalEnd = oAppointment.end,
					oDateTimePickerStart = this.byId("startDate"),
					oDateTimePickerEnd = this.byId("endDate"),
					sSelectedInfo = oAppointment.info,
					sSelectedTitle = oAppointment.title,
					iSelectedPersonId = this.sPath[this.sPath.indexOf("/people/") + "/people/".length],
					oPersonSelected = this.byId("selectPerson"),
					oStartDate = this.byId("startDate"),
					oEndDate = this.byId("endDate"),
					oMoreInfoInput = this.byId("moreInfo"),
					oTitleInput = this.byId("inputTitle"),
					oAppointmentType = this.byId("isIntervalAppointment");

				oPersonSelected.setSelectedIndex(iSelectedPersonId);

				oStartDate.setDateValue(oSelectedIntervalStart);

				oEndDate.setDateValue(oSelectedIntervalEnd);

				oMoreInfoInput.setValue(sSelectedInfo);

				oTitleInput.setValue(sSelectedTitle);

				oDateTimePickerStart.setValueState(ValueState.None);
				oDateTimePickerEnd.setValueState(ValueState.None);

				oAppointmentType.setSelected(false);
			},

			_handleSingleAppointment: function (oAppointment) {
				var oView = this.getView();
				if (oAppointment === undefined) {
					return;
				}

				if (!oAppointment.getSelected() && this._pDetailsPopover) {
					this._pDetailsPopover.then(function(oDetailsPopover){
						oDetailsPopover.close();
					});
					return;
				}

				if (!this._pDetailsPopover) {
					this._pDetailsPopover = Fragment.load({
						id: oView.getId(),
						name: "sap.m.sample.PlanningCalendarModifyAppointments.Details",
						controller: this
					}).then(function(oDetailsPopover){
						oView.addDependent(oDetailsPopover);
						return oDetailsPopover;
					});
				}

				this._pDetailsPopover.then(function(oDetailsPopover){
					this._setDetailsDialogContent(oAppointment, oDetailsPopover);
				}.bind(this));
			},

			_setDetailsDialogContent: function(oAppointment, oDetailsPopover){
				oDetailsPopover.setBindingContext(oAppointment.getBindingContext());
				oDetailsPopover.openBy(oAppointment);
			},

			formatDate: function (oDate) {
				if (oDate) {
					var iHours = oDate.getHours(),
						iMinutes = oDate.getMinutes(),
						iSeconds = oDate.getSeconds();

					if (iHours !== 0 || iMinutes !== 0 || iSeconds !== 0) {
						return DateFormat.getDateTimeInstance({ style: "medium" }).format(oDate);
					} else  {
						return DateFormat.getDateInstance({ style: "medium" }).format(oDate);
					}
				}
			},

			_handleGroupAppointments: function (oEvent) {
				var aAppointments,
					sGroupAppointmentType,
					sGroupPopoverValue,
					sGroupAppDomRefId,
					bTypeDiffer;

				aAppointments = oEvent.getParameter("appointments");
				sGroupAppointmentType = aAppointments[0].getType();
				sGroupAppDomRefId = oEvent.getParameter("domRefId");
				bTypeDiffer = aAppointments.some(function (oAppointment) {
					return sGroupAppointmentType !== oAppointment.getType();
				});

				if (bTypeDiffer) {
					sGroupPopoverValue = aAppointments.length + " Appointments of different types selected";
				} else {
					sGroupPopoverValue = aAppointments.length + " Appointments of the same " + sGroupAppointmentType + " selected";
				}

				if (!this._oGroupPopover) {
					this._oGroupPopover = new Popover({
						title: "Group Appointments",
						content: new Label({
							text: sGroupPopoverValue
						})
					});
				} else {
					this._oGroupPopover.getContent()[0].setText(sGroupPopoverValue);
				}
				this._oGroupPopover.addStyleClass("sapUiContentPadding");
				this._oGroupPopover.openBy(document.getElementById(sGroupAppDomRefId));
			}

		});

	});
