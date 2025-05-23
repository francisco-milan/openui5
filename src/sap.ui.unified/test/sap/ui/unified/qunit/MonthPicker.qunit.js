
/*global QUnit, sinon */

sap.ui.define([
	"sap/ui/core/Lib",
	"sap/ui/qunit/utils/nextUIUpdate",
	"sap/ui/unified/calendar/MonthPicker",
	"sap/ui/unified/DateRange",
	"sap/ui/unified/calendar/CalendarDate",
	"sap/ui/Device",
	"sap/ui/events/KeyCodes",
	"sap/ui/thirdparty/jquery",
	"sap/ui/core/date/UI5Date"
], function(Library, nextUIUpdate, MonthPicker, DateRange, CalendarDate, Device, KeyCodes, jQuery, UI5Date) {
	"use strict";
	(function () {

		QUnit.module("Corner cases", {
			beforeEach: async function () {
				this.oMP = new MonthPicker();
				this.oMP.placeAt("qunit-fixture");
				await nextUIUpdate();
			},
			afterEach: function () {
				this.oMP.destroy();
				this.oMP = null;
			}
		});

		QUnit.test("onThemeChanged is called before the control is rendered", function (oAssert) {
			var bThrown = false;
			try {
				this.oMP.onThemeChanged();
			} catch (oError) {
				bThrown = true;
			}
			oAssert.ok(!bThrown, "No error should be thrown");
		});

		QUnit.test("_isValueInThreshold return true if provided value is in provided threshold", function (assert) {
			assert.ok(this.oMP._isValueInThreshold(248, 258, 10), "value is between 238 and 258 - upper boundary"); // (reference value, actual value, threshold)
			assert.ok(this.oMP._isValueInThreshold(248, 238, 10), "value is between 238 and 258 - lower boundary"); // (reference value, actual value, threshold)
			assert.ok(this.oMP._isValueInThreshold(248, 240, 10), "value is between 238 and 258"); // (reference value, actual value, threshold)
			assert.ok(this.oMP._isValueInThreshold(248, 250, 10), "value is between 238 and 258"); // (reference value, actual value, threshold)
		});

		QUnit.test("_isValueInThreshold return false if provided value is out of provided threshold", function (assert) {
			assert.equal(this.oMP._isValueInThreshold(248, 237, 10), false, "value is lower"); // (reference value, actual value, threshold)
			assert.equal(this.oMP._isValueInThreshold(248, 259, 10), false, "value is upper"); // (reference value, actual value, threshold)
		});

		QUnit.test("Months are properly selected on touch devices mouseup", function (assert) {
			var iSelectedMonth = 3,
				oMousePosition = { clientX: 10, clientY: 10 },
				deviceStub = this.stub(Device.support, "touch").value(true),
				isValueInThresholdStub = this.stub(this.oMP, "_isValueInThreshold").returns(true),
				itemNavigationStub = this.stub(this.oMP._oItemNavigation, "getFocusedIndex").returns(iSelectedMonth),
				selectSpy = this.spy(function () {});

			this.oMP.attachSelect(selectSpy);

			assert.equal(this.oMP.getMonth(), 0, "0 month is initially selected");

			this.oMP._oMousedownPosition = oMousePosition;
			this.oMP.onmouseup(oMousePosition);

			assert.equal(this.oMP.getMonth(), iSelectedMonth, "3 month is selected on mouseup");
			assert.equal(selectSpy.callCount, 1, "select event is fired once");

			deviceStub.restore();
			isValueInThresholdStub.restore();
			itemNavigationStub.restore();
		});

		QUnit.test("fires pageChange on pageup/pagedown", function(assert) {
			// arrange
			var oFirePageChangeSpy = this.spy(this.oMP, "firePageChange");

			// act
			this.oMP._oItemNavigation.fireEvent("BorderReached", { event: { type: "sappagedown" } });

			// assert
			assert.equal(oFirePageChangeSpy.callCount, 1, "pageChange is fired once");
			assert.ok(oFirePageChangeSpy.calledWith(sinon.match({ offset: 1 })), "pageChange is fired with the correct arguments");

			// arrange
			oFirePageChangeSpy.resetHistory();

			// act
			this.oMP._oItemNavigation.fireEvent("BorderReached", { event: { type: "sappageup" } });

			// assert
			assert.equal(oFirePageChangeSpy.callCount, 1, "pageChange is fired once");
			assert.ok(oFirePageChangeSpy.calledWith(sinon.match({ offset: -1 })), "pageChange is fired with the correct arguments");
		});

		QUnit.test("fires pageChange on border reached with arrow up/down", function(assert) {
			// arrange
			var oFirePageChangeSpy = this.spy(this.oMP, "firePageChange");

			// act
			this.oMP._oItemNavigation.fireEvent("BorderReached", {
				event: {
						type: "sapprevious",
						keyCode: KeyCodes.ARROW_UP
					}
				});

			// assert
			assert.equal(oFirePageChangeSpy.callCount, 1, "pageChange is fired once");
			assert.ok(oFirePageChangeSpy.calledWith(sinon.match({ offset: -1 })), "pageChange is fired with the correct arguments");

			// arrange
			oFirePageChangeSpy.resetHistory();

			// act
			this.oMP._oItemNavigation.fireEvent("BorderReached", {
				event: {
						type: "sapnext",
						keyCode: KeyCodes.ARROW_DOWN
					}
				});

			// assert
			assert.equal(oFirePageChangeSpy.callCount, 1, "pageChange is fired once");
			assert.ok(oFirePageChangeSpy.calledWith(sinon.match({ offset: 1 })), "pageChange is fired with the correct arguments");
		});

		QUnit.test("fires pageChange on border reached with arrow right/left", function(assert) {
			// arrange
			var oFirePageChangeSpy = this.spy(this.oMP, "firePageChange");

			// act
			this.oMP._oItemNavigation.fireEvent("BorderReached", {
				event: {
						type: "sapprevious",
						keyCode: KeyCodes.ARROW_RIGHT
					}
				});

			// assert
			assert.equal(oFirePageChangeSpy.callCount, 1, "pageChange is fired once");
			assert.ok(oFirePageChangeSpy.calledWith(sinon.match({ offset: -1 })), "pageChange is fired with the correct arguments");

			// arrange
			oFirePageChangeSpy.resetHistory();

			// act
			this.oMP._oItemNavigation.fireEvent("BorderReached", {
				event: {
						type: "sapnext",
						keyCode: KeyCodes.ARROW_LEFT
					}
				});

			// assert
			assert.equal(oFirePageChangeSpy.callCount, 1, "pageChange is fired once");
			assert.ok(oFirePageChangeSpy.calledWith(sinon.match({ offset: 1 })), "pageChange is fired with the correct arguments");
		});

		QUnit.module("API", {
			beforeEach: function() {
				this.MP = new MonthPicker();
			},
			afterEach: function() {
				this.MP.destroy();
				this.MP = null;
			}
		});

		QUnit.test("setMonth", async function(assert) {
			// Prepare
			var oGridItemRefs,
				iFocusedIndex;

			this.MP.placeAt("qunit-fixture");
			await nextUIUpdate();
			oGridItemRefs = this.MP._oItemNavigation.getItemDomRefs();

			// Act
			this.MP.setMonth(5);
			await nextUIUpdate();
			iFocusedIndex = this.MP._oItemNavigation.getFocusedIndex();

			// Assert
			assert.equal(this.MP.getSelectedDates()[0].getStartDate().getMonth(), 5, "There is a selected date");
			assert.ok(oGridItemRefs[iFocusedIndex].classList.contains("sapUiCalItemSel"));

			// Prepare
			this.MP.setMonths(5);

			// Act
			this.MP.setMonth(11);

			// Assert
			assert.equal(this.MP.getProperty("_firstMonth"), 7, "Correct shift of the last months in the year when" +
				"displayed months number is not multiple of 12");

		});

		QUnit.test("setMonth with interval selection", function(assert) {
			// Prepare
			this.MP.setIntervalSelection(true);

			// Act
			this.MP.setMonth(5);

			// Assert
			assert.notOk(this.MP.getSelectedDates(), "There are no selected dates after setMonth");

		});

		QUnit.module("interval selection", {
			beforeEach: function() {
				this.MP = new MonthPicker({
					intervalSelection: true
				});
			},
			afterEach: function() {
				this.MP.destroy();
				this.MP = null;
			}
		});

		QUnit.test("selectedDates initially", function(assert) {
			// Assert
			assert.notOk(this.MP.getSelectedDates(), "There are no selected dates initially");
		});

		QUnit.test("_setSelectedDatesControlOrigin", function(assert) {
			// arrange
			var oDates,
				oSelectedDatesProvider = {
					getSelectedDates: function() {
						return "mocked_dates";
					}
				};

			// act
			this.MP._setSelectedDatesControlOrigin(oSelectedDatesProvider);
			oDates = this.MP.getSelectedDates();

			// assert
			assert.equal(oDates, "mocked_dates", "selected dates are taken from the provider");
			assert.equal(this.MP._getSelectedDates(), "mocked_dates", "_getSelectedDates returns the selected date from the provider");
		});

		QUnit.test("_getSelectedDates", function(assert) {
			// act
			var aSelectedDates = this.MP._getSelectedDates();

			// assert
			assert.ok(aSelectedDates[0], "sap.m.DateRange intance is created");
			assert.strictEqual(aSelectedDates[0].getStartDate().getMonth(), this.MP.getMonth(),
				"sap.m.DateRange isntace start date has the same month as the 'month' property value");
			assert.notOk(aSelectedDates[0].getEndDate(), "sap.m.DateRange has no endDate set");
		});

		QUnit.test("_setYear", function(assert) {
			// act
			this.MP._setYear(2019);

			// assert
			assert.equal(this.MP._iYear, 2019, "Year is correctly set to the MonthPicker instance");
		});

		QUnit.test("_selectMonth", async function(assert) {
			// arrange
			var oFakeMousedownEvent = {
					button: false,
					preventDefault: function() {},
					setMark: function() {}
				},
				oFakeMouseupEvent = {
					target: jQuery("<div></div>").attr({
						"id": this.MP.getId() + "-m8",
						"class": "sapUiCalItem"
					}).get(0),
					classList: {
						contains: function() {
							return true;
						}
					}
				},
				oSelectedDates = this.MP._getSelectedDates(),
				// In Microsoft Edge sap.ui.Device.support.touch is "true" on some desktopes
				// and we are making sure that MonthPicker.prototype._handleMouseDown will work
				oDeviceStub = this.stub(Device.support, "touch").value(false),
				aRefs;

			this.MP.placeAt("qunit-fixture");
			await nextUIUpdate();
			aRefs = this.MP.$().find(".sapUiCalItem");

			// act
			this.MP._selectMonth(0);
			this.MP._handleMousedown(oFakeMousedownEvent, 6);
			await nextUIUpdate();

			// assert
			assert.strictEqual(oSelectedDates[0].getStartDate().getMonth(), 6, "July is selected start month");

			// act
			this.MP.onmouseup(oFakeMouseupEvent);
			await nextUIUpdate();

			// assert
			assert.strictEqual(oSelectedDates[0].getEndDate().getMonth(), 8, "September is selected end month");
			assert.ok(aRefs.eq(6).hasClass("sapUiCalItemSel"), "is marked correctly with selected class");
			assert.strictEqual(aRefs.eq(6).attr("aria-selected"), "true", "aria selected is set to true");
			assert.ok(aRefs.eq(7).hasClass("sapUiCalItemSelBetween"), "is marked correctly with between class");
			assert.strictEqual(aRefs.eq(7).attr("aria-selected"), "true", "aria selected is set to true");
			assert.ok(aRefs.eq(8).hasClass("sapUiCalItemSel"), "is marked correctly with selected class");
			assert.strictEqual(aRefs.eq(8).attr("aria-selected"), "true", "aria selected is set to true");

			// clean
			oDeviceStub.restore();
		});

		QUnit.test("_selectMonth - updates the internal property for currenty focused month", function(assert) {
			// prepare
			var oSetPropertySpy = this.spy(this.MP, "setProperty");
			this.MP.setIntervalSelection(false);

			// act
			this.MP._selectMonth(5);

			// assert
			assert.ok(oSetPropertySpy.calledWith("_focusedMonth", 5), "Focused month is properly set");
		});

		QUnit.test("onmouseover", function(assert) {
			// arrange
			var oFakeEvent = {
					target: jQuery("<div></div>").attr({
						"id": this.MP.getId() + "-m5",
						"class": "sapUiCalItem"
					}).get(0),
					classList: {
						contains: function() {
							return true;
						}
					}
				},
				fnMarkIntervalSpy = this.spy(this.MP, "_markInterval");

			this.MP._oItemNavigation = {
				getItemDomRefs: function() {
					return [];
				}
			};

			// act
			this.MP.onmouseover(oFakeEvent);

			// assert
			assert.ok(fnMarkIntervalSpy.calledOnce, "_markInterval was called once");

			// clean
			fnMarkIntervalSpy.restore();
		});

		QUnit.test("_isSelectionInProgress", function(assert) {
			// arrange
			var oSep_01_2019 = UI5Date.getInstance(2019, 8, 1),
				oNov_01_2019 = UI5Date.getInstance(2019, 10, 1);

			this.MP.addSelectedDate(new DateRange({
				startDate: oSep_01_2019
			}));

			// assert
			assert.ok(this.MP._isSelectionInProgress(), "Selection is not finished");

			// act
			this.MP.getSelectedDates()[0].setEndDate(oNov_01_2019);

			// assert
			assert.notOk(this.MP._isSelectionInProgress(), "Selection is finished");
		});

		QUnit.test("_extractMonth", function(assert) {
			// arrange
			var oCalItem = jQuery("<div></div>").attr({
				"id": this.MP.getId() + "-m11",
				"class": "sapUiCalItem"
			}).get(0);

			// act
			// assert
			assert.strictEqual(this.MP._extractMonth(oCalItem), 11, "December is the extracted month");
		});

		QUnit.test("_isMonthSelected", function(assert) {
			// arrange
			var oSep_01_2019 = UI5Date.getInstance(2019, 8, 1),
				oNov_01_2019 = UI5Date.getInstance(2019, 10, 1),
				oDec_01_2019 = UI5Date.getInstance(2019, 11, 1);

			this.MP.addSelectedDate(new DateRange({
				startDate: oSep_01_2019,
				endDate: oDec_01_2019
			}));

			// act & assert
			assert.equal(
				this.MP._isMonthSelected(CalendarDate.fromLocalJSDate(oSep_01_2019)),
				true,
				"is correct with the start date"
			);
			assert.equal(
				this.MP._isMonthSelected(CalendarDate.fromLocalJSDate(oNov_01_2019)),
				false,
				"is correct with a date between"
			);
			assert.equal(
				this.MP._isMonthSelected(CalendarDate.fromLocalJSDate(oDec_01_2019)),
				true,
				"is correct with the end date"
			);
		});

		QUnit.test("_isMonthInsideSelectionRange", function(assert) {
			// arrange
			var oSep_01_2019 = UI5Date.getInstance(2019, 8, 1),
				oOct_01_2019 = UI5Date.getInstance(2019, 9, 1),
				oDec_01_2019 = UI5Date.getInstance(2019, 11, 1);

			this.MP.addSelectedDate(new DateRange({
				startDate: oSep_01_2019,
				endDate: oDec_01_2019
			}));

			// act & assert
			assert.equal(
				this.MP._isMonthInsideSelectionRange(CalendarDate.fromLocalJSDate(oSep_01_2019)),
				true,
				"is correct with the start date"
			);
			assert.equal(
				this.MP._isMonthInsideSelectionRange(CalendarDate.fromLocalJSDate(oOct_01_2019)),
				true,
				"is correct with a date between"
			);
			assert.equal(
				this.MP._isMonthInsideSelectionRange(CalendarDate.fromLocalJSDate(oDec_01_2019)),
				true,
				"is correct with the end date"
			);
		});

		QUnit.test("_markInterval", async function(assert) {
			// arrange
			var sCurrentYear = UI5Date.getInstance().getFullYear(),
				oSep_01_2019 = UI5Date.getInstance(sCurrentYear, 8, 1),
				oDec_01_2019 = UI5Date.getInstance(sCurrentYear, 11, 1),
				aRefs;

			this.MP.placeAt("qunit-fixture");
			await nextUIUpdate();
			aRefs = this.MP.$().find(".sapUiCalItem");


			// act
			this.MP._markInterval(
				CalendarDate.fromLocalJSDate(oSep_01_2019),
				CalendarDate.fromLocalJSDate(oDec_01_2019)
			);

			// assert
			assert.ok(aRefs.eq(9).hasClass("sapUiCalItemSelBetween"), "is marked correctly with between class");
			assert.ok(aRefs.eq(10).hasClass("sapUiCalItemSelBetween"), "is marked correctly with between class");
		});

		QUnit.test("_markInterval", async function (assert) {
			// Prepare
			var aItemsMarkedAsBetween,
				oBeforeStartDate = CalendarDate.fromLocalJSDate(UI5Date.getInstance(2022, 1, 1)),
				oIntervalStartDate = CalendarDate.fromLocalJSDate(UI5Date.getInstance(2022, 3, 1)),
				oIntervalEndDate = CalendarDate.fromLocalJSDate(UI5Date.getInstance(2022, 8, 1)),
				oAfterEndDate = CalendarDate.fromLocalJSDate(UI5Date.getInstance(2022, 10, 1));

			this.MP._iMinMonth = 3;
			this.MP._iMaxMonth = 8;
			this.MP._setYear(2022);

			this.MP.placeAt("qunit-fixture");
			await nextUIUpdate();
			// Act
			this.MP._markInterval(oIntervalStartDate, oIntervalEndDate);

			aItemsMarkedAsBetween = jQuery('.sapUiCalItemSelBetween');

			// Assert
			assert.strictEqual(aItemsMarkedAsBetween.length, 4, "4 months inside the interval");

			// Act
			this.MP._markInterval(oBeforeStartDate, oIntervalEndDate);

			aItemsMarkedAsBetween = jQuery('.sapUiCalItemSelBetween');

			// Assert
			assert.strictEqual(aItemsMarkedAsBetween.length, 4, "4 months inside the interval");

			// Act
			this.MP._markInterval(oIntervalStartDate, oAfterEndDate);

			aItemsMarkedAsBetween = jQuery('.sapUiCalItemSelBetween');

			// Assert
			assert.strictEqual(aItemsMarkedAsBetween.length, 4, "4 months inside the interval");
		});

		QUnit.module("Accessibility", {
			beforeEach: async function () {
				this.oMP = new MonthPicker();
				this.oMP.placeAt("qunit-fixture");
				await nextUIUpdate();
			},
			afterEach: function () {
				this.oMP.destroy();
				this.oMP = null;
			}
		});

		QUnit.test("Control description", function (assert) {
			// Arrange
			var sControlDescription = Library.getResourceBundleFor("sap.ui.unified").getText("MONTH_PICKER");

			// Assert
			assert.strictEqual(this.oMP.$().attr("aria-roledescription"), sControlDescription , "Control description is added in aria-roledescription");
		});

		QUnit.module("Interaction", {
			beforeEach: async function() {
				this.MP = new MonthPicker();
				this.MP.placeAt("qunit-fixture");
				await nextUIUpdate();
			},
			afterEach: function() {
				this.MP.destroy();
				this.MP = null;
			}
		});

		QUnit.test("Selecting a month that is disabled due to min/max motnhs set on mobile", function(assert) {
			// prepare
			var iFocusedIndex = 8,
				oDeviceStub = this.stub(Device.support, "touch").value(true),
				oIsValueInThresholdStub = this.stub(this.MP, "_isValueInThreshold").returns(true),
				oItemNavigationStub = this.stub(this.MP._oItemNavigation, "getFocusedIndex").returns(iFocusedIndex),
				oFakeEvent = {
					target: jQuery("<div></div>").attr({
						"id": this.MP.getId() + "-m8",
						"class": "sapUiCalItem"
					}).get(0),
					classList: {
						contains: function() {
							return true;
						}
					}
				},
				fnFireSelectSpy = this.spy(this.MP, "fireSelect");

			this.MP.setMinMax(1, 6);

			// act
			this.MP.onmousedown({});
			this.MP.onmouseup(oFakeEvent);

			// assert
			assert.ok(fnFireSelectSpy.notCalled, "'fireSelect' is not called");

			// cleanup
			oDeviceStub.restore();
			oIsValueInThresholdStub.restore();
			oItemNavigationStub.restore();
			fnFireSelectSpy.restore();
		});
	})();

});