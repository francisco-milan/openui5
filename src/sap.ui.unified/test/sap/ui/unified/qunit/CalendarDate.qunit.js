/*global QUnit */

sap.ui.define([
	"sap/base/i18n/Formatting",
	"sap/ui/unified/calendar/CalendarDate",
	"sap/base/i18n/date/CalendarType",
	"sap/ui/core/date/UI5Date",
	// load all required calendars in advance
	"sap/ui/core/date/Gregorian",
	"sap/ui/core/date/Islamic",
	"sap/ui/core/date/Japanese"
], function(Formatting, CalendarDate, CalendarType, UI5Date) {
	"use strict";

	QUnit.module("Constructor");
	//check with no parameters
	QUnit.test("Without any parameters", function (assert) {
		//Act
		var oCurrentJSDate = UI5Date.getInstance(),
				oCalendarDate = new CalendarDate();

		//Assert
		assert.equal(oCalendarDate.getYear(), oCurrentJSDate.getFullYear(), "getYear() should return the current year");
		assert.equal(oCalendarDate.getMonth(), oCurrentJSDate.getMonth(), "getMonth() should return the current month");
		assert.equal(oCalendarDate.getDate(), oCurrentJSDate.getDate(), "getDate() should return the current date");
		assert.equal(oCalendarDate.getDay(), oCurrentJSDate.getDay(), "getDay() should return the current day of week");

	});

	QUnit.test("With 1 parameter(CalendarDate), which does not accept invalid values", function (assert) {
		//Act
		var	oObject = {};
		//Assert
		assert.throws(
				function () {
					return new CalendarDate(20170001);
				},
				"does not work with a number as a parameter");

		assert.throws(
				function () {
					return new CalendarDate(undefined);
				},
				"does not work with undefined as a parameter");

		assert.throws(
				function () {
					return new CalendarDate(null);
				},
				"does not work with null as a parameter");

		assert.throws(
				function () {
					return new CalendarDate(oObject);
				},
				"does not work with an object as a parameter");

		assert.throws(
				function () {
					return new CalendarDate(2017, 4, 23, 345, 33);
				},
				"does not work with more than 4 parameters");

	});

	QUnit.test("With 1 parameter(CalendarDate)", function (assert) {
		//Act
		var oCurrentCalendarDate = new CalendarDate(),
				oCalendarDate = new CalendarDate(oCurrentCalendarDate);

		//Assert
		assert.notEqual(oCalendarDate.getYear(), undefined, "oCalendarDate.getYear() is not undefined. Some of the next tests may be skipped.");

		if (oCalendarDate.getYear()) {
			assert.equal(oCalendarDate.getYear(), oCurrentCalendarDate.getYear(), "getYear() should return the same value as the CalendarDate given in the constructor");
			assert.equal(oCalendarDate.getMonth(), oCurrentCalendarDate.getMonth(), "getMonth() should return the same value as the CalendarDate given in the constructor");
			assert.equal(oCalendarDate.getDate(), oCurrentCalendarDate.getDate(), "getDate() should return the same value as the CalendarDate given in the constructor");
			assert.equal(oCalendarDate.getDay(), oCurrentCalendarDate.getDay(), "getDay() should return the same value as the one CalendarDate given in the constructor");
		}

	});

	QUnit.test("With 2 parameters(CalendarDate, CalendarType(Non-gregorian))", function (assert) {
		//Act
		var oSourceJSDate = UI5Date.getInstance(2017, 3, 23),
				oSourceCalendarDate = new CalendarDate(oSourceJSDate.getFullYear(), oSourceJSDate.getMonth(), oSourceJSDate.getDate(),
						CalendarType.Gregorian),
				oTargetCalendarDate = new CalendarDate(oSourceCalendarDate, CalendarType.Islamic),
				oGeneratedJSDate = oTargetCalendarDate.toLocalJSDate();

		//Assert
		assert.equal(oGeneratedJSDate.getFullYear(), oSourceJSDate.getFullYear(), "the returned year is the same");
		assert.equal(oGeneratedJSDate.getMonth(), oSourceJSDate.getMonth(), "the returned month is the same");
		assert.equal(oGeneratedJSDate.getDate(), oSourceJSDate.getDate(), "the returned date is the same");
		assert.equal(oGeneratedJSDate.getHours(), oSourceJSDate.getHours(), "the returned hour is the same");
		assert.equal(oGeneratedJSDate.getMinutes(), oSourceJSDate.getMinutes(), "the returned minutes are the same");
		assert.equal(oGeneratedJSDate.getSeconds(), oSourceJSDate.getSeconds(), "the returned seconds are the same");
		assert.equal(oGeneratedJSDate.getMilliseconds(), oSourceJSDate.getMilliseconds(), "the returned milliseconds are the same");
		assert.equal(oGeneratedJSDate.getDay(), oSourceJSDate.getDay(), "the returned day is the same");

	});

	QUnit.test("With 2 parameters(CalendarDate, CalendarType(Gregorian))", function (assert) {
		//Act
		var oSourceDate = new CalendarDate(2017, 3, 22),
				oTargetCalendarDate;

		//Act
		oTargetCalendarDate = new CalendarDate(oSourceDate, "Gregorian");
		//Assert
		assert.notEqual(oTargetCalendarDate.getYear(), undefined, "getYear() is not undefined. Some of the next tests may be skipped.");
		if (oTargetCalendarDate.getYear()) {
			assert.equal(oTargetCalendarDate.getYear(), oSourceDate.getYear(), "works for a Gregorian calendar");

			//Act
			oTargetCalendarDate = new CalendarDate(oSourceDate, "Islamic");
			//Assert
			assert.notEqual(oTargetCalendarDate.getYear(), oSourceDate.getYear(), "works for an Islamic calendar");

			//Act
			oTargetCalendarDate = new CalendarDate(oSourceDate, "Japanese");
			//Assert
			assert.notEqual(oTargetCalendarDate.getYear(), oSourceDate.getYear(), "works for a Japanese calendar");
		}
	});

	//check year
	QUnit.test("With 3 parameters(year, month, date) as strings. ", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate("2017", "0", "1");

		//Assert
		assert.equal(oCalendarDate.getYear(), 2017, "getYear() should return the same value as the one given in the constructor");
		assert.equal(oCalendarDate.getMonth(), 0, "getMonth() should return the same value as the one given in the constructor");
		assert.equal(oCalendarDate.getDate(), 1, "getDate() should return the same value as the one given in the constructor");

	});

	QUnit.test("With 3 parameters(year, month, date) as numbers", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(2017, 0, 1);

		//Assert
		assert.equal(oCalendarDate.getYear(), 2017, "getYear() should return the same value as the one given in the constructor");
		assert.equal(oCalendarDate.getMonth(), 0, "getMonth() should return the same value as the one given in the constructor");
		assert.equal(oCalendarDate.getDate(), 1, "getDate() should return the same value as the one given in the constructor");

	});

	QUnit.test("With 3 parameters(year, month, date), where year is with 2 digits, which is considered as a full year", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(17, 0, 1);

		//Assert
		assert.equal(oCalendarDate.getYear(), 17, "getYear() should return the same value as the one given in the constructor");

	});

	QUnit.test("With 3 parameters(year, month, date), where 0 is accepted as a year", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(0, 0, 1);

		//Assert
		assert.equal(oCalendarDate.getYear(), 0, "getYear() should return the same value as the one given in the constructor");

	});

	QUnit.test("With 3 parameters(year, month, date), where -1 is accepted as a year", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(-1, 0, 1);

		//Assert
		assert.equal(oCalendarDate.getYear(), -1, "getYear() should return the same value as the one given in the constructor");

	});

	QUnit.test("With 3 parameters(year, month, date), where month value outside month range", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(2017, 12, 1);

		//Assert
		assert.equal(oCalendarDate.getMonth(), 0, "getMonth() should return the first month of the year, when 12 passed as a parameter");
		assert.equal(oCalendarDate.getYear(), 2018, "getYear() should return the next year, when 12 is passed as a month parameter");

		oCalendarDate = new CalendarDate(2017, -1, 1);

		assert.equal(oCalendarDate.getMonth(), 11, "getMonth() should return the last month of the year, when -1 passed as a parameter");
		assert.equal(oCalendarDate.getYear(), 2016, "getYear() should return the previous year, when -1 is passed as a month parameter");

		oCalendarDate = new CalendarDate(15, 12, 1);

		assert.equal(oCalendarDate.getMonth(), 0, "getMonth() should return the first month of the year, when 12 passed as a parameter");
		assert.equal(oCalendarDate.getYear(), 16, "getYear() should return the next year, when 12 is passed as a month parameter");

	});

	QUnit.test("With 3 parameters(year, month, date), where date value is outside date range", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(2017, 0, 32);

		//Assert
		assert.equal(oCalendarDate.getDate(), 1, "getDate() should return the first date of the next month, when 32 as a date parameter and 0 as a month parameter are passed");
		assert.equal(oCalendarDate.getMonth(), 1, "getMonth() should return the next month, when 32 as a date parameter and 0 as a month parameter are passed");

		oCalendarDate = new CalendarDate(2017, 3, 31);

		assert.equal(oCalendarDate.getDate(), 1, "getDate() should return the first date of the next month, when 31 as a date parameter and 3 as a month parameter are passed");
		assert.equal(oCalendarDate.getMonth(), 4, "getMonth() should return the next month, when 31 as a date parameter and 3 as a month parameter are passed");

		oCalendarDate = new CalendarDate(2017, 1, 29);

		assert.equal(oCalendarDate.getDate(), 1, "getDate() should return the first date of the next month, when 29 as a date parameter and 1 as a month parameter are passed");
		assert.equal(oCalendarDate.getMonth(), 2, "getMonth() should return the next month, when 29 as a date parameter and 1 as a month parameter are passed");

		oCalendarDate = new CalendarDate(2017, 5, 0);

		assert.equal(oCalendarDate.getDate(), 31, "getDate() should return the last date of the previous month, when 0 as a date parameter is passed");
		assert.equal(oCalendarDate.getMonth(), 4, "getMonth() should return the previous month, when 0 as a date parameter is passed");

		oCalendarDate = new CalendarDate(2017, 5, -1);

		assert.equal(oCalendarDate.getDate(), 30, "getDate() should return the day before the last date of the previous month, when -1 as a date parameter is passed");
		assert.equal(oCalendarDate.getMonth(), 4, "getMonth() should return the previous month, when -1 as a date parameter is passed");
	});

	QUnit.test("With 3 parameters(year, month, date), where the year is a leap one)", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(2016, 1, 29);

		//Assert
		assert.equal(oCalendarDate.getDate(), 29, "getDate() should return the same value as the one given in the constructor");
		assert.equal(oCalendarDate.getMonth(), 1, "getMonth() should return the same value as the one given in the constructor");

	});

	QUnit.test("With 3 parameters(year, month, date), where date value is outside date range and the year is leap one", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(2016, 1, 30);

		//Assert
		assert.equal(oCalendarDate.getDate(), 1, "getDate() should return the first date of the next month, when 30 as a date parameter and 1 as a month parameter are passed");
		assert.equal(oCalendarDate.getMonth(), 2, "getMonth() should return the next month, when 30 as a date parameter and 1 as a month parameter are passed");

	});

	QUnit.test("With 3 parameters(year, month, date), where date value is outside date range with month and year recalculations", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(2017, 11, 32);

		//Assert
		assert.equal(oCalendarDate.getDate(), 1, "getDate() should return the first date of the next year, when 32 as a date parameter and 11 as a month parameter are passed");
		assert.equal(oCalendarDate.getMonth(), 0, "getMonth() should return the first month of the next year, when 32 as a date parameter and 11 as a month parameter are passed");
		assert.equal(oCalendarDate.getYear(), 2018, "getYear() should return next year, when 32 as a date parameter and 11 as a month parameter are passed");

	});

	QUnit.test("With 4 parameters(year, month, date, calendarType)", function (assert) {
		//Act
		var oSourceDate = new CalendarDate(2017, 3, 22),
				oTargetCalendarDate;

		//Assert
		oTargetCalendarDate = new CalendarDate(2017, 3, 22, "Gregorian");
		assert.notEqual(oTargetCalendarDate.getYear(), undefined, "getYear() is not undefined. Some of the next tests may be skipped.");

		if (oTargetCalendarDate.getYear()) {
			assert.equal(oTargetCalendarDate.getYear(), oSourceDate.getYear(), "works for a Gregorian calendar");

			oTargetCalendarDate = new CalendarDate(2017, 3, 22, "Islamic");
			assert.notEqual(oTargetCalendarDate.getYear(), oSourceDate.getYear(), "works for an Islamic calendar");

			oTargetCalendarDate = new CalendarDate(2017, 3, 22, "Japanese");
			assert.notEqual(oTargetCalendarDate.getYear(), oSourceDate.getYear(), "works for a Japanese calendar");
		}
	});

	QUnit.module("Setters");
	QUnit.test("setters set the proper value", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(2017, 3, 22);

		oCalendarDate.setYear(2000);
		oCalendarDate.setMonth(6);
		oCalendarDate.setDate(23);

		//Assert
		assert.equal(oCalendarDate.getYear(), 2000, "setYear() works properly");
		assert.equal(oCalendarDate.getMonth(), 6, "setMonth() works properly");
		assert.equal(oCalendarDate.getDate(), 23, "setDate() works properly");
		assert.equal(oCalendarDate.getDay(), 0, "getDay() works properly");

	});

	QUnit.test("setters do not accept invalid values", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(),
				oObject = {};

		//Assert
		assert.throws(
				function () {
					oCalendarDate.setYear();
				},
				"setYear() does not work without any passed parameters");

		assert.throws(
				function () {
					oCalendarDate.setMonth();
				},
				"setMonth() does not work without any passed parameters");

		assert.throws(
				function () {
					oCalendarDate.setDate();
				},
				"setDate() does not work without any passed parameters");

		assert.throws(
				function () {
					oCalendarDate.setYear(undefined);
				},
				"setYear() does not work with undefined as a parameter");

		assert.throws(
				function () {
					oCalendarDate.setMonth(undefined);
				},
				"setMonth() does not work with undefined as a parameter");

		assert.throws(
				function () {
					oCalendarDate.setDate(undefined);
				},
				"setDate() does not work with undefined as a parameter");

		assert.throws(
				function () {
					oCalendarDate.setYear(null);
				},
				"setYear() does not work with null as a parameter");

		assert.throws(
				function () {
					oCalendarDate.setMonth(null);
				},
				"setMonth() does not work with null as a parameter");

		assert.throws(function () {
					oCalendarDate.setDate(null);
				},
				"setDate() does not work with null as a parameter");

		assert.throws(
				function () {
					oCalendarDate.setYear(oObject);
				},
				"setYear() does not work with object as a parameter");

		assert.throws(
				function () {
					oCalendarDate.setMonth(oObject);
				},
				"setMonth() does not work with object as a parameter");

		assert.throws(function () {
					oCalendarDate.setDate(oObject);
				},
				"setDate() does not work with object as a parameter");

	});

	QUnit.test("setters return this", function (assert) {
		//Act
		var	oChangedCalendarDate = new CalendarDate();

		//Assert
		assert.equal(oChangedCalendarDate.setYear(2000), oChangedCalendarDate, "setYear() returns this");
		assert.equal(oChangedCalendarDate.setMonth(6), oChangedCalendarDate, "setMonth() returns this");
		assert.equal(oChangedCalendarDate.setDate(23), oChangedCalendarDate, "setDate() returns this");

	});

	// BCP: 1880065660
	QUnit.test("fromLocalJSDate with iframe's JS date object should convert properly the date", function (assert) {
		// arrange
		var iframe = document.createElement('iframe');
		document.body.appendChild(iframe);
		var oWindow = iframe.contentWindow;
		oWindow.dateObj = new oWindow.Date(2017, 11, 12);

		// act
		CalendarDate.fromLocalJSDate(oWindow.dateObj);

		// assert
		assert.ok(true, "fromLocalJSDate did not throw an expection with date object from an iframe");

		// cleanup
		document.body.removeChild(iframe);
		iframe = null;
	});

	QUnit.test("'setMonth' with a date as a second passed parameter does not shift the month" +
		"(months with 31 days scenario)", function(assert){
		//prepare
		var oCD = new CalendarDate(2017, 0, 31);

		//act
		oCD.setMonth(1, 1);

		//assert
		assert.equal(oCD.getMonth(), 1, "the first argument is the month and it's February");
		assert.equal(oCD.getDate(), 1, "there is an optional second argument - date and it's 1st");

		//cleanup
		oCD.destroy();
	});

	QUnit.test("'setMonth' with a date as a second passed parameter 0 goes to the last day of previous month", function(assert){
		//prepare
		var oCD = new CalendarDate(2017, 5, 5);

		//act
		oCD.setMonth(3, 0);

		//assert
		assert.equal(oCD.getMonth(), 2, "the first argument is the month and it's Month");
		assert.equal(oCD.getDate(), 31, "there is an optional second argument - date and it's 31st");

		//cleanup
		oCD.destroy();
	});

	QUnit.module("isBefore");
	QUnit.test("checks if a CalendarDate is before another one", function (assert) {
		//Act
		var oPrecedingCalendarDate = new CalendarDate(2017, 3, 22),
				oCalendarDate = new CalendarDate(2017, 3, 23);

		//Assert
		assert.notEqual(oCalendarDate.isBefore(oPrecedingCalendarDate), undefined, "isBefore() is not undefined. Some of the next tests may be skipped.");
		if (oCalendarDate.isBefore(oPrecedingCalendarDate)) {
			assert.ok(oPrecedingCalendarDate.isBefore(oCalendarDate), "isBefore() works properly and returns true");
			assert.notOk(oCalendarDate.isBefore(oPrecedingCalendarDate), "isBefore() works properly and returns false");
		}
	});

	QUnit.test("isBefore() does not accept invalid values", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(),
				oObject = {};

		//Assert
		assert.throws(
				function () {
					oCalendarDate.isBefore();
				},
				"isBefore() does not work without any passed parameters");

		assert.throws(
				function () {
					oCalendarDate.isBefore(undefined);
				},
				"isBefore() does not work with undefined as a parameter");

		assert.throws(
				function () {
					oCalendarDate.isBefore(null);
				},
				"isBefore() does not work with null as a parameter");

		assert.throws(
				function () {
					oCalendarDate.isBefore(oObject);
				},
				"isBefore() does not work with an object as a parameter");

	});

	QUnit.module("isAfter");
	QUnit.test("checks if a CalendarDate is before another one", function (assert) {
		//Act
		var oPrecedingCalendarDate = new CalendarDate(2017, 3, 22),
				oCalendarDate = new CalendarDate(2017, 3, 23);

		//Assert
		assert.notEqual(oCalendarDate.isAfter(oPrecedingCalendarDate), undefined, "isAfter() is not undefined. Some of the next tests may be skipped.");
		if (oCalendarDate.isAfter(oPrecedingCalendarDate)) {
			assert.ok(oCalendarDate.isAfter(oPrecedingCalendarDate), "isAfter() works properly and returns true");
			assert.notOk(oPrecedingCalendarDate.isAfter(oCalendarDate), "isAfter() works properly and returns false");
		}
	});

	QUnit.test("isAfter() does not accept invalid values", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(),
				oObject = {};

		//Assert
		assert.throws(
				function () {
					oCalendarDate.isAfter();
				},
				"isAfter() does not work without any passed parameters");

		assert.throws(
				function () {
					oCalendarDate.isAfter(undefined);
				},
				"isAfter() does not work with undefined as a parameter");

		assert.throws(
				function () {
					oCalendarDate.isAfter(null);
				},
				"isAfter() does not work with null as a parameter");

		assert.throws(
				function () {
					oCalendarDate.isAfter(oObject);
				},
				"isAfter() does not work with object as a parameter");

	});

	QUnit.module("isSameOrBefore");
	QUnit.test("checks if a CalendarDate is the same or before another one", function (assert) {
		//Act
		var oPrecedingCalendarDate = new CalendarDate(2017, 3, 22),
				oCalendarDate = new CalendarDate(2017, 3, 23);

		//Assert
		assert.notEqual(oCalendarDate.isSameOrBefore(oCalendarDate), undefined, "isSameOrBefore() is not undefined. Some of the next tests may be skipped.");
		if (oCalendarDate.isSameOrBefore(oCalendarDate)) {
			assert.ok(oPrecedingCalendarDate.isSameOrBefore(oCalendarDate), "isSameOrBefore() works properly and returns true for different dates");
			assert.ok(oCalendarDate.isSameOrBefore(oCalendarDate), "isSameOrBefore() works properly and returns true for the same date");
			assert.notOk(oCalendarDate.isSameOrBefore(oPrecedingCalendarDate), "isSameOrBefore() works properly and returns false");
		}
	});

	QUnit.test("isSameOrBefore() does not accept invalid values", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(),
				oObject = {};

		//Assert
		assert.throws(
				function () {
					oCalendarDate.isSameOrBefore();
				},
				"isSameOrBefore() does not work without any passed parameters");

		assert.throws(
				function () {
					oCalendarDate.isSameOrBefore(undefined);
				},
				"isSameOrBefore() does not work with undefined as a parameter");

		assert.throws(
				function () {
					oCalendarDate.isSameOrBefore(null);
				},
				"isSameOrBefore() does not work with null as a parameter");

		assert.throws(
				function () {
					oCalendarDate.isSameOrBefore(oObject);
				},
				"isSameOrBefore() does not work with object as a parameter");

	});

	QUnit.module("isSameOrAfter");
	QUnit.test("checks if a CalendarDate is the same or before another one", function (assert) {
		//Act
		var oPrecedingCalendarDate = new CalendarDate(2017, 3, 22),
				oCalendarDate = new CalendarDate(2017, 3, 23);

		//Assert
		assert.notEqual(oCalendarDate.isSameOrAfter(oPrecedingCalendarDate), undefined, "isSameOrAfter() is not undefined. Some of the next tests may be skipped.");
		if (oCalendarDate.isSameOrAfter(oPrecedingCalendarDate)) {
			assert.ok(oCalendarDate.isSameOrAfter(oPrecedingCalendarDate), "isSameOrAfter() works properly and returns true for different dates");
			assert.ok(oCalendarDate.isSameOrAfter(oCalendarDate), "isSameOrAfter() works properly and returns true for the same dates");
			assert.notOk(oPrecedingCalendarDate.isSameOrAfter(oCalendarDate), "isSameOrAfter() works properly and returns false");
		}
	});

	QUnit.test("isSameOrAfter() does not accept invalid values", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(),
				oObject = {};

		//Assert
		assert.throws(
				function () {
					oCalendarDate.isSameOrAfter();
				},
				"isSameOrAfter() does not work without any passed parameters");

		assert.throws(
				function () {
					oCalendarDate.isSameOrAfter(undefined);
				},
				"isSameOrAfter() does not work with undefined as a parameter");

		assert.throws(
				function () {
					oCalendarDate.isSameOrAfter(null);
				},
				"isSameOrAfter() does not work with null as a parameter");

		assert.throws(
				function () {
					oCalendarDate.isSameOrAfter(oObject);
				},
				"isSameOrAfter() does not work with object as a parameter");

	});

	QUnit.module("isSame");
	QUnit.test("checks if a CalendarDate is the same as another one", function (assert) {
		//Act
		var oPrecedingCalendarDate = new CalendarDate(2017, 3, 22),
				oAscendingCalendarDate = new CalendarDate(2017, 3, 24),
				oSameCalendarDate = new CalendarDate(2017, 3, 23),
				oCalendarDate = new CalendarDate(2017, 3, 23);

		//Assert
		assert.notEqual(oCalendarDate.isSame(oSameCalendarDate), undefined, "isSameOrAfter() is not undefined. Some of the next tests may be skipped.");
		if (oCalendarDate.isSame(oSameCalendarDate)) {
			assert.ok(oCalendarDate.isSame(oSameCalendarDate), "isSame() works properly and returns true for the same dates");
			assert.notOk(oCalendarDate.isSame(oPrecedingCalendarDate), "isSame() works properly and returns false for a preceding date");
			assert.notOk(oCalendarDate.isSame(oAscendingCalendarDate), "isSame() works properly and returns false for a ascending date");
		}
	});

	QUnit.test("isSame() does not accept invalid values", function (assert) {
		//Prepare
		var oCalendarDate = new CalendarDate();

		//Act & Assert
		assert.throws(
				function () {
					oCalendarDate.isSame();
				},
				"isSameOrAfter() does not work without any passed parameters");

		assert.throws(
				function () {
					oCalendarDate.isSame(undefined);
				},
				"isSameOrAfter() does not work with undefined as a parameter");

		assert.throws(
				function () {
					oCalendarDate.isSame(null);
				},
				"isSameOrAfter() does not work with null as a parameter");

		assert.throws(
				function () {
					oCalendarDate.isSame({});
				},
				"isSameOrAfter() does not work with object as a parameter");

	});

	QUnit.module("toLocalJSDate");
	QUnit.test("returns JS date", function (assert) {
		//Prepare
		var oCalendarDate = new CalendarDate();

		//Act && Assert
		assert.ok(oCalendarDate.toLocalJSDate() instanceof Date, "returned JS Date with 4 parameters");

	});

	QUnit.test("the generated values are the same as the ones in a JS date object", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(2017, 3, 23),
				oGeneratedJSDate = oCalendarDate.toLocalJSDate(),
				oJSDate = UI5Date.getInstance(2017, 3, 23, 2, 50, 40, 35);

		oGeneratedJSDate.setHours(2, 50, 40, 35);

		//Assert
		assert.equal(oGeneratedJSDate.getYear(), oJSDate.getYear(), "the returned year is the same");
		assert.equal(oGeneratedJSDate.getMonth(), oJSDate.getMonth(), "the returned month is the same");
		assert.equal(oGeneratedJSDate.getDate(), oJSDate.getDate(), "the returned date is the same");
		assert.equal(oGeneratedJSDate.getHours(), oJSDate.getHours(), "the returned hour is the same");
		assert.equal(oGeneratedJSDate.getMinutes(), oJSDate.getMinutes(), "the returned minutes are the same");
		assert.equal(oGeneratedJSDate.getSeconds(), oJSDate.getSeconds(), "the returned seconds are the same");
		assert.equal(oGeneratedJSDate.getMilliseconds(), oJSDate.getMilliseconds(), "the returned milliseconds are the same");

	});

	QUnit.test("Non-gregorian CalendarDate.toLocalJSDate() returns Gregorian date", function (assert) {
		//Act
		var oSourceJSDate = UI5Date.getInstance(2017, 3, 23),
				oSourceCalendarDate = new CalendarDate(oSourceJSDate.getFullYear(), oSourceJSDate.getMonth(), oSourceJSDate.getDate(),
						CalendarType.Islamic),
				oGeneratedJSDate = oSourceCalendarDate.toLocalJSDate();

		//Assert
		assert.equal(oGeneratedJSDate.getFullYear(), oSourceJSDate.getFullYear(), "the returned year is the same");
		assert.equal(oGeneratedJSDate.getMonth(), oSourceJSDate.getMonth(), "the returned month is the same");
		assert.equal(oGeneratedJSDate.getDate(), oSourceJSDate.getDate(), "the returned date is the same");
		assert.equal(oGeneratedJSDate.getHours(), oSourceJSDate.getHours(), "the returned hour is the same");
		assert.equal(oGeneratedJSDate.getMinutes(), oSourceJSDate.getMinutes(), "the returned minutes are the same");
		assert.equal(oGeneratedJSDate.getSeconds(), oSourceJSDate.getSeconds(), "the returned seconds are the same");
		assert.equal(oGeneratedJSDate.getMilliseconds(), oSourceJSDate.getMilliseconds(), "the returned milliseconds are the same");
	});

	QUnit.module("toUTCJSDate");
	QUnit.test("returns JS date", function (assert) {
		//Prepare
		var oCalendarDate = new CalendarDate(2017, 3, 23);

		//Act & Assert
		assert.ok(oCalendarDate.toUTCJSDate() instanceof Date, "returned JS Date with 4 parameters");
	});

	QUnit.test("the generated values are the same as the ones in a JS date object", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(2017, 3, 23),
				oGeneratedJSDate = oCalendarDate.toUTCJSDate(),
				oJSDate = UI5Date.getInstance(2017, 3, 23, 2, 50, 40, 35),
				oExpectedUTCJSDate = UI5Date.getInstance(Date.UTC(oJSDate.getFullYear(), oJSDate.getMonth(), oJSDate.getDate(),
						oJSDate.getHours(), oJSDate.getMinutes(), oJSDate.getSeconds(), oJSDate.getMilliseconds()));

		oGeneratedJSDate.setUTCHours(2, 50, 40, 35);

		//Assert
		assert.equal(oGeneratedJSDate.getYear(), oExpectedUTCJSDate.getYear(), "the returned year is the same");
		assert.equal(oGeneratedJSDate.getMonth(), oExpectedUTCJSDate.getMonth(), "the returned month is the same");
		assert.equal(oGeneratedJSDate.getDate(), oExpectedUTCJSDate.getDate(), "the returned date is the same");
		assert.equal(oGeneratedJSDate.getHours(), oExpectedUTCJSDate.getHours(), "the returned hour is the same");
		assert.equal(oGeneratedJSDate.getMinutes(), oExpectedUTCJSDate.getMinutes(), "the returned minutes are the same");
		assert.equal(oGeneratedJSDate.getSeconds(), oExpectedUTCJSDate.getSeconds(), "the returned seconds are the same");
		assert.equal(oGeneratedJSDate.getMilliseconds(), oExpectedUTCJSDate.getMilliseconds(), "the returned milliseconds are the same");

	});

	QUnit.test("Non-gregorian CalendarDate.toUTCJSDate() returns Gregorian date", function (assert) {
		//Act
		var oJSDate = UI5Date.getInstance(2017, 3, 23),
				oSourceCalendarDate = new CalendarDate(oJSDate.getFullYear(), oJSDate.getMonth(), oJSDate.getDate(),
						CalendarType.Islamic),
				oGeneratedJSDate = oSourceCalendarDate.toUTCJSDate(),
				oExpectedUTCJSDate = UI5Date.getInstance(Date.UTC(oJSDate.getFullYear(), oJSDate.getMonth(), oJSDate.getDate(), oJSDate.getHours(), oJSDate.getMinutes(), oJSDate.getSeconds(), oJSDate.getMilliseconds()));

		//Assert
		assert.equal(oGeneratedJSDate.getFullYear(), oExpectedUTCJSDate.getFullYear(), "the returned year is the same");
		assert.equal(oGeneratedJSDate.getMonth(), oExpectedUTCJSDate.getMonth(), "the returned month is the same");
		assert.equal(oGeneratedJSDate.getDate(), oExpectedUTCJSDate.getDate(), "the returned date is the same");
		assert.equal(oGeneratedJSDate.getHours(), oExpectedUTCJSDate.getHours(), "the returned hour is the same");
		assert.equal(oGeneratedJSDate.getMinutes(), oExpectedUTCJSDate.getMinutes(), "the returned minutes are the same");
		assert.equal(oGeneratedJSDate.getSeconds(), oExpectedUTCJSDate.getSeconds(), "the returned seconds are the same");
		assert.equal(oGeneratedJSDate.getMilliseconds(), oExpectedUTCJSDate.getMilliseconds(), "the returned milliseconds are the same");
	});

	QUnit.test("getEra returns the right era", function(assert) {
		var o7_Jan_1989_Showa_End = CalendarDate.fromLocalJSDate(UI5Date.getInstance(1989, 0, 7), "Japanese");
		var o8_Jan_1989_Heisei_Begin = CalendarDate.fromLocalJSDate(UI5Date.getInstance(1989, 0, 8), "Japanese");

		var now = CalendarDate.fromLocalJSDate(UI5Date.getInstance(), "Gregorian");

		assert.equal(o7_Jan_1989_Showa_End.getEra(), 234, "era is right");
		assert.equal(o8_Jan_1989_Heisei_Begin.getEra(), 235, "era is right");
		assert.equal(now.getEra(), 1, "era is right");
	});

	QUnit.module("toString");
	QUnit.test("returns a string", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(),
				oGeneratedString = oCalendarDate.toString();

		//Assert
		assert.equal((typeof oGeneratedString), "string", "returned a string");

	});

	QUnit.test("toString() returns the right value", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(),
				sExpectedResponse = Formatting.getCalendarType() + ": " + oCalendarDate.getYear() + "/" + (oCalendarDate.getMonth() + 1) + "/" + oCalendarDate.getDate();

		//Assert
		assert.equal(oCalendarDate.toString(), sExpectedResponse, "returns the expected date");

	});

	QUnit.module("valueOf");
	QUnit.test("returns the accurate type - number", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(),
				oGeneratedValue = oCalendarDate.valueOf();

		//Assert
		assert.equal((typeof oGeneratedValue), "number", "returned CalendarDate type");

	});

	QUnit.test("the generated values are the same as the ones in the source date", function (assert) {
		//Act
		var oJSDate = UI5Date.getInstance(),
				oCalendarDate = CalendarDate.fromLocalJSDate(oJSDate),
				oExpectedUTCJSDate = UI5Date.getInstance(Date.UTC(oJSDate.getFullYear(), oJSDate.getMonth(), oJSDate.getDate())),
				oGeneratedValue = oCalendarDate.valueOf();


		//Assert
		assert.equal(oGeneratedValue, oExpectedUTCJSDate.getTime(), "the valueof is the same as getTime()");

	});

	QUnit.module("fromLocalJSDate");
	QUnit.test("returns CalendarDate date", function (assert) {
		//Act
		var oCalendarDate = new CalendarDate(),
				oJSDate = UI5Date.getInstance(),
				oGeneratedDate = CalendarDate.fromLocalJSDate(oJSDate),
				sTypeOfCalendarDate = typeof oCalendarDate;

		//Assert
		assert.equal((typeof oGeneratedDate), sTypeOfCalendarDate, "returned CalendarDate without any extra parameters");
		oGeneratedDate = CalendarDate.fromLocalJSDate(oJSDate, "Gregorian");
		assert.equal((typeof oGeneratedDate), sTypeOfCalendarDate, "returned CalendarDate with a second parameter - Gregorian as a type");
		oGeneratedDate = CalendarDate.fromLocalJSDate(oJSDate, "Islamic");
		assert.equal((typeof oGeneratedDate), sTypeOfCalendarDate, "returned CalendarDate with a second parameter - Islamic as a type");
		oGeneratedDate = CalendarDate.fromLocalJSDate(oJSDate, "Japanese");
		assert.equal((typeof oGeneratedDate), sTypeOfCalendarDate, "returned CalendarDate with a second parameter - Japanese as a type");

	});

	QUnit.test("fromLocalJSDate() does not accept invalid values", function (assert) {
		//Act
		var oObject = {},
				sString = "abc";

		//Assert
		assert.throws(
				function () {
					CalendarDate.fromLocalJSDate();
				},
				"fromLocalJSDate() does not work without any passed parameters");

		assert.throws(
				function () {
					CalendarDate.fromLocalJSDate(undefined);
				},
				"fromLocalJSDate() does not work with undefined as a parameter");

		assert.throws(
				function () {
					CalendarDate.fromLocalJSDate(null);
				},
				"fromLocalJSDate() does not work with null as a parameter");

		assert.throws(
				function () {
					CalendarDate.fromLocalJSDate(oObject);
				},
				"fromLocalJSDate() does not work with object as a parameter");

		//?
		assert.throws(
				function () {
					CalendarDate.fromLocalJSDate(sString);
				},
				"fromLocalJSDate() does not work with string as a parameter");

	});

	QUnit.test("the generated values are the same as the ones in the JS date object", function (assert) {
		//Act
		var oJSDate = UI5Date.getInstance(2017, 3, 23, 2, 50, 40, 35),
				oGeneratedJSDate = CalendarDate.fromLocalJSDate(oJSDate);

		//Assert
		assert.equal(oGeneratedJSDate.getYear(), oJSDate.getFullYear(), "the returned year is the same");
		assert.equal(oGeneratedJSDate.getMonth(), oJSDate.getMonth(), "the returned month is the same");
		assert.equal(oGeneratedJSDate.getDate(), oJSDate.getDate(), "the returned date is the same");

	});
});