/*global QUnit*/

sap.ui.define([
	"sap/ui/demo/cart/model/models",
	"sap/ui/Device"
], (models, Device) => {
	"use strict";

	QUnit.module("createDeviceModel", {
		afterEach() {
			this.oDeviceModel.destroy();
		}
	});

	function isPhoneTestCase(assert, bIsPhone) {
		// Arrange
		this.stub(Device, "system").value({ phone : bIsPhone });

		// System under test
		this.oDeviceModel = models.createDeviceModel();

		// Assert
		assert.strictEqual(this.oDeviceModel.getProperty("/system/phone"), bIsPhone, "IsPhone property is correct");
	}

	QUnit.test("Should initialize a device model for desktop", function (assert) {
		isPhoneTestCase.call(this, assert, false);
	});

	QUnit.test("Should initialize a device model for phone", function (assert) {
		isPhoneTestCase.call(this, assert, true);
	});

	function isTouchTestCase(assert, bIsTouch) {
		// Arrange
		this.stub(Device, "support").value({ touch : bIsTouch });

		// System under test
		this.oDeviceModel = models.createDeviceModel();

		// Assert
		assert.strictEqual(this.oDeviceModel.getProperty("/support/touch"), bIsTouch, "IsTouch property is correct");
	}

	QUnit.test("Should initialize a device model for non touch devices", function (assert) {
		isTouchTestCase.call(this, assert, false);
	});

	QUnit.test("Should initialize a device model for touch devices", function (assert) {
		isTouchTestCase.call(this, assert, true);
	});

	QUnit.test("The binding mode of the device model should be one way", function (assert) {
		// System under test
		this.oDeviceModel = models.createDeviceModel();

		// Assert
		assert.strictEqual(this.oDeviceModel.getDefaultBindingMode(), "OneWay", "Binding mode is correct");
	});
});