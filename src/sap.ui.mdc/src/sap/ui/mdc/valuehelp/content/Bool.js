/*!
 * ${copyright}
 */

sap.ui.define([
	"sap/ui/mdc/valuehelp/content/FixedList", "sap/ui/mdc/util/loadModules", "sap/ui/model/ParseException"
], (
	FixedList,
	loadModules,
	ParseException
) => {
	"use strict";

	/**
	 * Constructor for a new <code>Bool</code> content.
	 *
	 * @param {string} [sId] ID for the new element, generated automatically if no ID is given
	 * @param {object} [mSettings] Initial settings for the new element
	 * @class Content for the {@link sap.ui.mdc.valuehelp.base.Container Container} element to provide a value help for boolean fields.
	 * @extends sap.ui.mdc.valuehelp.content.FixedList
	 * @version ${version}
	 * @constructor
	 * @private
	 * @ui5-restricted sap.ui.mdc
	 * @since 1.95.0
	 * @alias sap.ui.mdc.valuehelp.content.Bool
	 */
	const Bool = FixedList.extend("sap.ui.mdc.valuehelp.content.Bool", /** @lends sap.ui.mdc.valuehelp.content.Bool.prototype */ {
		metadata: {
			library: "sap.ui.mdc",
			interfaces: [
				"sap.ui.mdc.valuehelp.base.ITypeaheadContent"
			]
		}
	});

	Bool.prototype.init = function() {

		FixedList.prototype.init.apply(this, arguments);

		this.setUseFirstMatch(true); // as only 2 items
		this.setUseAsValueHelp(true); // should be used as value help
		this.setFilterList(false); // as only 2 items
		this.setCaseSensitive(false); // as only 2 items

		this._oObserver.observe(this, {
			properties: ["config"]
		});

		this.setEmptyText(this._oResourceBundle.getText("valuehelp.NOT_SELECTED"));
		this.setRestrictedToFixedValues(true);

	};

	Bool.prototype.exit = function() {

		if (this._oModel) {
			this._oModel.destroy();
			this._oModel = undefined;
		}

		FixedList.prototype.exit.apply(this, arguments);
	};

	Bool.prototype.getContent = function() {
		return this._retrievePromise("boolContent", () => {
			return loadModules([
				"sap/ui/mdc/valuehelp/content/FixedListItem", "sap/ui/model/json/JSONModel"
			]).then(function(aModules) {

				if (this.isDestroyStarted()) {
					return null;
				}

				const [FixedListItem, JSONModel] = aModules;
				this._oModel = new JSONModel({
					"type": "",
					"items": [{
						"key": true
					},
					{
						"key": false
					}]
				});

				const fFormatKey = (vKey) => { // use formatter function as type isset late an can change
					const oConfig = this.getConfig();
					return oConfig?.dataType?.formatValue(vKey, "string");
				};

				const oItem = new FixedListItem(this.getId() + "-Item", {
					key: { path: "$Bool>key", formatter: fFormatKey }, // as Item has Data-Type String, key needs to be formatted using Type, in FixedList the internalValue is used for Condition
					text: { path: "$Bool>key", formatter: fFormatKey } // text is the same
				});

				this.bindAggregation("items", { path: "$Bool>/items", template: oItem });
				this.setModel(this._oModel, "$Bool");

				return FixedList.prototype.getContent.apply(this, arguments);
			}.bind(this));
		});

	};

	Bool.prototype.getItemForValue = function(oConfig) {

		return Promise.resolve().then(() => {
			// don't need to create items for this, just use the type to check
			const oGlobalConfig = this.getConfig();
			const oType = oConfig.dataType || (oGlobalConfig && oGlobalConfig.dataType);

			if (oType) {
				if (oConfig.checkKey) {
					if (oConfig.parsedValue === true || oConfig.parsedValue === false) {
						return { key: oConfig.parsedValue, description: oType.formatValue(oConfig.parsedValue, "string") };
					} else if (oConfig.parsedValue === null) {
						// check if there is an empty-description
						if (oConfig.emptyAllowed) {
							return { key: null, description: this._oResourceBundle.getText("valuehelp.NOT_SELECTED") };
						}
					} else {
						// as in bool case the description is comming from the type, search for description (first match) if parsing fails
						oConfig.checkDescription = true;
					}
				}
				if (oConfig.checkDescription && oConfig.value) {
					const sTrue = oType.formatValue(true, "string");
					if (sTrue.toLowerCase().startsWith(oConfig.value.toLowerCase())) {
						return { key: true, description: sTrue };
					}
					const sFalse = oType.formatValue(false, "string");
					if (sFalse.toLowerCase().startsWith(oConfig.value.toLowerCase())) {
						return { key: false, description: sFalse };
					}
				}
				const sError = this._oResourceBundle.getText("valuehelp.VALUE_NOT_EXIST", [oConfig.value]);
				const Exception = oConfig.exception || ParseException;
				throw new Exception(sError);
			} else {
				throw new Error("Type missing");
			}
		});

	};

	Bool.prototype.isNavigationEnabled = function(iStep) {

		return true; // always enable, even if items are created lately on opening or navigation

	};

	Bool.prototype.observeChanges = function(oChanges) {

		if (oChanges.name === "config" && (oChanges.current?.dataType !== oChanges.old?.dataType)) {
			_updateModel.call(this, oChanges.current);
		}

		FixedList.prototype.observeChanges.apply(this, arguments);
	};

	function _updateModel(oConfig) {

		this._oModel?.checkUpdate(true);

	}

	/**
	 * Adds some item to the aggregation <code>items</code>.
	 *
	 * <b>Note:</b> Do not add items to the <code>Bool</code> content. The items will be filled by <code>Bool</code> itself.
	 *
	 * @param {sap.ui.mdc.valuehelp.content.FixedListItem} oItem The item to add; if empty, nothing is inserted
	 * @returns {this} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @ui5-restricted sap.fe
	 * @deprecated Not supported, the items are automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#addItem
	 * @function
	 */

	/**
	 * Inserts a item to the aggregation <code>items</code>.
	 *
	 * <b>Note:</b> Do not add items to the <code>Bool</code> content. The items will be filled by <code>Bool</code> itself.
	 *
	 * @param {sap.ui.mdc.valuehelp.content.FixedListItem} oItem The item to add; if empty, nothing is inserted
	 * @param {int} iIndex The 0-based index the item should be inserted at; for a negative value of iIndex, the item is inserted at position 0; for a value greater than the current size of the aggregation, the item is inserted at the last position
	 * @returns {this} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @ui5-restricted sap.fe
	 * @deprecated Not supported, the items are automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#insertItem
	 * @function
	 */

	/**
	 * Destroys all the items in the aggregation <code>items</code>.
	 *
	 * <b>Note:</b> Do not change items to the <code>Bool</code> content. The items will be filled by <code>Bool</code> itself.
	 *
	 * @returns {this} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @ui5-restricted sap.fe
	 * @deprecated Not supported, the items are automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#destroyItems
	 * @function
	 */

	/**
	 * Removes all the controls from the aggregation <code>items</code>.
	 *
	 * <b>Note:</b> Do not change items to the <code>Bool</code> content. The items will be filled by <code>Bool</code> itself.
	 *
	 * @returns {sap.ui.mdc.valuehelp.content.FixedListItem[]} An array of the removed elements (might be empty)
	 * @private
	 * @ui5-restricted sap.fe
	 * @deprecated Not supported, the items are automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#removeAllItems
	 * @function
	 */

	/**
	 * Removes a item from the aggregation <code>items</code>.
	 *
	 * <b>Note:</b> Do not change items to the <code>Bool</code> content. The items will be filled by <code>Bool</code> itself.
	 *
	 * @param {int|string|sap.ui.mdc.valuehelp.content.FixedListItem} vItem The item to remove or its index or ID
	 * @returns {sap.ui.mdc.valuehelp.content.FixedListItem|null} The removed item or <code>null</code>
	 * @private
	 * @ui5-restricted sap.fe
	 * @deprecated Not supported, the items are automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#removeItem
	 * @function
	 */

	/**
	 * Sets a new value for property <code>useFirstMatch</code>.
	 *
	 * <b>Note:</b> Do not set this property for the <code>Bool</code> content. It will be set by <code>Bool</code> itself.
	 *
	 * @param {boolean} [bUseFirstMatch=true] New value for property <code>useFirstMatch</code>
	 * @returns {this} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @ui5-restricted sap.fe
	 * @deprecated Not supported, the property is automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#setUseFirstMatch
	 * @function
	 */

	/**
	 * Sets a new value for property <code>useAsValueHelp</code>.
	 *
	 * <b>Note:</b> Do not set this property for the <code>Bool</code> content. It will be set by <code>Bool</code> itself.
	 *
	 * @param {boolean} [bUseAsValueHelp=true] New value for property <code>useAsValueHelp</code>
	 * @returns {this} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @ui5-restricted sap.fe
	 * @deprecated Not supported, the property is automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#setUseAsValueHelp
	 * @function
	 */

	/**
	 * Sets a new value for property <code>filterList</code>.
	 *
	 * <b>Note:</b> Do not set this property for the <code>Bool</code> content. It will be set by <code>Bool</code> itself.
	 *
	 * @param {boolean} [bFilterList=false] New value for property <code>filterList</code>
	 * @returns {this} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @ui5-restricted sap.fe
	 * @deprecated Not supported, the property is automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#setFilterList
	 * @function
	 */

	/**
	 * Sets a new value for property <code>caseSensitive</code>.
	 *
	 * <b>Note:</b> Do not set this property for the <code>Bool</code> content. It will be set by <code>Bool</code> itself.
	 *
	 * @param {boolean} [bCaseSensitive=false] New value for property <code>caseSensitive</code>
	 * @returns {this} Reference to <code>this</code> to allow method chaining
	 * @private
	 * @ui5-restricted sap.fe
	 * @deprecated Not supported, the property is automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#setCaseSensitive
	 * @function
	 */

	/**
	 * Sets a new value for property <code>emptyText</code>.
	 *
	 * <b>Note:</b> Do not set this property for the <code>Bool</code> content. It will be set by <code>Bool</code> itself.
	 *
	 * @param {string} [sText] New value for property <code>emptyText</code>
	 * @returns {this} Reference to <code>this</code> to allow method chaining
	 * @public
	 * @since 1.138
	 * @deprecated As of version 1.138, setting of this property is not supported, the property is automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#setEmptyText
	 * @function
	 */

	/**
	 * Sets a new value for property <code>cestrictedToFixedValues</code>.
	 *
	 * <b>Note:</b> Do not set this property for the <code>Bool</code> content. It will be set by <code>Bool</code> itself.
	 *
	 * @param {boolean} [bnlyFixedValuesAllowed=false] New value for property <code>restrictedToFixedValues</code>
	 * @returns {this} Reference to <code>this</code> to allow method chaining
	 * @public
	 * @since 1.138
	 * @deprecated As of version 1.138, setting of this property is not supported, the property is automatically set.
	 * @ui5-not-supported
	 * @name sap.ui.mdc.valuehelp.content.Bool#setRestrictedToFixedValues
	 * @function
	 */

	return Bool;
});