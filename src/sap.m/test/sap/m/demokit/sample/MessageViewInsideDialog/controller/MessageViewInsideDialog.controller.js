sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/core/IconPool',
	'sap/ui/core/library',
	'sap/ui/model/json/JSONModel',
	'sap/m/Link',
	'sap/m/MessageItem',
	'sap/m/MessageView',
	'sap/m/MessageToast',
	'sap/m/Button',
	'sap/m/Dialog',
	'sap/m/Bar',
	'sap/m/Title'
], function(Controller, IconPool, coreLibrary, JSONModel, Link, MessageItem, MessageView, MessageToast, Button, Dialog, Bar, Title) {
	"use strict";

	// shortcut for sap.ui.core.TitleLevel
	var TitleLevel = coreLibrary.TitleLevel;

	return Controller.extend("sap.m.sample.MessageViewInsideDialog.controller.MessageViewInsideDialog", {

		onInit: function () {
			var that = this;

			var	oLink = new Link({
				text: "Show more information",
				href: "http://sap.com",
				target: "_blank"
			});

			var oMessageTemplate = new MessageItem({
				type: '{type}',
				title: '{title}',
				activeTitle: '{activeTitle}',
				description: '{description}',
				subtitle: '{subtitle}',
				counter: '{counter}',
				markupDescription: '{markupDescription}',
				link: oLink
			});

			var aMockMessages = [{
				type: 'Error',
				title: 'Error message',
				description: 'First Error message description. \n' +
				'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod',
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Warning',
				title: 'Warning without description',
				description: ''
			}, {
				type: 'Success',
				title: 'Success message',
				description: 'First Success message description',
				subtitle: 'Example of subtitle',
				counter: 1
			}, {
				type: 'Error',
				title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ',
				description: 'Second Error message description',
				subtitle: 'Example of subtitle',
				counter: 2
			}, {
				type: 'Information',
				title: 'Information message',
				description: 'First Information message description',
				subtitle: 'Example of long subtitle lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris ',
				counter: 1
			}, {
				type: 'Success',
				title: 'Success message with active title',
				description: 'Second Success message description',
				subtitle: 'Example of subtitle',
				activeTitle: true,
				counter: 1
			}];

			var oModel = new JSONModel();

			oModel.setData(aMockMessages);

			this.oMessageView = new MessageView({
				showDetailsPageHeader: false,
				itemSelect: function () {
					oBackButton.setVisible(true);
				},
				items: {
					path: "/",
					template: oMessageTemplate
				},
				activeTitlePress: function () {
					MessageToast.show('Active title pressed');
				}
			});

			var oBackButton = new Button({
					icon: IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						that.oMessageView.navigateBack();
						this.setVisible(false);
					}
				});



			this.oMessageView.setModel(oModel);

			this.oDialog = new Dialog({
				resizable: true,
				content: this.oMessageView,
				state: 'Error',
				beginButton: new Button({
					press: function () {
						this.getParent().close();
					},
					text: "Close"
				}),
				customHeader: new Bar({
					contentLeft: [oBackButton],
					contentMiddle: [
						new Title({
							text: "Messages",
							level: TitleLevel.H1
						})
					]
				}),
				contentHeight: "50%",
				contentWidth: "50%",
				verticalScrolling: false
			});
		},

		handleDialogPress: function (oEvent) {
			this.oMessageView.navigateBack();
			this.oDialog.open();
		}
	});
});
