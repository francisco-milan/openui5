sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	var Component = UIComponent.extend("my.component.sample.componentPreload.Component", {
		metadata: {
			manifest: "json"
		}
	});

	return Component;
});
