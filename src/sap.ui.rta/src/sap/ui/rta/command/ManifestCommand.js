/*!
 * ${copyright}
 */
sap.ui.define([
	"sap/ui/rta/command/BaseCommand",
	"sap/ui/fl/descriptorRelated/api/DescriptorChange",
	"sap/ui/fl/write/api/ChangesWriteAPI"
], function(
	BaseCommand,
	DescriptorChange,
	ChangesWriteAPI
) {
	"use strict";

	/**
	 * Implementation of a command template for manifest changes
	 *
	 * @class
	 * @extends sap.ui.rta.command.BaseCommand
	 *
	 * @author SAP SE
	 * @version ${version}
	 *
	 * @constructor
	 * @private
	 * @since 1.49
	 * @alias sap.ui.rta.command.ManifestCommand
	 */
	const ManifestCommand = BaseCommand.extend("sap.ui.rta.command.ManifestCommand", {
		metadata: {
			library: "sap.ui.rta",
			properties: {
				reference: {
					type: "string"
				},
				appComponent: {
					type: "object"
				},
				layer: {
					type: "string"
				},
				changeType: {
					type: "string"
				},
				parameters: {
					type: "object"
				},
				texts: {
					type: "object"
				}
			},
			events: {}
		}
	});

	/**
	 * For manifest commands to take effect usually the app needs to be restarted as server-side processing is involved.
	 */
	ManifestCommand.prototype.needsReload = true;

	/**
	 * Prepare the manifest change, setting the layer.
	 * @param  {object} mFlexSettings - Map of flex settings
	 * @param  {string} mFlexSettings.layer - Layer where the change is applied
	 * @returns {boolean} <code>true</true>
	 */
	ManifestCommand.prototype.prepare = function(mFlexSettings) {
		this.setLayer(mFlexSettings.layer);
		return true;
	};

	/**
	 * Retrieves the prepared change for e.g. undo execution.
	 * @return {sap.ui.fl.apply._internal.flexObjects.UIChange} Returns change after being created and stored
	 */
	ManifestCommand.prototype.getPreparedChange = function() {
		return this._oPreparedChange;
	};

	ManifestCommand.prototype.setCompositeId = function(sCompositeId) {
		this._sCompositeId = sCompositeId;
	};

	/**
	 * Create the change for the manifest and adds it to the Flex Persistence.
	 * @return {Promise} Returns Promise resolving after change has been created and stored
	 */
	ManifestCommand.prototype.createAndStoreChange = async function() {
		const oManifestChange = await ChangesWriteAPI.create({
			changeSpecificData: {
				changeType: this.getChangeType(),
				content: this.getParameters(),
				texts: this.getTexts(),
				support: {
					compositeCommand: this._sCompositeId || ""
				},
				reference: this.getReference(),
				layer: this.getLayer()
			},
			selector: this.getAppComponent(),
			generator: "sap.ui.rta.ManifestCommand"
		});
		if (!(oManifestChange instanceof DescriptorChange)) {
			throw new Error(`With the given changeSpecificData, no manifest change could be created. Provided change content: ${JSON.stringify(this.getParameters())} and change type: ${this.getChangeType()}.`);
		}
		const oChange = oManifestChange.store();
		this._oPreparedChange = oChange;
	};
	return ManifestCommand;
});