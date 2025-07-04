/*!
 * ${copyright}
 */

/* Utility class that facilitates route configuration handling */
sap.ui.define([
	"sap/ui/base/Object",
	"sap/base/strings/capitalize",
	"sap/ui/thirdparty/jquery",
	"sap/ui/documentation/sdk/util/Resources",
	"sap/base/Log"
], function (BaseObject, capitalize, jQuery, ResourcesUtil, Log) {
	"use strict";

	const STATIC_RESOURCE_PATH_KEYNAME = {
		BP_STATEMENT: "browserSupportPath",
		COOKIE_STATEMENT: "cookieStatementURI",
		PRIVACY_STATEMENT: "privacyStatementURI"
	};

	return BaseObject.extend("sap.ui.documentation.sdk.controller.util.ConfigUtil", {

		"COOKIE_NAMES": {
			"APPROVAL_REQUESTED": "dk_approval_requested",
			"ALLOW_FUNCTIONAL_COOKIES": "dk_allow_functional_cookies",
			"CONFIGURATION_APPEARANCE": "appearance",
			"DEMOKIT_IMPORTANT_MESSAGES_READ": "dk_important_messages_read"
		},

		"LOCAL_STORAGE_NAMES": {
			"OLD_NEWS_IDS": "dk_old_news_ids"
		},

		constructor : function (oComponent) {
			this._oComponent = oComponent;
		},

		hasMasterView: function(sRouteName) {
			var oRouteConfig = this._getRouteConfig(sRouteName),
				bIsSplitView = oRouteConfig && oRouteConfig.target.length === 2;
			return !!bIsSplitView;
		},

		/**
		 * Obtains the master view
		 * @param {string} sRouteName
		 * @returns {Promise<sap.ui.core.mvc.View>} The master view
		 */
		getMasterView: function(sRouteName) {
			var sMasterTargetName = this._getMasterTargetName(sRouteName),
				sTargetConfig = this._getTargetConfig(sMasterTargetName),
				sViewName = sTargetConfig.viewName;

			sViewName = "sap.ui.documentation.sdk.view." + capitalize(sViewName, 0);

			return this._oComponent.getRouter().getViews().getView({viewName: sViewName, type: "XML"});
		},

		setCookie: function (sCookieName, sValue) {
			var sExpiresDate,
				oDate = new Date();

			oDate.setTime(oDate.getTime() + (356 * 24 * 60 * 60 * 1000)); // one year
			sExpiresDate = "expires=" + oDate.toUTCString();

			document.cookie = sCookieName + "=" + sValue + ";" + sExpiresDate + ";path=/";
		},

		getCookieValue: function (sCookieName) {
			var aCookies = document.cookie.split(';'),
				sCookie;

			sCookieName = sCookieName + "=";

			for (var i = 0; i < aCookies.length; i++) {
				sCookie = aCookies[i].trim();

				if (sCookie.indexOf(sCookieName) === 0) {
					return sCookie.substring(sCookieName.length, sCookie.length);
				}
			}

			return "";
		},

		setLocalStorageItem: function (sItem, vValue) {
			window.localStorage.setItem(sItem, JSON.stringify(vValue));
		},

		getLocalStorageItem: function (sItem) {
			return JSON.parse(window.localStorage.getItem(sItem));
		},

		removeLocalStorageItem: function (sItem) {
			window.localStorage.removeItem(sItem);
		},

		unsetCookie: function (sCookieName) {
			document.cookie = `${sCookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		},

		_getMasterTargetName: function(sRouteName) {
			var oRouteConfig = this._getRouteConfig(sRouteName),
				bIsSplitView = oRouteConfig && oRouteConfig.target.length === 2,
				sMasterTarget = bIsSplitView && oRouteConfig.target[0];
			return sMasterTarget;
		},

		_getRouteConfig: function(sRouteName) {
			var oConfig = this._getSapUI5ConfigEntry(),
				aRoutes = oConfig.routing.routes;

			return aRoutes.find(function(oRoute){return oRoute.name === sRouteName; });
		},

		_getSapUI5ConfigEntry: function () {
			return this._oComponent.getMetadata().getManifestObject().getEntry("sap.ui5");
		},

		_getTargetConfig: function(sTargetName) {
			return this._getSapUI5ConfigEntry().routing.targets[sTargetName];
		},

		destroy: function () {
			this._oComponent = null;
			return BaseObject.prototype.destroy.apply(this, arguments);
		},

		/**
		 * @returns {Promise<string>} Path to the browser support statement
		 */
		getPathToBPSupportStatement: function() {
			return this._requireConfigJSON().then(function(oConfig) {
				var sPath = oConfig[STATIC_RESOURCE_PATH_KEYNAME.BP_STATEMENT],
					sResolvedPath = ResourcesUtil.getResourceOriginPath(sPath);
				return sResolvedPath;
			});
		},

		/**
		 * @returns {string} Path to the cookie statement
		 */
		getPathToCookieStatement: function() {
			var sUri = this._oComponent.getConfig()[STATIC_RESOURCE_PATH_KEYNAME.COOKIE_STATEMENT];
			return sap.ui.require.toUrl(sUri);
		},

		/**
		 * @returns {string} Path to the privacy statement
		 */
		getPathToPrivacyStatement: function() {
			var sUri = this._oComponent.getConfig()[STATIC_RESOURCE_PATH_KEYNAME.PRIVACY_STATEMENT];
			return sap.ui.require.toUrl(sUri);
		},

		// Require the configuration file for static pages paths
		_requireConfigJSON: function() {
			return new Promise(function (resolve) {
				jQuery.ajax(ResourcesUtil.getResourceOriginPath("/news-config.json"), {
						type: "GET",
						dataType: "JSON",
					success : function(oResult) {
						resolve(oResult);
					},
					error : function () {
						Log.error("failed to load news-config.json");
						resolve();
					}
				});
			});
		}
	});
});