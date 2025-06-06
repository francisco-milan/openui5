/*global QUnit, sinon */

sap.ui.define([
	"sap/m/Title",
	"sap/ui/core/Element",
	"sap/ui/core/InvisibleMessage",
	"sap/ui/table/qunit/TableQUnitUtils",
	"sap/ui/table/qunit/rowmodes/shared/FixedRowHeight",
	"sap/ui/table/qunit/rowmodes/shared/RowCountConstraints",
	"sap/ui/table/qunit/rowmodes/shared/RowsUpdated",
	"sap/ui/table/Table",
	"sap/ui/table/Column",
	"sap/ui/table/rowmodes/Interactive",
	"sap/ui/table/utils/TableUtils",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/events/KeyCodes",
	"sap/ui/thirdparty/jquery",
	"sap/ui/Device"
], function(
	Title,
	Element,
	InvisibleMessage,
	TableQUnitUtils,
	FixedRowHeightTest,
	RowCountConstraintsTest,
	RowsUpdatedTest,
	Table,
	Column,
	InteractiveRowMode,
	TableUtils,
	qutils,
	KeyCodes,
	jQuery,
	Device
) {
	"use strict";

	const HeightTestControl = TableQUnitUtils.HeightTestControl;
	const aDensities = ["sapUiSizeCozy", "sapUiSizeCompact", "sapUiSizeCondensed", undefined];

	TableQUnitUtils.setDefaultSettings({
		rowMode: new InteractiveRowMode(),
		rows: {path: "/"}
	});

	/**
	 * @deprecated As of version 1.119
	 */
	QUnit.module("Legacy support", {
		before: function() {
			this.mDefaultSettings = TableQUnitUtils.getDefaultSettings();
			TableQUnitUtils.setDefaultSettings();
		},
		beforeEach: function() {
			this.oTable = TableQUnitUtils.createTable({
				visibleRowCountMode: "Interactive",
				rows: {path: "/"},
				models: TableQUnitUtils.createJSONModelWithEmptyRows(1)
			});
		},
		afterEach: function() {
			this.oTable.destroy();
		},
		after: function() {
			TableQUnitUtils.setDefaultSettings(this.mDefaultSettings);
		},
		getDefaultRowMode: function(oTable) {
			return oTable.getAggregation("_hiddenDependents").filter((oObject) => oObject.isA("sap.ui.table.rowmodes.Interactive"))[0];
		}
	});

	QUnit.test("Instance", function(assert) {
		assert.ok(TableUtils.isA(this.getDefaultRowMode(this.oTable), "sap.ui.table.rowmodes.Interactive"),
			"The table creates an instance of sap.ui.table.rowmodes.Interactive");
	});

	QUnit.test("Property getters", function(assert) {
		const oTable = TableQUnitUtils.createTable({
			visibleRowCountMode: "Interactive",
			visibleRowCount: 7,
			fixedRowCount: 1,
			fixedBottomRowCount: 2,
			minAutoRowCount: 3,
			rowHeight: 9
		});
		const oMode = this.getDefaultRowMode(oTable);

		assert.strictEqual(oMode.getRowCount(), 7, "The row count is taken from the table");
		assert.strictEqual(oMode.getFixedTopRowCount(), 1, "The fixed row count is taken from the table");
		assert.strictEqual(oMode.getFixedBottomRowCount(), 2, "The fixed bottom row count is taken from the table");
		assert.strictEqual(oMode.getMinRowCount(), 3, "The minimum row count is taken from the table");
		assert.strictEqual(oMode.getRowContentHeight(), 9, "The row content height is taken from the table");

		oMode.setRowCount(10);
		oMode.setFixedTopRowCount(10);
		oMode.setFixedBottomRowCount(10);
		oMode.setMinRowCount(10);
		oMode.setRowContentHeight(10);

		assert.strictEqual(oMode.getRowCount(), 7,
			"After setting the property on the mode, the row count is still taken from the table");
		assert.strictEqual(oMode.getFixedTopRowCount(), 1,
			"After setting the property on the mode, the fixed row count is still taken from the table");
		assert.strictEqual(oMode.getFixedBottomRowCount(), 2,
			"After setting the property on the mode, the fixed bottom row count is still taken from the table");
		assert.strictEqual(oMode.getMinRowCount(), 3,
			"After setting the property on the mode, the minimum row count is still taken from the table");
		assert.strictEqual(oMode.getRowContentHeight(), 9,
			"After setting the property on the mode, the row content height is still taken from the table");

		oTable.setVisibleRowCount(10);
		oTable.setFixedRowCount(2);
		oTable.setFixedBottomRowCount(3);
		oTable.setMinAutoRowCount(4);
		oTable.setRowHeight(14);

		assert.strictEqual(oMode.getRowCount(), 10,
			"After setting the property on the table, the new row count is taken from the table");
		assert.strictEqual(oMode.getFixedTopRowCount(), 2,
			"After setting the property on the table, the new fixed row count is taken from the table");
		assert.strictEqual(oMode.getFixedBottomRowCount(), 3,
			"After setting the property on the table, the new fixed bottom row count is taken from the table");
		assert.strictEqual(oMode.getMinRowCount(), 4,
			"After setting the property on the table, the new minimum row count is taken from the table");
		assert.strictEqual(oMode.getRowContentHeight(), 14,
			"After setting the property on the table, the new row content height is taken from the table");

		oTable.destroy();
	});

	QUnit.test("Rendering", async function(assert) {
		const oTable = TableQUnitUtils.createTable({
			visibleRowCountMode: "Interactive",
			visibleRowCount: 7
		});
		await oTable.qunit.whenRenderingFinished();

		assert.ok(oTable.getDomRef(), "Table is rendered");
		assert.equal(oTable.getVisibleRowCount(), 7, "Visible row count is correct");

		oTable.destroy();
	});

	QUnit.test("Row height", function(assert) {
		const oTable = this.oTable;
		let sequence = Promise.resolve();

		oTable.addColumn(new Column({template: new HeightTestControl()}));
		oTable.addColumn(new Column({template: new HeightTestControl()}));
		oTable.setFixedColumnCount(1);
		oTable.setRowActionCount(1);
		oTable.setRowActionTemplate(TableQUnitUtils.createRowAction(null));

		function test(mTestSettings) {
			sequence = sequence.then(async function() {
				oTable.setRowHeight(mTestSettings.rowHeight || 0);
				oTable.getColumns()[1].setTemplate(new HeightTestControl({height: (mTestSettings.templateHeight || 1) + "px"}));
				await oTable.qunit.setDensity(mTestSettings.density);
				TableQUnitUtils.assertRowHeights(assert, oTable, mTestSettings);
			});
		}

		aDensities.forEach(function(sDensity) {
			test({
				title: "Default height",
				density: sDensity,
				expectedHeight: TableUtils.DefaultRowHeight[sDensity]
			});
		});

		aDensities.forEach(function(sDensity) {
			test({
				title: "Default height; With large content",
				density: sDensity,
				templateHeight: TableUtils.DefaultRowHeight[sDensity] * 2,
				expectedHeight: TableUtils.DefaultRowHeight[sDensity] * 2 + 1
			});
		});

		aDensities.forEach(function(sDensity) {
			test({
				title: "Application-defined height; Less than default",
				density: sDensity,
				rowHeight: 20,
				expectedHeight: 21
			});
		});

		aDensities.forEach(function(sDensity) {
			test({
				title: "Application-defined height; Less than default; With large content",
				density: sDensity,
				rowHeight: 20,
				templateHeight: 100,
				expectedHeight: 101
			});
		});

		aDensities.forEach(function(sDensity) {
			test({
				title: "Application-defined height; Greater than default",
				density: sDensity,
				rowHeight: 100,
				expectedHeight: 101
			});
		});

		aDensities.forEach(function(sDensity) {
			test({
				title: "Application-defined height; Greater than default; With large content",
				density: sDensity,
				rowHeight: 100,
				templateHeight: 120,
				expectedHeight: 121
			});
		});

		return sequence.then(function() {
			oTable.qunit.resetDensity();
		});
	});

	QUnit.module("Get contexts", {
		beforeEach: function() {
			this.oGetContextsSpy = sinon.spy(Table.prototype, "_getContexts");
			this.oTable = TableQUnitUtils.createTable({
				models: TableQUnitUtils.createJSONModelWithEmptyRows(100)
			});
		},
		afterEach: function() {
			this.oGetContextsSpy.restore();
			this.oTable.destroy();
		}
	});

	QUnit.test("Initialization", function(assert) {
		const oGetContextsSpy = this.oGetContextsSpy;

		return this.oTable.qunit.whenRenderingFinished().then(function() {
			/*
			 * During the table initialization, Table._getContexts is called twice.
			 * Since the calls are throttled, the second call which is triggered by
			 * TableDelegate.onBeforeRendering, cancels the initial call.
			 *
			 * This mechanism behaves differently when the table initalization uses
			 * nextUIUpdate instead of Core.applyChanges. The initial call is already
			 * executed before the second call would cancel it. Therefore the function
			 * is called twice.
			 */
			assert.strictEqual(oGetContextsSpy.callCount, 2, "Method to get contexts called twice");
			assert.ok(oGetContextsSpy.calledWithExactly(0, 10, 100), "The call considers the rendered row count");
		});
	});

	QUnit.test("Change row count", function(assert) {
		const oTable = this.oTable;
		const oGetContextsSpy = this.oGetContextsSpy;

		oTable.setFirstVisibleRow(10);

		return oTable.qunit.whenRenderingFinished().then(function() {
			oGetContextsSpy.resetHistory();

			oTable.getRowMode().setRowCount(8);
		}).then(oTable.qunit.whenRenderingFinished).then(function() {
			assert.strictEqual(oGetContextsSpy.callCount, 1, "Decreased row count: Method to get contexts called once");
			assert.ok(oGetContextsSpy.calledWithExactly(10, 8, 100), "Decreased row count: The call considers the row count");

			oGetContextsSpy.resetHistory();
			oTable.getRowMode().setRowCount(10);
		}).then(oTable.qunit.whenRenderingFinished).then(function() {
			assert.strictEqual(oGetContextsSpy.callCount, 1, "Increased row count: Method to get contexts called once");
			assert.ok(oGetContextsSpy.calledWithExactly(10, 10, 100), "Increased row count: The call considers the row count");

			oTable.setFirstVisibleRow(100);
		}).then(oTable.qunit.whenRenderingFinished).then(function() {
			oGetContextsSpy.resetHistory();
			oTable.getRowMode().setRowCount(8);
		}).then(oTable.qunit.whenRenderingFinished).then(function() {
			assert.strictEqual(oGetContextsSpy.callCount, 1,
				"Decreased row count when scrolled to bottom: Method to get contexts called once");
			assert.ok(oGetContextsSpy.calledWithExactly(90, 8, 100),
				"Decreased row count when scrolled to bottom: The call considers the row count");

			oTable.setFirstVisibleRow(100);
		}).then(oTable.qunit.whenRenderingFinished).then(function() {
			oGetContextsSpy.resetHistory();
			oTable.getRowMode().setRowCount(10);
		}).then(oTable.qunit.whenRenderingFinished).then(function() {
			assert.strictEqual(oGetContextsSpy.callCount, 1,
				"Increased row count when scrolled to bottom: Method to get contexts called once");
			assert.ok(oGetContextsSpy.calledWithExactly(90, 10, 100),
				"Increased row count when scrolled to bottom: The call considers the row count");
		});
	});

	QUnit.module("Resizer", {
		beforeEach: async function() {
			const oTitle = new Title({text: "Title", titleStyle: "H3"});
			this.oTable = TableQUnitUtils.createTable({
				extension: oTitle,
				models: TableQUnitUtils.createJSONModelWithEmptyRows(100),
				placeAt: "qunit-fixture",
				ariaLabelledBy: oTitle.getId()
			});
			await this.oTable.qunit.whenRenderingFinished();
		},
		afterEach: function() {
			this.oTable.destroy();
		}
	});

	QUnit.test("Rendering", function(assert) {
		const oMode = this.oTable.getRowMode();
		const oResizerDomRef = this.oTable.getDomRef("heightResizer");

		assert.ok(oResizerDomRef, "The resizer is rendered");
		assert.equal(oResizerDomRef.getAttribute("role"), "separator", "The resizer has the correct role");
		assert.equal(oResizerDomRef.getAttribute("aria-orientation"), "horizontal", "The resizer has the correct aria-orientation");
		assert.equal(oResizerDomRef.getAttribute("title"), TableUtils.getResourceText("TBL_RSZ_BTN_TOOLTIP"),
			"The resizer has the correct tooltip");
		assert.equal(oResizerDomRef.getAttribute("tabindex"), "0", "The resizer is focusable");
		assert.equal(oResizerDomRef.getAttribute("aria-valuemin"), oMode.getMinRowCount(), "The resizer has the correct aria-valuemin");
		assert.equal(oResizerDomRef.getAttribute("aria-valuemax"), oMode._getMaxRowCount(), "The resizer has the correct aria-valuemax");
		assert.equal(oResizerDomRef.getAttribute("aria-valuenow"), oMode.getRowCount(), "The resizer has the correct aria-valuenow");
		assert.ok(oResizerDomRef.classList.contains("sapUiTableHeightResizer"), "The resizer has the correct CSS class");
		assert.equal(oResizerDomRef.getAttribute("aria-labelledby"), this.oTable.getAriaLabelledBy(), "The resizer has the correct aria-labelledby");

		assert.ok(oResizerDomRef.querySelector(".sapUiTableHeightResizerDecorationBefore"), "The resizer decoration is rendered");
		const oGripDomRef = oResizerDomRef.querySelector(".sapUiTableHeightResizerGrip");
		assert.ok(oGripDomRef, "The resizer grip is rendered");
		assert.equal(oGripDomRef.getAttribute("role"), "presentation", "The resizer grip has the correct role");
		assert.ok(oResizerDomRef.querySelector(".sapUiTableHeightResizerDecorationAfter"), "The resizer decoration is rendered");
	});

	QUnit.test("#_getMaxRowCount", function(assert) {
		const oMode = this.oTable.getRowMode();
		const iOriginalDeviceHeight = Device.resize.height;

		Device.resize.height = 100;
		assert.strictEqual(oMode._getMaxRowCount(), oMode.getMinRowCount(),
			"maxRowCount is calculated based on available space, but cannot be lower than minRowCount");

		Device.resize.height = 600;
		assert.strictEqual(oMode._getMaxRowCount(), 10, "maxRowCount is calculated based on available space");

		Device.resize.height = 700;
		assert.strictEqual(oMode._getMaxRowCount(), 12, "maxRowCount is calculated based on available space");

		Device.resize.height = 800;
		assert.strictEqual(oMode._getMaxRowCount(), 14, "maxRowCount is calculated based on available space");

		oMode.setMaxRowCount(15);
		assert.strictEqual(oMode._getMaxRowCount(), 15, "_getMaxRowCount returns the correct value");

		Device.resize.height = iOriginalDeviceHeight;
	});

	QUnit.test("Drag&Drop", function(assert) {
		const oAnnounceChangeSpy = sinon.spy(InvisibleMessage.prototype, "announce");
		const oResizerDomRef = this.oTable.getDomRef("heightResizer");
		const oMode = this.oTable.getRowMode();

		const fnTestTextSelection = (bDuringResize) => {
			const oEvent = jQuery.Event({type: "selectstart"});
			oEvent.target = this.oTable.getDomRef();
			this.oTable.$().trigger(oEvent);
			assert.ok(oEvent.isDefaultPrevented() && bDuringResize || !oEvent.isDefaultPrevented() && !bDuringResize,
				"Prevent Default of selectstart event");
			assert.ok(oEvent.isPropagationStopped() && bDuringResize || !oEvent.isPropagationStopped() && !bDuringResize,
				"Stopped Propagation of selectstart event");
			const sUnselectable = jQuery(document.body).attr("unselectable") || "off";
			assert.ok(sUnselectable === (bDuringResize ? "on" : "off"), "Text Selection switched " + (bDuringResize ? "off" : "on"));
		};

		let iY = oResizerDomRef.getBoundingClientRect().top + 10;

		assert.equal(oMode.getActualRowCount(), 10, "Initial row count");
		qutils.triggerMouseEvent(oResizerDomRef, "mousedown", 0, 0, 10, iY, 0);
		assert.ok(oResizerDomRef.classList.contains("sapUiTableHeightResizerActive"), "The resizer is active");
		fnTestTextSelection(true);

		for (let i = 0; i < 10; i++) {
			iY += 10;
			document.dispatchEvent(new MouseEvent("mousemove", {clientX: 10, clientY: iY}));
			assert.equal(oResizerDomRef.style.top, (i + 1) * 10 + "px", "Top position is set");
		}
		document.dispatchEvent(new MouseEvent("mouseup", {clientX: 10, clientY: iY + 10}));

		assert.equal(oMode.getActualRowCount(), 12, "Row count after resize");
		assert.notOk(oResizerDomRef.classList.contains("sapUiTableHeightResizerActive"), "The resizer is not active");
		assert.equal(oResizerDomRef.style.top, "", "Top position is set to empty");
		assert.ok(oAnnounceChangeSpy.calledOnceWithExactly(TableUtils.getResourceText("TBL_RSZ_RESIZED", [12])),
			"Resize is announced with the correct number of rows");
		oAnnounceChangeSpy.restore();
		fnTestTextSelection(false);
	});

	QUnit.test("Auto-resize", function(assert) {
		const oAnnounceChangeSpy = sinon.spy(InvisibleMessage.prototype, "announce");
		const oResizerDomRef = this.oTable.getDomRef("heightResizer");
		const oMode = this.oTable.getRowMode();
		oMode.setMaxRowCount(15);

		let iRowCount = 10;
		assert.equal(oMode.getActualRowCount(), iRowCount, "Initial row count");
		qutils.triggerMouseEvent(oResizerDomRef, "dblclick");
		iRowCount = oMode.getMaxRowCount();
		assert.equal(oMode.getActualRowCount(), iRowCount, "Table is auto-resized to maxRowCount");
		assert.ok(oAnnounceChangeSpy.calledOnceWithExactly(TableUtils.getResourceText("TBL_RSZ_RESIZED", [iRowCount])),
			"Resize is announced with the correct number of rows");
		oAnnounceChangeSpy.resetHistory();

		qutils.triggerMouseEvent(oResizerDomRef, "dblclick");
		iRowCount = oMode.getMinRowCount();
		assert.equal(oMode.getActualRowCount(), iRowCount, "Table is auto-resized to minRowCount");
		assert.ok(oAnnounceChangeSpy.calledOnceWithExactly(TableUtils.getResourceText("TBL_RSZ_RESIZED", [iRowCount])),
			"Resize is announced with the correct number of rows");
		oAnnounceChangeSpy.resetHistory();

		qutils.triggerMouseEvent(oResizerDomRef, "dblclick");
		iRowCount = 10;
		assert.equal(oMode.getActualRowCount(), iRowCount, "Table is auto-resized to initial row count");
		assert.ok(oAnnounceChangeSpy.calledOnceWithExactly(TableUtils.getResourceText("TBL_RSZ_RESIZED", [iRowCount])),
			"Resize is announced with the correct number of rows");
		oAnnounceChangeSpy.restore();
	});

	QUnit.test("Context menu", function(assert) {
		const oResizerDomRef = this.oTable.getDomRef("heightResizer");
		const oMode = this.oTable.getRowMode();
		oMode.setMaxRowCount(15);
		let iRowCount = oMode.getActualRowCount();

		oResizerDomRef.focus();
		qutils.triggerMouseEvent(oResizerDomRef, "contextmenu");
		assert.ok(oResizerDomRef.classList.contains("sapUiTableHeightResizerActive"), "The resizer is active");
		const oMenu = Element.closestTo(".sapMMenu");
		const aMenuItems = oMenu.getItems();
		assert.ok(oMenu, "The context menu is rendered");
		assert.ok(oMenu.isOpen(), "The context menu is open");

		assert.equal(aMenuItems[0].getText(), TableUtils.getResourceText("TBL_RSZ_ROW_UP"), "Item 1 has the correct text");
		assert.equal(aMenuItems[0].getShortcutText(), TableUtils.getResourceText("TBL_RSZ_ROW_UP_SHORTCUT"),
			"Item 1 has the correct shortcut text");
		qutils.triggerMouseEvent(aMenuItems[0].getDomRef(), "click");
		iRowCount--;
		assert.equal(oMode.getActualRowCount(), iRowCount, "On menu item press row count decreases by 1");

		qutils.triggerMouseEvent(oResizerDomRef, "contextmenu");
		assert.equal(aMenuItems[1].getText(), TableUtils.getResourceText("TBL_RSZ_ROW_DOWN"), "Item 2 has the correct text");
		assert.equal(aMenuItems[1].getShortcutText(), TableUtils.getResourceText("TBL_RSZ_ROW_DOWN_SHORTCUT"),
			"Item 2 has the correct shortcut text");
		qutils.triggerMouseEvent(aMenuItems[1].getDomRef(), "click");
		iRowCount++;
		assert.equal(oMode.getActualRowCount(), iRowCount, "On menu item press row count increases by 1");

		qutils.triggerMouseEvent(oResizerDomRef, "contextmenu");
		assert.equal(aMenuItems[2].getText(), TableUtils.getResourceText("TBL_RSZ_MINIMIZE"), "Item 3 has the correct text");
		assert.equal(aMenuItems[2].getShortcutText(), TableUtils.getResourceText("TBL_RSZ_MINIMIZE_SHORTCUT"),
			"Item 3 has the correct shortcut text");
		qutils.triggerMouseEvent(aMenuItems[2].getDomRef(), "click");
		assert.equal(oMode.getActualRowCount(), oMode.getMinRowCount(), "On menu item press row count increases to minRowCount");

		qutils.triggerMouseEvent(oResizerDomRef, "contextmenu");
		assert.equal(aMenuItems[3].getText(), TableUtils.getResourceText("TBL_RSZ_MAXIMIZE"), "Item 4 has the correct text");
		assert.equal(aMenuItems[3].getShortcutText(), TableUtils.getResourceText("TBL_RSZ_MAXIMIZE_SHORTCUT"),
			"Item 4 has the correct shortcut text");
		qutils.triggerMouseEvent(aMenuItems[3].getDomRef(), "click");
		assert.equal(oMode.getActualRowCount(), oMode.getMaxRowCount(), "On menu item press row count increases to maxRowCount");

		assert.notOk(oResizerDomRef.classList.contains("sapUiTableHeightResizerActive"), "The resizer is not active");
		assert.notOk(oMenu.isOpen(), "The context menu is closed");
	});

	QUnit.test("Keyboard interaction", function(assert) {
		const oAnnounceChangeSpy = sinon.spy(InvisibleMessage.prototype, "announce");
		const oResizerDomRef = this.oTable.getDomRef("heightResizer");
		const oMode = this.oTable.getRowMode();
		oMode.setMaxRowCount(15);
		let iRowCount = oMode.getActualRowCount();

		oResizerDomRef.focus();
		qutils.triggerKeydown(oResizerDomRef, KeyCodes.ARROW_UP);
		iRowCount--;
		assert.equal(oMode.getActualRowCount(), iRowCount, "On ArrowUp press row count decreases by 1");
		assert.ok(oAnnounceChangeSpy.calledOnceWithExactly(TableUtils.getResourceText("TBL_RSZ_RESIZED", [iRowCount])),
			"Resize is announced with the correct number of rows");
		oAnnounceChangeSpy.resetHistory();

		qutils.triggerKeydown(oResizerDomRef, KeyCodes.ARROW_DOWN);
		iRowCount++;
		assert.equal(oMode.getActualRowCount(), iRowCount, "On ArrowDown press row count increases by 1");
		assert.ok(oAnnounceChangeSpy.calledOnceWithExactly(TableUtils.getResourceText("TBL_RSZ_RESIZED", [iRowCount])),
			"Resize is announced with the correct number of rows");
		oAnnounceChangeSpy.resetHistory();

		qutils.triggerKeydown(oResizerDomRef, KeyCodes.HOME);
		iRowCount = oMode.getMinRowCount();
		assert.equal(oMode.getActualRowCount(), iRowCount, "On Home press row count decreases to minRowCount");
		assert.ok(oAnnounceChangeSpy.calledOnceWithExactly(TableUtils.getResourceText("TBL_RSZ_RESIZED", [iRowCount])),
			"Resize is announced with the correct number of rows");

		oAnnounceChangeSpy.resetHistory();
		qutils.triggerKeydown(oResizerDomRef, KeyCodes.END);
		iRowCount = oMode.getMaxRowCount();
		assert.equal(oMode.getActualRowCount(), iRowCount, "On End press row count increases to maxRowCount");
		assert.ok(oAnnounceChangeSpy.calledOnceWithExactly(TableUtils.getResourceText("TBL_RSZ_RESIZED", [iRowCount])),
			"Resize is announced with the correct number of rows");

		oAnnounceChangeSpy.restore();
	});

	FixedRowHeightTest.registerTo(QUnit);

	RowCountConstraintsTest.test("Force fixed rows if row count too low", function(assert) {
		this.oRowMode.setRowCount(1);
		this.oRowMode.setMinRowCount(1);
		this.oTable._setRowCountConstraints({fixedTop: true, fixedBottom: true});

		return this.oTable.qunit.whenRenderingFinished().then(function() {
			TableQUnitUtils.assertRenderedRows(assert, this.oTable, 0, 1, 0);
		}.bind(this));
	});

	RowCountConstraintsTest.registerTo(QUnit);
	RowsUpdatedTest.registerTo(QUnit);
});