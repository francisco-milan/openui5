/* global QUnit, sinon */

/*eslint max-nested-callbacks: [2, 10]*/

sap.ui.define([
	"sap/ui/core/Element",
	"sap/ui/mdc/library",
	"sap/ui/mdc/MultiValueField",
	"sap/ui/mdc/ValueHelp",
	"sap/ui/mdc/ValueHelpDelegate",
	"sap/ui/mdc/condition/Condition",
	"sap/ui/mdc/enums/FieldEditMode",
	"sap/ui/mdc/enums/FieldDisplay",
	"sap/ui/mdc/enums/ConditionValidated",
	"sap/ui/mdc/enums/OperatorName",
	"sap/ui/mdc/field/ConditionsType",
	// async. loading of content control tested in FieldBase test
	"sap/ui/mdc/field/FieldMultiInput",
	// make sure delegate is loaded (test delegate loading in FieldBase test)
	"sap/ui/mdc/field/MultiValueFieldDelegate",
	"sap/ui/mdc/field/MultiValueFieldItem",
	"sap/ui/mdc/field/TokenizerDisplay",
	"sap/ui/mdc/field/TokenDisplay",
	"sap/m/Label",
	"sap/m/Text",
	"sap/m/ExpandableText",
	"sap/m/TextArea",
	"sap/m/DatePicker",
	"sap/m/TimePicker",
	"sap/m/DateTimePicker",
	"sap/m/Slider",
	"sap/m/Button",
	"sap/ui/model/ParseException",
	"sap/ui/model/type/String",
	"sap/ui/model/type/Integer",
	"sap/ui/model/type/Currency",
	"sap/ui/model/odata/type/Currency",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/type/DateTime",
	"sap/ui/events/KeyCodes",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/dom/containsOrEquals"
], (
	Element,
	library,
	MultiValueField,
	ValueHelp,
	ValueHelpDelegate,
	Condition,
	FieldEditMode,
	FieldDisplay,
	ConditionValidated,
	OperatorName,
	ConditionsType,
	FieldMultiInput,
	MultiValueFieldDelegate,
	MultiValueFieldItem,
	TokenizerDisplay,
	TokenDisplay,
	Label,
	Text,
	ExpandableText,
	TextArea,
	DatePicker,
	TimePicker,
	DateTimePicker,
	Slider,
	Button,
	ParseException,
	StringType,
	IntegerType,
	CurrencyType,
	oDataCurrencyType,
	JSONModel,
	DateTimeType,
	KeyCodes,
	nextUIUpdate,
	qutils,
	containsOrEquals
) => {
	"use strict";

	let oField;
	let sId;
	let aChangeItems;
	let bValid;
	let iCount = 0;
	let oPromise;

	const _myChangeHandler = (oEvent) => {
		iCount++;
		sId = oEvent.oSource.getId();
		aChangeItems = oEvent.getParameter("items");
		bValid = oEvent.getParameter("valid");
		oPromise = oEvent.getParameter("promise");
	};

//	var sLiveId;
//	var sLiveValue;
//	var iLiveCount = 0;
//
//	var _myLiveChangeHandler = (oEvent) => {
//		iLiveCount++;
//		sLiveId = oEvent.oSource.getId();
//		sLiveValue = oEvent.getParameter("value");
//	};
//
//	var iParseError = 0;
//	var _myParseErrorHandler = (oEvent) => {
//		iParseError++;
//	};
//
//	var _checkException = (assert, oField, fnFunction, sName, vArgument) => {
//
//		var oException;
//
//		try {
//			fnFunction.call(oField, vArgument);
//		} catch (e) {
//			oException = e;
//		}
//
//		assert.ok(oException, sName + " fires exception");
//
//	};

	const _cleanupEvents = () => {
		iCount = 0;
		sId = null;
		aChangeItems = null;
		bValid = null;
		oPromise = null;
//		iLiveCount = 0;
//		sLiveId = null;
//		sLiveValue = null;
//		iParseError = 0;
	};

	QUnit.module("Field rendering", {
		beforeEach() {
			oField = new MultiValueField("F1");
		},
		afterEach() {
			oField.destroy();
			oField = undefined;
			_cleanupEvents();
		}
	});

	QUnit.test("default rendering", async (assert) => {

		oField.placeAt("content");
		await nextUIUpdate();

		const aContent = oField.getAggregation("_content");
		const oContent = aContent?.length > 0 && aContent[0];
		assert.ok(oContent, "default content exist");
		assert.equal(oContent?.getMetadata().getName(), "sap.ui.mdc.field.FieldMultiInput", "sap.ui.mdc.field.FieldMultiInput is default");
		assert.notOk(oContent?.getShowValueHelp(), "no valueHelp");

	});

	QUnit.test("FieldEditMode", async (assert) => {

		oField.setEditMode(FieldEditMode.Display);
		oField.placeAt("content");
		await nextUIUpdate();

		let aContent = oField.getAggregation("_content");
		let oContent = aContent?.length > 0 && aContent[0];
		assert.ok(oContent, "content exist");
		assert.equal(oContent.getMetadata().getName(), "sap.ui.mdc.field.TokenizerDisplay", "sap.ui.mdc.field.TokenizerDisplay is used");

		oField.setEditMode(FieldEditMode.ReadOnly);
		await nextUIUpdate();
		aContent = oField.getAggregation("_content");
		oContent = aContent?.length > 0 && aContent[0];
		assert.ok(oContent, "content exist");
		assert.equal(oContent.getMetadata().getName(), "sap.ui.mdc.field.FieldMultiInput", "sap.ui.mdc.field.FieldMultiInput is used");
		assert.notOk(oContent.getEditable(), "MultiInput is not editable");

	});

	QUnit.test("internal control creation", (assert) => {

		const fnDone = assert.async();
		setTimeout(() => { // async control creation in applySettings
			const aContent = oField.getAggregation("_content");
			const oContent = aContent?.length > 0 && aContent[0];
			assert.notOk(oContent, "no content exist before rendering"); // as no data type can be determined
			fnDone();
		}, 0);

	});

	QUnit.module("API", {
		beforeEach() {
			oField = new MultiValueField("F1");
		},
		afterEach() {
			oField.destroy();
			oField = undefined;
			_cleanupEvents();
		}
	});

	QUnit.test("setMaxConditions", (assert) => {

		oField.setMaxConditions(5);
		assert.equal(oField.getMaxConditions(), 5, "maxConditions set");

		try {
			oField.setMaxConditions(1);
		} catch (oError) {
			assert.equal(oError?.message, "Multiple Conditions needed on MultiValueField " + oField, "Error fired");
			assert.equal(oField.getMaxConditions(), 5, "maxConditions nou updated");
		}

	});

	let oFieldEdit, oFieldDisplay;
	let oModel;
	let oType;
	let oDescriptionType;
	let oItemTemplate;

	const _initModel = () => {
		oModel = new JSONModel({
			items: [{ key: 1, description: "Text 1" },
					{ key: 2, description: "Text 2" },
					{ key: 3, description: "Text 3" }
					]
		});

		oType = new IntegerType();
		oType._bMyType = true;
		oDescriptionType = new StringType();
		oDescriptionType._bMyType = true;

		oItemTemplate = new MultiValueFieldItem("MFI1", {
			key: {path: "key", type: oType},
			description: {path: "description", type: oDescriptionType}
		});
	};

	const _cleanupModel = () => {
		oModel.destroy();
		oItemTemplate.destroy();
		oType.destroy();
		oModel = undefined;
		oItemTemplate = undefined;
		oType = undefined;
		oDescriptionType = undefined;
	};

	QUnit.module("Items", {
		beforeEach: async () => {
			_initModel();
			oFieldEdit = new MultiValueField("F1", {
				editMode: FieldEditMode.Editable,
				display: FieldDisplay.Description,
				items: {path: "/items", template: oItemTemplate}
				}).setModel(oModel);
			oFieldDisplay = new MultiValueField("F2", {
				editMode: FieldEditMode.Display,
				display: FieldDisplay.Description,
				items: {path: "/items", template: oItemTemplate}
				}).setModel(oModel);
			oFieldEdit.placeAt("content");
			oFieldDisplay.placeAt("content");
			sinon.spy(MultiValueFieldDelegate, "createCondition");
			await nextUIUpdate();
		},
		afterEach() {
			MultiValueFieldDelegate.createCondition.restore();
			oFieldEdit.destroy();
			oFieldDisplay.destroy();
			oFieldEdit = undefined;
			oFieldDisplay = undefined;
			_cleanupModel();
			_cleanupEvents();
		}
	});

	QUnit.test("used data type", (assert) => {

		let oType = oFieldEdit._oContentFactory.getDataType();
		assert.ok(oType.isA("sap.ui.model.type.Integer"), "used data type for Field");
		assert.ok(oType._bMyType, "Given Type is used in Field");

		oType = oFieldEdit._oContentFactory.getAdditionalDataType();
		assert.ok(oType.isA("sap.ui.model.type.String"), "used additional data type for Field");
		assert.ok(oType._bMyType, "Given additional Type is used in Field");

		// fake data type change
		oFieldEdit._oContentFactory.setDataType();
		oFieldEdit.initDataType();
		oType = oFieldEdit._oContentFactory.getDataType();
		assert.ok(oType.isA("sap.ui.model.type.Integer"), "used data type for Field");
		assert.ok(oType._bMyType, "Given Type is used in Field");

	});

	QUnit.test("conditions & Tokens", (assert) => {

		assert.equal(MultiValueFieldDelegate.createCondition.callCount, 6, "Conditions created via delegate");

		const aConditions = oFieldEdit.getConditions();
		assert.ok(aConditions.length, 3, "Conditions created");
		assert.equal(aConditions[0].operator, OperatorName.EQ, "Condition0 operator");
		assert.equal(aConditions[0].values[0], 1, "Condition0 value0");
		assert.equal(aConditions[0].values[1], "Text 1", "Condition0 value1");
		assert.equal(aConditions[0].validated, ConditionValidated.Validated, "Condition0 validated");

		let aContent = oFieldEdit.getAggregation("_content");
		let oContent = aContent?.length > 0 && aContent[0];
		let aTokens = oContent.getTokens();
		assert.ok(aTokens.length, 3, "Tokens created");
		assert.equal(aTokens[0].getText(), "Text 1", "Token0 text");
		assert.equal(aTokens[1].getText(), "Text 2", "Token1 text");
		assert.equal(aTokens[2].getText(), "Text 3", "Token2 text");

		aContent = oFieldDisplay.getAggregation("_content");
		oContent = aContent?.length > 0 && aContent[0];
		aTokens = oContent.getTokens();
		assert.ok(aTokens.length, 3, "Tokens created");
		assert.equal(aTokens[0].getText(), "Text 1", "Token0 text");
		assert.equal(aTokens[1].getText(), "Text 2", "Token1 text");
		assert.equal(aTokens[2].getText(), "Text 3", "Token2 text");

	});

	QUnit.module("user interaction", {
		beforeEach: async () => {
			_initModel();
			sinon.stub(MultiValueFieldDelegate, "updateItems").callsFake((oPayload, aConditions, oMultiValueField) => {
				const aItems = [];
				for (let i = 0; i < aConditions.length; i++) {
					const oCondition = aConditions[i];
					const oItem = {key: oCondition.values[0], description: oCondition.values[1]};
					aItems.push(oItem);
				}
				oModel.setProperty("/items", aItems);
				oModel.checkUpdate(true, false);
			});
			const oValueHelp = new ValueHelp("F1-H");
			oField = new MultiValueField("F1", {
				editMode: FieldEditMode.Editable,
				display: FieldDisplay.Description,
				items: {path: "/items", template: oItemTemplate},
				valueHelp: oValueHelp,
				dependents: [oValueHelp],
				change: _myChangeHandler//,
//				liveChange: _myLiveChangeHandler,
//				parseError: _myParseErrorHandler
			}).setModel(oModel).placeAt("content");
			await nextUIUpdate();
			oField.focus(); // as ValueHelp is connected with focus
		},
		afterEach() {
			oField.destroy();
			oField = undefined;
			_cleanupModel();
			_cleanupEvents();
			MultiValueFieldDelegate.updateItems.restore();
		}
	});

	QUnit.test("update via ValueHelp", (assert) => {

		const fnDone = assert.async();
		const oValueHelp = Element.getElementById(oField.getValueHelp());
		const oCondition = Condition.createItemCondition(4, "Text 4");
		oValueHelp.fireSelect({ conditions: [oCondition], add: false, close: true });

		setTimeout(() => { // async model update
			assert.ok(MultiValueFieldDelegate.updateItems.calledOnce, "MultiValueFieldDelegate.updateItems called once");
			assert.ok(MultiValueFieldDelegate.updateItems.calledWith({}, [oCondition], oField), "MultiValueFieldDelegate.updateItems arguments");
			assert.equal(iCount, 1, "Change event fired once");
			assert.equal(sId, "F1", "Change event fired on Field");
			assert.equal(aChangeItems.length, 1, "Change event: items");
			assert.equal(aChangeItems[0].getKey(), 4, "Change event: item key");
			assert.equal(aChangeItems[0].getDescription(), "Text 4", "Change event: item key");
			assert.ok(oPromise, "Promise returned");
			assert.ok(bValid, "Change event: valid");
			oPromise.then((vResult) => {
				assert.ok(true, "Promise resolved");
				assert.ok(Array.isArray(vResult), "Result is array");
				assert.ok(vResult.length, 1, "One item returned");
				assert.ok(vResult[0].isA("sap.ui.mdc.field.MultiValueFieldItem"), "MultiItem returned");
				assert.equal(vResult[0].getKey(), 4, "Result: item key");
				assert.equal(vResult[0].getDescription(), "Text 4", "Result: item key");

				const aItems = oField.getItems();
				assert.equal(aItems.length, 1, "Field: items");
				assert.equal(aItems[0].getKey(), 4, "Field: item key");
				assert.equal(aItems[0].getDescription(), "Text 4", "Field: item key");

			fnDone();
			});
		}, 0);

	});

	QUnit.test("internal control creation", (assert) => {

		let oField = new MultiValueField("F3", {
			items: {path: "/items", template: oItemTemplate}
		});

		const fnDone = assert.async();
		let aContent = oField.getAggregation("_content");
		let oContent = aContent?.length > 0 && aContent[0];
		assert.notOk(oContent, "no content exist before rendering"); // as edit mode is not explicit defined

		oField.setEditMode(FieldEditMode.Display);
		setTimeout(() => { // async control creation in observeChanges
			aContent = oField.getAggregation("_content");
			oContent = aContent?.length > 0 && aContent[0];
			assert.ok(oContent, "content exist after setting editMode and multipleLines");

			oField.destroy();
			oField = new MultiValueField("F3", {
				items: {path: "/items", template: oItemTemplate},
				editMode: FieldEditMode.Editable
			});

			setTimeout(() => { // async control creation in applySettings
				aContent = oField.getAggregation("_content");
				oContent = aContent?.length > 0 && aContent[0];
				assert.ok(oContent, "content exist before rendering");

				oField.destroy();
				oField = new MultiValueField("F3", {
					items: {path: "/items", template: oItemTemplate},
					editMode: { path: "/editMode"}
				});

				setTimeout(() => { // async control creation in applySettings
					aContent = oField.getAggregation("_content");
					oContent = aContent?.length > 0 && aContent[0];
					assert.notOk(oContent, "content not exist before rendering"); // as editMode has not set by binding right now

					oField.destroy();
					oField = new MultiValueField("F3", {
						items: {path: "/items", template: oItemTemplate},
						editMode: { path: "/editMode"}
					});
					oField.setModel(oModel);

					setTimeout(() => { // async control creation in applySettings
						aContent = oField.getAggregation("_content");
						oContent = aContent?.length > 0 && aContent[0];
						assert.ok(oContent, "content exist before rendering");
						oField.destroy();
						fnDone();
					}, 0);
				}, 0);
			}, 0);
		}, 0);

	});

	let oButton;
	QUnit.module("user interaction - display mode", {
		beforeEach: async () => {
			_initModel();
			oFieldDisplay = new MultiValueField("F2", {
				width: "500px",
				editMode: FieldEditMode.Display,
				display: FieldDisplay.Description,
				items: {path: "/items", template: oItemTemplate}
				}).setModel(oModel);
			oFieldDisplay.placeAt("content");

			oButton = new Button("B1", {text: "test"}).placeAt("content");
			await nextUIUpdate();
		},
		afterEach() {
			oFieldDisplay.destroy();
			oFieldDisplay = undefined;
			oButton.destroy();
			oButton = undefined;
			_cleanupModel();
			_cleanupEvents();
		}
	});

	QUnit.test("focus handling", async (assert) => {

		const aContent = oFieldDisplay.getAggregation("_content");
		const oContent = aContent?.length > 0 && aContent[0];

		assert.ok(oContent._oIndicator.hasClass("sapUiHidden"), "More indicator hidden");

		oFieldDisplay.focus();
		assert.notOk(containsOrEquals(oFieldDisplay.getDomRef(), document.activeElement), "no focus in Field");

		oFieldDisplay.setWidth("100px");
		await nextUIUpdate();

		assert.notOk(oContent._oIndicator.hasClass("sapUiHidden"), "More indicator shown");
		oFieldDisplay.focus();
		assert.equal(document.activeElement, oContent._oIndicator[0], "focus on more-indicator");

		sinon.spy(oContent, "_togglePopup");
		qutils.triggerEvent("click", oContent._oIndicator[0]);
		assert.ok(oContent._togglePopup.calledOnce, "Popup open triggered");
		await nextUIUpdate();

		const fnDone = assert.async();
		setTimeout(() => { // to wait until popover shown
			const oTokenList = oContent._getTokensList();
			const aTokenListItems = oTokenList.getItems();
			assert.ok(containsOrEquals(aTokenListItems[0].getDomRef(), document.activeElement), "focus on first item");

			oContent._togglePopup.reset();
			qutils.triggerKeydown(aTokenListItems[0].getId(), KeyCodes.ESCAPE, false, false, false);
			assert.ok(oContent._togglePopup.calledOnce, "Popup close triggered");

			setTimeout(async () => { // to wait until popover closed
				assert.equal(document.activeElement, oContent._oIndicator[0], "focus on more-indicator");

				qutils.triggerEvent("click", oContent._oIndicator[0]);
				await nextUIUpdate();

				setTimeout(() => { // to wait until popover shown
					oButton.focus();

					setTimeout(() => { // to wait until popover closed
						assert.equal(document.activeElement, oButton.getFocusDomRef(), "focus on Button");
						fnDone();
					}, 300);
				}, 300);
			}, 300);
		}, 300);

	});

});
