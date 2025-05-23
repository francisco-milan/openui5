/* global QUnit */

sap.ui.define([
	"sap/ui/thirdparty/sinon-4",
	"sap/ui/dt/DesignTimeMetadata",
	"sap/ui/layout/form/SimpleForm",
	"sap/ui/core/Lib",
	"sap/ui/core/Title",
	"sap/m/Button",
	"sap/m/Label",
	"sap/m/Input",
	"sap/ui/qunit/utils/nextUIUpdate"
], function(
	sinon,
	DesignTimeMetadata,
	SimpleForm,
	Lib,
	Title,
	Button,
	Label,
	Input,
	nextUIUpdate
) {
	"use strict";

	var sandbox = sinon.createSandbox();

	QUnit.module("Given that the DesignTimeMetadata is created for a fake control", {
		beforeEach() {
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					testField: "testValue",
					domRef: "domRef",
					actions: {
						action1: "firstChangeType",
						action2: {
							changeType: "secondChangeType"
						},
						action3(oElement) {
							return {
								changeType: oElement.name
							};
						},
						actionWithASubAction: {
							subAction: {
								changeType: "subActionChangeType"
							}
						},
						actionWithASubActionInsideFunction: {
							subAction(oElement) {
								return {
									changeType: oElement.name
								};
							}
						}
					}
				}
			});
		},
		afterEach() {
			sandbox.restore();
			this.oDesignTimeMetadata.destroy();
		}
	}, function() {
		QUnit.test("when the DesignTimeMetadata is initialized", function(assert) {
			assert.strictEqual(this.oDesignTimeMetadata.getData().testField, "testValue", "then the field is returned right");
			assert.strictEqual(this.oDesignTimeMetadata.getDomRef(), "domRef", "then the domRef is returned right");
			assert.strictEqual(this.oDesignTimeMetadata.isIgnored(), false, "then ignore property is returned right");
		});

		QUnit.test("when getAction is called...", function(assert) {
			assert.propEqual(
				this.oDesignTimeMetadata.getAction("action1"),
				{changeType: "firstChangeType"},
				"...for string action, the string is returned"
			);
			assert.propEqual(
				this.oDesignTimeMetadata.getAction("action2"),
				{changeType: "secondChangeType"},
				"...for object action, the object is returned"
			);
			assert.propEqual(
				this.oDesignTimeMetadata.getAction("action3", {name: "thirdChangeType"}),
				{changeType: "thirdChangeType"},
				"...for function action, the correct string is returned"
			);
		});

		QUnit.test("when getAction is called for a sub action", function(assert) {
			assert.propEqual(
				this.oDesignTimeMetadata.getAction("actionWithASubAction", undefined, "subAction"),
				{changeType: "subActionChangeType"},
				"then the sub action was returned"
			);
			assert.strictEqual(
				this.oDesignTimeMetadata.getAction("actionWithASubAction", undefined, "InvalidSubAction"),
				undefined,
				"then for an invalid sub action undefined is returned"
			);
			assert.propEqual(
				this.oDesignTimeMetadata.getAction("actionWithASubActionInsideFunction", {name: "subActionChangeType"}, "subAction"),
				{changeType: "subActionChangeType"},
				"then the sub action was returned for a function action"
			);
		});

		QUnit.test("when getCommandName is called...", function(assert) {
			assert.strictEqual(
				this.oDesignTimeMetadata.getCommandName("firstChangeType"),
				"action1",
				"...for string action, then the proper command name is returned"
			);
			assert.strictEqual(
				this.oDesignTimeMetadata.getCommandName("secondChangeType"),
				"action2",
				"...for object action, then the proper command name is returned"
			);
			assert.strictEqual(
				this.oDesignTimeMetadata.getCommandName("thirdChangeType", {name: "thirdChangeType"}),
				"action3",
				"...for function action, then the proper command name is returned"
			);
			assert.strictEqual(
				this.oDesignTimeMetadata.getCommandName("invalidChangeType"),
				undefined,
				"...for an invalid action, then no command name is returned"
			);
		});

		QUnit.test("when getCommandName is called for a sub action or aggregation action", function(assert) {
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						add: {
							delegate: {
								changeType: "addDelegateChangeType"
							},
							custom: "addCustomChangeType"
						},
						someCommandThatShouldBeIgnored: "someChangeType"
					},
					aggregations: {
						someAggregation: {
							actions: {
								someCommand: "someChangeType"
							}
						}
					}
				}
			});

			assert.strictEqual(
				this.oDesignTimeMetadata.getCommandName("addDelegateChangeType"),
				"addDelegateProperty",
				"then the add delegate command is detected"
			);
			assert.strictEqual(
				this.oDesignTimeMetadata.getCommandName("addCustomChangeType"),
				"customAdd",
				"then the custom add command is detected"
			);
			assert.strictEqual(
				this.oDesignTimeMetadata.getCommandName("someChangeType", null, "someAggregation"),
				"someCommand",
				"then aggregation actions are considered"
			);
		});

		QUnit.test("when getLibraryText is called", function(assert) {
			var oFakeElement = {
				getMetadata: sandbox.stub().returns({
					getLibraryName: sandbox.stub().returns("fakeLibrary")
				})
			};
			var oFakeLibBundle = {
				getText: sandbox.stub().returns("translated text"),
				hasText: sandbox.stub().returns(true)
			};
			sandbox.stub(Lib, "getResourceBundleFor").returns(oFakeLibBundle);
			assert.equal(
				this.oDesignTimeMetadata.getLibraryText(oFakeElement, "I18N_KEY"),
				"translated text",
				"then you get the text from the resource bundle of the corresponding library"
			);
		});

		QUnit.test("when getLibraryText is called and only the parent control has a text", function(assert) {
			var oFakeElement = {
				getMetadata: sandbox.stub().returns({
					getLibraryName: sandbox.stub().returns("dummyLib"),
					getParent: sandbox.stub().returns({
						getLibraryName: sandbox.stub().returns("fakeLibrary")
					})
				})
			};

			var oFakeLibBundle = {
				getText: sandbox.stub().returns("translated text"),
				hasText: sandbox.stub().withArgs("I18N_KEY").returns(true)
			};
			sandbox.stub(Lib, "getResourceBundleFor").withArgs("fakeLibrary").returns(oFakeLibBundle);
			assert.equal(
				this.oDesignTimeMetadata.getLibraryText(oFakeElement, "I18N_KEY"),
				"translated text",
				"then you get the text from the resource bundle of the library from the parent"
			);
		});

		QUnit.test("when ignore is false", function(assert) {
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					ignore: false
				}
			});
			assert.strictEqual(this.oDesignTimeMetadata.isIgnored(), false, "then ignore property is returned right");
		});

		QUnit.test("when ignore is true", function(assert) {
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					ignore: true
				}
			});
			assert.strictEqual(this.oDesignTimeMetadata.isIgnored(), true, "then ignore property is returned right");
		});

		QUnit.test("when ignore is a function returning false", function(assert) {
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					ignore() {return false; }
				}
			});
			assert.strictEqual(this.oDesignTimeMetadata.isIgnored(), false, "then ignore property is returned right");
		});

		QUnit.test("when ignore is a function returning true", function(assert) {
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					ignore() {return true; }
				}
			});
			assert.strictEqual(this.oDesignTimeMetadata.isIgnored(), true, "then ignore property is returned right");
		});

		QUnit.test("when 'getControllerExtensionTemplate' is called with a path specified", function(assert) {
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					controllerExtensionTemplate: "foo"
				}
			});

			assert.equal(this.oDesignTimeMetadata.getControllerExtensionTemplate(), "foo", "the correct path is retrieved");
		});

		QUnit.test("when 'getControllerExtensionTemplate' is called without a path specified", function(assert) {
			assert.equal(this.oDesignTimeMetadata.getControllerExtensionTemplate(), undefined, "the correct path is retrieved");
		});

		QUnit.test("when markedAsNotAdaptable function is called on an action with 'not-adaptable' value", function(assert) {
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: "not-adaptable"
				}
			});
			assert.strictEqual(this.oDesignTimeMetadata.markedAsNotAdaptable(), true, "then the function returns 'true'");
		});

		QUnit.test("when markedAsNotAdaptable function is called on an action with 'null' value", function(assert) {
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: null
				}
			});
			assert.strictEqual(this.oDesignTimeMetadata.markedAsNotAdaptable(), false, "then the function returns 'false'");
		});

		QUnit.test("when markedAsNotAdaptable function is called on an action with with an action-object value", function(assert) {
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						rename: {
							domRef(oElement) {
								return oElement.getDomRef();
							}
						}
					}
				}
			});
			assert.strictEqual(this.oDesignTimeMetadata.markedAsNotAdaptable(), false, "then the function returns 'false'");
		});

		QUnit.test("when getPropagateActions is called", function(assert) {
			this.oPropagateActionObject = { action: "anotherAction", isActive: () => true};
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						add: {
							changeType: "addChangeType"
						},
						anotherAction: {
							changeType: "anotherChangeType"
						}
					},
					propagateActions: ["add", this.oPropagateActionObject]
				}
			});
			assert.deepEqual(
				this.oDesignTimeMetadata.getPropagateActions(),
				["add", this.oPropagateActionObject],
				"then the propagated actions are returned"
			);
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						add: {
							delegate: {
								changeType: "addDelegateChangeType"
							},
							custom: "addCustomChangeType"
						}
					}
				}
			});
			assert.deepEqual(
				this.oDesignTimeMetadata.getPropagateActions(),
				[],
				"then when no actions are defined an empty array is returned"
			);
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						add: {
							changeType: "addChangeType"
						},
						anotherAction: {
							changeType: "anotherChangeType"
						}
					},
					propagateActions: (oElement) => {
						if (oElement === this.oSimpleForm) {
							return ["add"];
						}
						return undefined;
					}
				}
			});
			assert.deepEqual(
				this.oDesignTimeMetadata.getPropagateActions(this.oSimpleForm),
				["add"],
				"then when defined as function the correct action is also returned"
			);
		});

		QUnit.test("when getPropagatedAction is called", function(assert) {
			this.opropagatingControl = {
				name: "propagatingControl"
			};
			this.oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					// Propagated actions are built in runtime from the "propagateActions" property (see MetadataPropagationUtil)
					propagatedActions: [
						{
							name: "propagatedAction1",
							action: "firstChangeType",
							propagatingControl: "propagatingControl",
							propagatingControlName: "propagatingControlName"
						},
						{
							name: "propagatedAction2",
							action: {
								changeType: "secondChangeType"
							},
							propagatingControl: "propagatingControl",
							propagatingControlName: "propagatingControlName"
						},
						{
							name: "propagatedAction3",
							action(oElement) {
								return {
									changeType: oElement.name
								};
							},
							propagatingControl: this.opropagatingControl,
							propagatingControlName: this.opropagatingControl.name
						}
					]
				}
			});

			assert.propEqual(
				this.oDesignTimeMetadata.getPropagatedAction("propagatedAction1"),
				{
					action: {
						changeType: "firstChangeType"
					},
					propagatingControl: "propagatingControl",
					propagatingControlName: "propagatingControlName"
				},
				"...for string action, the correct action is returned"
			);
			assert.propEqual(
				this.oDesignTimeMetadata.getPropagatedAction("propagatedAction2"),
				{
					action: {
						changeType: "secondChangeType"
					},
					propagatingControl: "propagatingControl",
					propagatingControlName: "propagatingControlName"
				},
				"...for object action, the correct action is returned"
			);
			assert.propEqual(
				this.oDesignTimeMetadata.getPropagatedAction("propagatedAction3"),
				{
					action: {
						changeType: "propagatingControl"
					},
					propagatingControl: this.opropagatingControl,
					propagatingControlName: this.opropagatingControl.name
				},
				"...for function action, the correct action is returned"
			);
		});
	});

	QUnit.module("Given a dedicated rendered control and designtime metadata is created", {
		beforeEach() {
			this.oButton = new Button({
				text: "myButton"
			});

			this.oButton.placeAt("qunit-fixture");
			return nextUIUpdate();
		},
		afterEach() {
			this.oButton.destroy();
		}
	}, function() {
		QUnit.test("when getAssociatedDomRef is called on an action with domRef as a function", function(assert) {
			var oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						rename: {
							domRef(oElement) {
								return oElement.getDomRef();
							}
						}
					}
				}
			});

			var vDomRef = oDesignTimeMetadata.getAction("rename", this.oButton).domRef;
			assert.ok(oDesignTimeMetadata.getAssociatedDomRef(this.oButton, vDomRef), "then the domRef of the control is returned");
			assert.strictEqual(
				oDesignTimeMetadata.getAssociatedDomRef(this.oButton, vDomRef),
				this.oButton.getDomRef(),
				"then the value of domRef is correct"
			);
		});

		QUnit.test("when getAssociatedDomRef is called on an action with domRef as a function and no element", function(assert) {
			var oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						rename: {
							domRef(oElement) {
								return oElement.getDomRef();
							}
						}
					}
				}
			});

			var vDomRef = oDesignTimeMetadata.getAction("rename", this.oButton).domRef;
			assert.notOk(oDesignTimeMetadata.getAssociatedDomRef(undefined, vDomRef), "then undefined is returned");
		});

		QUnit.test("when getAssociatedDomRef is called on an action with domRef as a function throwing an error", function(assert) {
			var oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						rename: {
							domRef() {
								throw new Error("Something wrong");
							}
						}
					}
				}
			});

			var vDomRef = oDesignTimeMetadata.getAction("rename", this.oButton).domRef;
			assert.strictEqual(
				oDesignTimeMetadata.getAssociatedDomRef(this.oButton, vDomRef),
				undefined,
				"then the error is silently caught and undefined is returned"
			);
		});

		QUnit.test("when getAssociatedDomRef is called on an action with domRef as a string", function(assert) {
			var oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						rename: {
							domRef: ".sapMBtnContent"
						}
					}
				}
			});

			var vDomRef = oDesignTimeMetadata.getAction("rename", this.oButton).domRef;
			assert.ok(oDesignTimeMetadata.getAssociatedDomRef(this.oButton, vDomRef), "then the domRef of the control is returned");
			assert.strictEqual(
				oDesignTimeMetadata.getAssociatedDomRef(this.oButton, vDomRef).textContent,
				"myButton",
				"then the text of the button is correct"
			);
		});

		QUnit.test("when getAssociatedDomRef is called on an action with domRef as undefined", function(assert) {
			var oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						rename: {
							domRef: undefined
						}
					}
				}
			});

			var vDomRef = oDesignTimeMetadata.getAction("rename", this.oButton).domRef;
			assert.strictEqual(
				oDesignTimeMetadata.getAssociatedDomRef(this.oButton, vDomRef),
				undefined,
				"then the domRef of the control is undefined "
			);
		});

		QUnit.test("when getAssociatedDomRef is called on an action with no domRef at all", function(assert) {
			var oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						rename: {
						}
					}
				}
			});

			var vDomRef = oDesignTimeMetadata.getAction("rename", this.oButton).domRef;
			assert.strictEqual(
				oDesignTimeMetadata.getAssociatedDomRef(this.oButton, vDomRef),
				undefined,
				"then the domRef of the control is undefined "
			);
		});

		QUnit.test("when getAssociatedDomRef is called on an action with an invalid/not available selector", function(assert) {
			var oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						rename: {
							domRef: ""
						}
					}
				}
			});

			var vDomRef = oDesignTimeMetadata.getAction("rename", this.oButton).domRef;
			assert.strictEqual(
				oDesignTimeMetadata.getAssociatedDomRef(this.oButton, vDomRef),
				undefined,
				"then the domRef of the control is undefined "
			);
		});
	});

	QUnit.module("Given a dedicated rendered control and an AggregationDesignTimeMetadata is created for a control", {
		beforeEach() {
			this.oTitle0 = new Title({id: "Title0", text: "Title 0"});
			this.oLabel0 = new Label({id: "Label0", text: "Label 0"});
			this.oInput0 = new Input({id: "Input0"});

			this.oSimpleForm = new SimpleForm("form", {
				id: "SimpleForm",
				layout: "ResponsiveGridLayout",
				title: "Simple Form",
				content: [this.oTitle0, this.oLabel0, this.oInput0]
			});

			this.oSimpleForm.placeAt("qunit-fixture");
			return nextUIUpdate();
		},
		afterEach() {
			this.oSimpleForm.destroy();
		}
	}, function() {
		QUnit.test("when getAssociatedDomRef is called on an action with domRef as a function returning the actual domRef", function(assert) {
			var oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						rename() {
							return {
								domRef(oElement) {
									return oElement.getDomRef();
								}
							};
						}
					}
				}
			});

			var vDomRef = oDesignTimeMetadata.getAction("rename", this.oSimpleForm).domRef;
			var oAssociatedDomRef = oDesignTimeMetadata.getAssociatedDomRef(this.oSimpleForm, vDomRef);
			assert.ok(oAssociatedDomRef, "then the domRef of the control is returned");
			assert.strictEqual(oAssociatedDomRef, this.oSimpleForm.getDomRef(), "then the domRef is correct");
		});

		QUnit.test("when getAssociatedDomRef is called on an action with domRef as a function returning ':sap-domRef'", function(assert) {
			var oDesignTimeMetadata = new DesignTimeMetadata({
				data: {
					actions: {
						rename() {
							return {
								domRef: ":sap-domref"
							};
						}
					}
				}
			});

			var vDomRef = oDesignTimeMetadata.getAction("rename", this.oButton).domRef;
			var oAssociatedDomRef = oDesignTimeMetadata.getAssociatedDomRef(this.oSimpleForm, vDomRef);
			assert.ok(oAssociatedDomRef, "then the domRef of the content is returned");
			assert.strictEqual(oAssociatedDomRef, this.oSimpleForm.getDomRef(), "then the domRef is correct");
		});
	});

	QUnit.module("Given responsible element is requested", {
		beforeEach() {
			this.oDesignTimeMetadataWithResponsibleElement = new DesignTimeMetadata({
				data: {
					actions: {
						getResponsibleElement(oElement) {
							return oElement;
						},
						actionsFromResponsibleElement: ["dummyActionEnabled"]
					}
				}
			});

			this.oDesignTimeMetadataWithoutResponsibleElement = new DesignTimeMetadata({
				data: {
					actions: {}
				}
			});

			this.oDesignTimeMetadataWithoutActions = new DesignTimeMetadata({
				data: {}
			});
		}
	}, function() {
		QUnit.test("then getResponsibleElement is called", function(assert) {
			var oResponsibleElement = {type: "responsibleElement"};
			assert.deepEqual(
				this.oDesignTimeMetadataWithResponsibleElement.getResponsibleElement(oResponsibleElement),
				oResponsibleElement,
				"then the resposible element was returned correctly"
			);
			assert.equal(this.oDesignTimeMetadataWithoutResponsibleElement.getResponsibleElement(oResponsibleElement), undefined);
			assert.equal(this.oDesignTimeMetadataWithoutActions.getResponsibleElement(oResponsibleElement), undefined);
		});

		QUnit.test("when isResponsibleActionAvailable() is called for designTimeMetadata with no actions", function(assert) {
			this.fnGetData = function() {
				return {};
			};
			assert.strictEqual(
				this.oDesignTimeMetadataWithoutActions.isResponsibleActionAvailable("dummyActionEnabled"),
				false,
				"then false is returned"
			);
		});

		QUnit.test("when isResponsibleActionAvailable() is called for designTimeMetadata with enabled action", function(assert) {
			assert.strictEqual(
				this.oDesignTimeMetadataWithResponsibleElement.isResponsibleActionAvailable("dummyActionDisabled"),
				false,
				"then false is returned for a non enabled action"
			);
			assert.strictEqual(
				this.oDesignTimeMetadataWithResponsibleElement.isResponsibleActionAvailable("dummyActionEnabled"),
				true,
				"then true is returned for an enabled action"
			);
		});
	});

	QUnit.done(function() {
		document.getElementById("qunit-fixture").style.display = "none";
	});
});