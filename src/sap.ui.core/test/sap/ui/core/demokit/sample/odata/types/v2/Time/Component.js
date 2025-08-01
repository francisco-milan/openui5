/*!
 * ${copyright}
 */
sap.ui.define(["sap/ui/core/UIComponent"],
	function (UIComponent) {
	"use strict";

	return UIComponent.extend("sap.ui.core.sample.odata.types.v2.Time.Component", {
		metadata: {
			interfaces: ["sap.ui.core.IAsyncContentCreation"],
			manifest: "json"
		},

		init() {
			UIComponent.prototype.init.apply(this, arguments);
			this.getModel().setData({
				Time: { ms: 41635000 , __edmType: 'Edm.Time' }
			});
		}
	});
});
