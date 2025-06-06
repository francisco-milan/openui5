/*global QUnit*/

sap.ui.define([
	"sap/ui/table/qunit/TableQUnitUtils.ODataV4",
	"sap/ui/table/utils/TableUtils",
	"sap/ui/table/rowmodes/Fixed",
	"sap/ui/table/plugins/ODataV4Selection",
	"sap/ui/table/plugins/V4Aggregation",
	"sap/ui/core/IconPool"
], function(
	TableQUnitUtils,
	TableUtils,
	FixedRowMode,
	ODataV4Selection,
	V4Aggregation,
	IconPool
) {
	"use strict";

	TableQUnitUtils.setDefaultSettings({
		dependents: [
			new ODataV4Selection(),
			new V4Aggregation()
		],
		rows: {
			path: "/BusinessPartners",
			parameters: {
				$count: false,
				$orderby: "Country desc,Region desc,Segment,AccountResponsible",
				$$aggregation: {
					aggregate: {
						SalesAmountLocalCurrency: {
							grandTotal: true,
							subtotals: true,
							unit: "LocalCurrency"
						},
						SalesNumber: {}
					},
					grandTotalAtBottomOnly: true,
					subtotalsAtBottomOnly: true,
					group: {
						AccountResponsible: {},
						Country_Code: {additionally: ["Country"]},
						Region: {},
						Segment: {}
					},
					groupLevels: ["Country_Code", "Region", "Segment"]
				}
			},
			suspended: true
		},
		columns: [
			TableQUnitUtils.createTextColumn({label: "Country", text: "Country", bind: true}),
			TableQUnitUtils.createTextColumn({label: "Region", text: "Region", bind: true}),
			TableQUnitUtils.createTextColumn({label: "Local Currency", text: "LocalCurrency", bind: true})
		],
		models: TableQUnitUtils.createModelForDataAggregationService(),
		rowMode: new FixedRowMode({
			rowCount: 5,
			fixedBottomRowCount: 1
		}),
		threshold: 0
	});

	QUnit.module("Selection API", {
		beforeEach: async function() {
			this.oTable = await TableQUnitUtils.createTable(function(oTable) {
				oTable.getBinding().resume();
			});
			this.oSelectionPlugin = this.oTable.getDependents()[0];
			this.oSelectionChangeHandler = this.spy();
			this.oSelectionPlugin.attachSelectionChange(this.oSelectionChangeHandler);
			await this.oTable.qunit.whenBindingChange();
			await this.oTable.qunit.whenRenderingFinished();
		},
		afterEach: function() {
			this.oTable.destroy();
		}
	});

	QUnit.test("#getSelectedContexts", async function(assert) {
		const aRows = this.oTable.getRows();

		assert.deepEqual(this.oSelectionPlugin.getSelectedContexts(), [], "No contexts selected");

		aRows[2].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(6);
		await this.oTable.qunit.whenBindingChange();
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(9);
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(11);
		await this.oTable.qunit.whenRenderingFinished();

		aRows[2].getBindingContext().setSelected(true);
		assert.deepEqual(this.oSelectionPlugin.getSelectedContexts(), [aRows[2].getBindingContext()]);
	});

	QUnit.test("#setSelected", async function(assert) {
		const aRows = this.oTable.getRows();

		this.oSelectionPlugin.setSelected(aRows[0]);
		this.oSelectionPlugin.setSelected(aRows[1]);
		this.oSelectionPlugin.setSelected(aRows[4]);
		await TableQUnitUtils.wait(10);
		assert.equal(this.oSelectionChangeHandler.callCount, 0, "selectionChange event");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[0]), false, "Row 2 is not selected (group header row)");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[3]), false, "Row 1 is not selected (sum row)");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[4]), false, "Row 5 is not selected (empty row)");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 0, "Selected contexts");

		aRows[2].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(6);
		await this.oTable.qunit.whenBindingChange();
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(9);
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(11);
		await this.oTable.qunit.whenRenderingFinished();

		this.oSelectionPlugin.setSelected(aRows[2], true);
		this.oSelectionPlugin.setSelected(aRows[3], true);
		await TableQUnitUtils.nextEvent("selectionChange", this.oSelectionPlugin);
		assert.equal(this.oSelectionChangeHandler.callCount, 1, "selectionChange event");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[2]), true, "Row 4 is selected (leaf)");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[3]), true, "Row 5 is selected (leaf)");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 2, "Selected contexts");
	});

	QUnit.test("#clearSelection", async function(assert) {
		const aRows = this.oTable.getRows();

		aRows[2].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(6);
		await this.oTable.qunit.whenBindingChange();
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(9);
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(11);
		await this.oTable.qunit.whenRenderingFinished();

		this.oSelectionPlugin.setSelected(aRows[2], true);
		await TableQUnitUtils.nextEvent("selectionChange", this.oSelectionPlugin);
		this.oSelectionChangeHandler.resetHistory();
		this.oSelectionPlugin.clearSelection();
		await TableQUnitUtils.nextEvent("selectionChange", this.oSelectionPlugin);
		assert.equal(this.oSelectionChangeHandler.callCount, 1, "selectionChange event");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 0, "Selected contexts");
	});

	QUnit.test("#onHeaderSelectorPress", async function(assert) {
		const aRows = this.oTable.getRows();

		aRows[2].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(6);
		await this.oTable.qunit.whenBindingChange();
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(9);
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(12);
		await this.oTable.qunit.whenRenderingFinished();

		this.oSelectionPlugin.onHeaderSelectorPress();
		await TableQUnitUtils.nextEvent("selectionChange", this.oSelectionPlugin);
		assert.equal(this.oSelectionChangeHandler.callCount, 1, "selectionChange event");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 2, "Selected contexts");
		assert.ok(aRows[1].getBindingContext() === this.oSelectionPlugin.getSelectedContexts()[0], "1st elected context is related to correct row");
		assert.ok(aRows[2].getBindingContext() === this.oSelectionPlugin.getSelectedContexts()[1], "2nd selected context is related to correct row");

		this.oSelectionChangeHandler.resetHistory();
		aRows[0].collapse();
		await this.oTable.qunit.whenRenderingFinished();
		assert.equal(this.oSelectionChangeHandler.callCount, 0, "Node collapsed: selectionChange event");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 0, "Node collapse: Selected contexts");

		this.oSelectionChangeHandler.resetHistory();
		aRows[0].expand();
		await this.oTable.qunit.whenRenderingFinished();
		assert.equal(this.oSelectionChangeHandler.callCount, 0, "Node expanded: selectionChange event");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 0, "Node expanded: Selected contexts");
	});

	QUnit.module("Binding selection API", {
		beforeEach: async function() {
			this.oTable = await TableQUnitUtils.createTable(function(oTable) {
				oTable.getBinding().resume();
			});
			this.oSelectionPlugin = this.oTable.getDependents()[0];
			this.oSelectionChangeHandler = this.spy();
			this.oSelectionPlugin.attachSelectionChange(this.oSelectionChangeHandler);

			await this.oTable.qunit.whenBindingChange();
			await this.oTable.qunit.whenRenderingFinished();

			this.oTable.getRows()[2].expand();
			await this.oTable.qunit.whenNextRenderingFinished();
			this.oTable.setFirstVisibleRow(6);
			await this.oTable.qunit.whenBindingChange();
			await this.oTable.qunit.whenRenderingFinished();
			this.oTable.getRows()[3].expand();
			await this.oTable.qunit.whenNextRenderingFinished();
			this.oTable.setFirstVisibleRow(9);
			await this.oTable.qunit.whenRenderingFinished();
			this.oTable.getRows()[3].expand();
			await this.oTable.qunit.whenNextRenderingFinished();
			this.oTable.setFirstVisibleRow(11);
			await this.oTable.qunit.whenRenderingFinished();
		},
		afterEach: function() {
			this.oTable.destroy();
		}
	});

	QUnit.test("Context#setSelected", async function(assert) {
		const aRows = this.oTable.getRows();

		aRows[2].getBindingContext().setSelected(true);
		aRows[3].getBindingContext().setSelected(true);
		await TableQUnitUtils.nextEvent("selectionChange", this.oSelectionPlugin);
		assert.equal(this.oSelectionChangeHandler.callCount, 1, "Select leaf row: selectionChange event");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[2]), true, "Select leaf row: #isSelected (Row 3)");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[3]), true, "Select leaf row: #isSelected (Row 4)");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 2, "Select leaf row: Selected contexts");

		this.oSelectionChangeHandler.resetHistory();
		aRows[2].getBindingContext().setSelected(true);
		await TableQUnitUtils.wait(10);
		assert.equal(this.oSelectionChangeHandler.callCount, 0, "Select same row: selectionChange event");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[2]), true, "Select same row: #isSelected (Row 3)");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[3]), true, "Select same row: #isSelected (Row 4)");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 2, "Select same row: Selected contexts");

		this.oSelectionChangeHandler.resetHistory();
		aRows[3].getBindingContext().setSelected(false);
		await TableQUnitUtils.nextEvent("selectionChange", this.oSelectionPlugin);
		assert.equal(this.oSelectionChangeHandler.callCount, 1, "Deselect leaf row: selectionChange event");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[2]), true, "Deselect leaf row: #isSelected (Row 3)");
		assert.strictEqual(this.oSelectionPlugin.isSelected(aRows[3]), false, "Deselect leaf row: #isSelected (Row 4)");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 1, "Deselect leaf row: Selected contexts");

		this.oSelectionChangeHandler.resetHistory();
		assert.throws(
			() => {
				aRows[0].getBindingContext().setSelected(true);
			},
			"Select group header row"
		);
		assert.equal(aRows[0].getBindingContext().isSelected(), false, "Select group header row: Context selected state");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 1, "Select group header row: Selected contexts");
		await TableQUnitUtils.wait(10);
		assert.equal(this.oSelectionChangeHandler.callCount, 1, "Select group header row: selectionChange event");

		this.oSelectionChangeHandler.resetHistory();
		assert.throws(
			() => {
				aRows[4].getBindingContext().setSelected(true);
			},
			"Select sum row"
		);
		assert.equal(aRows[4].getBindingContext().isSelected(), false, "Select group header row: Context selected state");
		assert.equal(this.oSelectionPlugin.getSelectedContexts().length, 1, "Select group header row: Selected contexts");
		await TableQUnitUtils.wait(10);
		assert.equal(this.oSelectionChangeHandler.callCount, 1, "Select sum row: selectionChange event");
	});

	QUnit.module("Header selector icon", {
		beforeEach: async function() {
			this.oTable = await TableQUnitUtils.createTable(function(oTable) {
				oTable.getBinding().resume();
			});
			this.oSelectionPlugin = this.oTable.getDependents()[0];
			await this.oTable.qunit.whenBindingChange();
			await this.oTable.qunit.whenRenderingFinished();
		},
		afterEach: function() {
			this.oTable.destroy();
		},
		/**
		 * Asserts the state of the header selector cell, including the icon.
		 *
		 * @param {object} mAttributes The expected attributes
		 * @param {string} mAttributes.src The expected icon source
		 * @param {string} mAttributes.title The expected value of the 'title' attribute
		 * @param {boolean} [mAttributes.disabled=false] The expected value of the 'aria-disabled' attribute
		 */
		assertHeaderSelector: function(mAttributes) {
			const oIcon = this.oSelectionPlugin.getAggregation("icon");
			const oHeaderSelectorCell = this.oTable.qunit.getSelectAllCell();

			QUnit.assert.strictEqual(oIcon.getUseIconTooltip(), false, "Icon 'useIconToolTip' property");
			QUnit.assert.strictEqual(oIcon.getSrc(), mAttributes.src, "Icon 'src' property");
			QUnit.assert.ok(oIcon.hasStyleClass("sapUiTableSelectClear"), "Icon style class");
			QUnit.assert.strictEqual(oHeaderSelectorCell.getAttribute("title"), mAttributes.title,
				"HeaderSelector cell 'title' attribute");
			QUnit.assert.strictEqual(oHeaderSelectorCell.getAttribute("aria-disabled"), mAttributes.disabled ? "true" : null,
				"HeaderSelector cell 'aria-disabled' attribute");
		}
	});

	QUnit.test("All contexts selected", async function(assert) {
		const aRows = this.oTable.getRows();

		aRows[2].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(6);
		await this.oTable.qunit.whenBindingChange();
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(9);
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(11);
		await this.oTable.qunit.whenRenderingFinished();

		(await TableUtils.loadContexts(this.oTable.getBinding(), 0, this.oTable.getBinding().getLength())).filter((oContext) => {
			const bIsLeaf = oContext.getProperty("@$ui5.node.isExpanded") === undefined;
			const bIsTotal = oContext.getProperty("@$ui5.node.isTotal");
			return bIsLeaf && !bIsTotal;
		}).forEach((oContext) => {
			oContext.setSelected(true);
		});
		await TableQUnitUtils.nextEvent("selectionChange", this.oSelectionPlugin);

		this.assertHeaderSelector({
			src: IconPool.getIconURI(TableUtils.ThemeParameters.clearSelectionIcon),
			title: TableUtils.getResourceText("TBL_DESELECT_ALL")
		});
	});

	QUnit.test("Visual grouping and sums", async function(assert) {
		const aRows = this.oTable.getRows();

		this.assertHeaderSelector({
			src: IconPool.getIconURI(TableUtils.ThemeParameters.checkboxIcon),
			title: TableUtils.getResourceText("TBL_SELECT_ALL")
		});

		aRows[2].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(6);
		await this.oTable.qunit.whenBindingChange();
		await this.oTable.qunit.whenRenderingFinished();
		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(9);
		await this.oTable.qunit.whenRenderingFinished();

		this.assertHeaderSelector({
			src: IconPool.getIconURI(TableUtils.ThemeParameters.checkboxIcon),
			title: TableUtils.getResourceText("TBL_SELECT_ALL")
		});

		aRows[3].expand();
		await this.oTable.qunit.whenNextRenderingFinished();
		this.oTable.setFirstVisibleRow(12);
		await this.oTable.qunit.whenRenderingFinished();

		this.assertHeaderSelector({
			src: IconPool.getIconURI(TableUtils.ThemeParameters.checkboxIcon),
			title: TableUtils.getResourceText("TBL_SELECT_ALL")
		});

		this.oSelectionPlugin.setSelected(aRows[1], true);
		await TableQUnitUtils.nextEvent("selectionChange", this.oSelectionPlugin);

		this.assertHeaderSelector({
			src: IconPool.getIconURI(TableUtils.ThemeParameters.clearSelectionIcon),
			title: TableUtils.getResourceText("TBL_DESELECT_ALL")
		});

		this.oSelectionPlugin.setSelected(aRows[2], true);
		await TableQUnitUtils.nextEvent("selectionChange", this.oSelectionPlugin);

		this.assertHeaderSelector({
			src: IconPool.getIconURI(TableUtils.ThemeParameters.clearSelectionIcon),
			title: TableUtils.getResourceText("TBL_DESELECT_ALL")
		});

		aRows[0].collapse();
		await this.oTable.qunit.whenNextRenderingFinished();

		this.assertHeaderSelector({
			src: IconPool.getIconURI(TableUtils.ThemeParameters.checkboxIcon),
			title: TableUtils.getResourceText("TBL_SELECT_ALL")
		});
	});
});