/*global QUnit, sinon */
sap.ui.define([
	"sap/ui/core/Theming",
	"sap/ui/qunit/QUnitUtils",
	"sap/ui/thirdparty/jquery",
	"sap/m/FeedListItem",
	"sap/m/FeedListItemAction",
	"sap/m/List",
	"sap/m/StandardListItem",
	"sap/ui/model/json/JSONModel",
	"sap/m/Button",
	"sap/m/Popover",
	"sap/m/Bar",
	"sap/m/ActionSheet",
	"sap/m/App",
	"sap/m/Page",
	"sap/ui/Device",
	"sap/m/FormattedText",
	"sap/ui/core/IconPool",
	"sap/m/library",
	"sap/base/Log",
	"sap/ui/events/KeyCodes",
	"sap/ui/core/Core",
	"sap/ui/qunit/utils/nextUIUpdate"
], function(Theming, qutils, jQuery, FeedListItem, FeedListItemAction, List, StandardListItem, JSONModel, Button, Popover, Bar, ActionSheet, App, Page, Device, FormattedText, IconPool, library, Log, KeyCodes, oCore, nextUIUpdate) {
	"use strict";

	// shortcut for sap.m.PlacementType
	var PlacementType = library.PlacementType;

	// shortcut for sap.m.LinkConversion
	var LinkConversion = library.LinkConversion;

	// shortcut for sap.m.ListType
	var ListType = library.ListType;

	// shortcut for sap.m.ButtonType
	var ButtonType = library.ButtonType;

	var IMAGE_PATH = "test-resources/sap/m/avatar/";

	var oList2 = new List({
		inset: true
	});
	var data = {
		navigation: [{
			title: "Travel Expend",
			description: "Access the travel expend workflow",
			icon: IMAGE_PATH + "travel_expend.png",
			iconInset: false,
			type: "Navigation",
			press: 'detailPage'
		}, {
			title: "Travel and expense report",
			description: "Access travel and expense reports",
			icon: IMAGE_PATH + "travel_expense_report.png",
			iconInset: false,
			type: "Navigation",
			press: 'detailPage'
		}, {
			title: "Travel Request",
			description: "Access the travel request workflow",
			icon: IMAGE_PATH + "travel_request.png",
			iconInset: false,
			type: "Navigation",
			press: 'detailPage'
		}, {
			title: "Work Accidents",
			description: "Report your work accidents",
			icon: IMAGE_PATH + "wounds_doc.png",
			iconInset: false,
			type: "Navigation",
			press: 'detailPage'
		}, {
			title: "Travel Settings",
			description: "Change your travel worflow settings",
			icon: IMAGE_PATH + "settings.png",
			iconInset: false,
			type: "Navigation",
			press: 'detailPage'
		}]
	};

	var oItemTemplate1 = new StandardListItem({
		title: "{title}",
		description: "{description}",
		icon: "{icon}",
		iconInset: "{iconInset}",
		type: "{type}"
	});

	function bindListData(data, itemTemplate, list) {
		var oModel = new JSONModel();
		// set the data for the model
		oModel.setData(data);
		// set the model to the list
		list.setModel(oModel);

		// bind Aggregation
		list.bindAggregation("items", "/navigation", itemTemplate);
	}

	bindListData(data, oItemTemplate1, oList2);

	var oLeftButton = new Button({
		text: "Modal",
		type: ButtonType.Reject,
		press: function () {
			oPopover.setModal(!oPopover.getModal());
		}
	});

	var oRightButton = new Button({
		text: "Close",
		type: ButtonType.Accept,
		press: function () {
			oPopover.close();
		}
	});

	var footer = new Bar({
		contentLeft: [],
		contentMiddle: [new Button({icon: IMAGE_PATH + "favorite@2x.png"}),
			new Button({icon: IMAGE_PATH + "feed@2x.png"}),
			new Button({icon: IMAGE_PATH + "flag@2x.png"})],
		contentRight: []
	});

	var oPopover = new Popover({
		placement: PlacementType.Auto,
		title: "Popover",
		showHeader: true,
		beginButton: oLeftButton,
		endButton: oRightButton,
		beforeOpen: function (oEvent) {
			Log.info("before popover opens!!!");
		},
		afterOpen: function (oEvent) {
			Log.info("popover is opened finally!!!");
		},
		beforeClose: function (oEvent) {
			Log.info("before popover closes!!!");
		},
		afterClose: function (oEvent) {
			Log.info("popover is closed properly!!!");
		},
		footer: footer,
		content: [
			oList2
		]
	});

	var oFeedList = new List("oFeedItemList", {
		mode: "SingleSelectMaster"
	});

	var fnOpenPopup = function (oControlEvent) {
		if (oControlEvent.getSource().getSender() === "Jack Jones") {
			Log.info("senderPress called");
			oControlEvent.getSource().setSender("Event was fired");
		} else {
			oPopover.openBy(oControlEvent.getParameters().getDomRef());
		}
	};

	var oFeedListItemTemplate = new FeedListItem({
		type: ListType.Active,
		icon: "{icon}",
		activeIcon: "{activeIcon}",
		text: "{text}",
		sender: "{sender}",
		iconInitials: "{iconInitials}",
		showIcon: "{showIcon}",
		senderActive: "{senderActive}",
		iconActive: "{iconActive}",
		info: "{info}",
		timestamp: "{timestamp}",
		maxCharacters: "{maxCharacters}",
		senderPress: fnOpenPopup,
		iconPress: fnOpenPopup,
		disableStyleAttribute : "{disableStyleAttribute}"
	});

	function bindFeedListData(data, itemTemplate, list) {
		var oModel = new JSONModel();
		// set the data for the model
		oModel.setData(data);
		// set the model to the list
		list.setModel(oModel);
		// bind Aggregation
		list.bindAggregation("items", "/chunks", itemTemplate);
	}

	var sURI = IconPool.getIconURI("personnel-view");

	var feedData = {
		chunks: [{
			icon: IMAGE_PATH + "male.jpg",
			text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque risus nulla, interdum eget posuere non, tincidunt eu felis. In hac habitasse platea dictumst. This is a very long URL: http://this.is.some.very.long.url.sap.com/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/elit/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/elit/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/elit/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/elit/lorem/ipsum/dolor/sit/amet/consectetur/adipiscing/elit#LoremIpsumDolorSitAmetConsecteturAdipiscingElitLoremIpsumDolorSitAmetConsecteturAdipiscingElitLoremIpsumDolorSitAmetConsecteturAdipiscingElit Quisque ut ipsum est. Duis ipsum orci, interdum eget sollicitudin ac, blandit a ante. Cras congue posuere metus sed tempus. Mauris euismod, dui sit amet molestie volutpat, ipsum est viverra velit, id ultricies ante dolor et ligula. Pellentesque tincidunt fermentum lectus, eu luctus mi ultrices quis. Sed luctus nulla sit amet sapien consequat quis pretium eros tincidunt. Nullam quam erat, ultricies in malesuada non, tincidunt at nibh. Curabitur nec lectus et justo auctor tincidunt. In rhoncus risus vitae turpis suscipit eget porta metus facilisis. Vestibulum bibendum vehicula velit eu porta. Donec tincidunt rutrum lacus at egestas.",
			sender: "Jeremy Dash",
			iconInitials: "In",
			senderActive: true,
			iconActive: true,
			timestamp: "March 03, 2013",
			info: "Approved",
			maxCharacters: 5000
		}, {
			icon: sURI,
			text: "This FeedListItem displays an ImagePool image. Cras congue posuere metus sed tempus. Mauris euismod, dui sit amet molestie volutpat, ipsum est viverra velit, id ultricies ante dolor et ligula. ",
			sender: "Christopher Kent",
			iconInitials: "In",
			senderActive: true,
			iconActive: true,
			timestamp: "Dec 04, 2012",
			info: "Rejected"
		}, {
			icon: IMAGE_PATH + "female.jpg",
			text: "This FeedListItem comes with senderActive = false and iconActive = false. In hac habitasse platea dictumst. Quisque ut ipsum est. Duis ipsum orci, interdum eget sollicitudin ac, blandit a ante.",
			sender: "Claire Jones",
			senderActive: false,
			iconActive: false,
			timestamp: "Dec 02, 2012",
			info: "Waiting for Approval"
		}, {
			text: "This FeedListItem comes without an image and has a very long info text",
			sender: "Christine Noah",
			senderActive: true,
			iconActive: true,
			timestamp: "Nov 23, 2012",
			info: "Waiting for Approval and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting and waiting"
		}, {
			text: "This one has no date",
			sender: "Frank Black",
			senderActive: true,
			iconActive: true,
			info: "New"
		}, {
			text: "And this one does without info",
			sender: "Kurt Nistroy",
			senderActive: true,
			iconActive: true,
			timestamp: "Nov 01, 2012"
		}, {
			text: "This one has no sender but active/inactve icons (check out the icon's color, when you press this item)",
			icon: IMAGE_PATH + "action.png",
			activeIcon: IMAGE_PATH + "action_pressed.png",
			senderActive: true,
			iconActive: true,
			timestamp: "Nov 01, 2012"
		}, {
			sender: "Frank Black",
			text: "This FeedListItem has an image but showIcon is set to false so it should not be displayed",
			icon: IMAGE_PATH + "action.png",
			showIcon: false,
			senderActive: true,
			iconActive: true,
			timestamp: "Nov 01, 2012"
		}, {
			sender: "Mrs Smith",
			text: "This is a very long long long long long long long long long long long long long long long text realy soooo long that it exceeds the this._nMaxCollapsedLength of 500 characters which is valid for a desktop so that we can test the collapse/expand function on this FeedListItem; so this text should be longer than 500 charecters, let's see and count, oh, it is still under 500 characters, let's write something else so that we can reach and actually exceed the 500 character threshold, let's count again. That is still not enough that is why our QUnits tests are still red so we have to write and write and write and write in the hope that we at some time or another reach finally the threshold and the QUnit will not be shown red any longer",
			timestamp: "Jul 02, 2014"
		}, {
			sender: "Jack Jones",
			text: "This is a very long long long long long long long long long long long long long long long text realy soooo long that it exceeds the this._nMaxCollapsedLength of 500 characters which is valid for a desktop so that we can test the collapse/expand function on this FeedListItem; so this text should be longer than 500 charecters, let's see and count, oh, it is still under 500 characters, let's write something else so that we can reach and actually exceed the 500 character threshold, let's count again. That is still not enough that is why our QUnits tests are still red so we have to write and write and write and write in the hope that we at some time or another reach finally the threshold and the QUnit will not be shown red any longer",
			icon: IMAGE_PATH + "male.jpg",
			showIcon: false,
			senderActive: true,
			timestamp: "Aug 06, 2014"
		}, {
			sender: "Mrs Smith",
			text: "Thisisaerynnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongvvaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylongaverylong",
			timestamp: "Jul 02, 2014",
			maxCharacters: 20
		}, {
			sender: "Trail",
			text: "Lorem <strong>ipsum dolor sit amet</strong>, <em>consetetur sadipscing elitr</em>, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, <a class='_class' id='xyz' href='http://www.sap.com'>sed diam voluptua</a>. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod <strong>tempor invidunt ut labore et dolore magna</strong> aliquyam erat, sed diam voluptua. <em>At vero eos et accusam et justo</em> duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seddiamnonumyeirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, <u>sed diam nonumy eirmod tempor invidunt ut labore</u> et dolore magna aliquyam erat, sed diam voluptua. <strong>At vero eos et accusam</strong> et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod <a href='//www.sap.com'>tempor invidunt</a> ut labore et dolore magna aliquyam erat, sed diam voluptua. <em>At vero eos et accusam</em> et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
			timestamp: "Jul 02, 2014"
		},
		{
			text: "This FeedListItem with custom htmml text <p style='color:red'>This is a paragraph with red color</p>",
			sender: "Christine Noah",
			senderActive: true,
			iconActive: true,
			timestamp: "Nov 23, 2012",
			disableStyleAttribute: true
		},
		{
			text: "This FeedListItem with custom htmml text <p style='color:red'>This is a paragraph with red color</p>",
			sender: "Christine Noah",
			senderActive: true,
			iconActive: true,
			timestamp: "Nov 23, 2012",
			disableStyleAttribute: false
		}]
	};

	bindFeedListData(feedData, oFeedListItemTemplate, oFeedList);

	var appFeedList = new App("myApp", {initialPage: "feedListPage"});
	var feedListPage = new Page("feedListPage",
		{title: "Feed List Item Test Page"}
	);

	feedListPage.addContent(oFeedList);
	appFeedList.addPage(feedListPage);
	appFeedList.placeAt("qunit-fixture");

	QUnit.module("Properties");

	QUnit.test("ImagePool Icon", function (assert) {
		assert.ok(jQuery('#__item1-oFeedItemList-1 .sapMFeedListItemImage .sapUiIcon').length === 1, "Image pool icon displayed");
	});

	QUnit.test("All Properties", function (assert) {
		assert.ok(!!oFeedList.getItems()[0].oAvatar.$(), "Avatar rendered");
		assert.ok(oFeedList.getItems()[0].oAvatar.getSrc() === oFeedList.getItems()[0].getIcon(), "Avatar rendered (icon <> initial)");
		assert.ok(oFeedList.getItems()[0].oAvatar.getId() === oFeedList.getItems()[0].getId() + '-icon', "ID is set");
		assert.ok(oFeedList.getItems()[0].oAvatar.getDisplayShape(), "Avatar should have DisplayShape properties");
		assert.ok(oFeedList.getItems()[0].oAvatar.getInitials(), "Avatar should have initials properties");
		assert.ok(oFeedList.getItems()[0].oAvatar.getDisplaySize(), "Avatar should have DisplaySize properties");
		assert.ok(oFeedList.getItems()[0]._oLinkControl.getEnabled(), "Sender link enabled (senderActive = true)");
		assert.ok(!!oFeedList.getItems()[0]._oLinkControl.$(), "Name Link rendered");
		assert.ok(jQuery('#__item1-oFeedItemList-0 .sapMFeedListItemFooter').length === 1, "Footer displayed");
		assert.ok(oFeedList.getItems()[0].$("timestamp").length === 1, "timestamp should be rendered");
		assert.ok(oFeedList.getItems()[0].$("info").length === 1, "info should be rendered");
		assert.ok(oFeedList.getItems()[0].$("maxCharacters").length === 0, "maxCharacters is nothing to be rendered");
		assert.ok(oFeedList.getItems()[8].$().find('*').hasClass("sapUiSelectable"), "Item should have class sapUiSelectable");
		assert.notOk(oFeedList.getItems()[11].getDisableStyleAttribute(), "FeedListItem should have disableStyleAttribute set to false by default");
		assert.notOk(oFeedList.getItems()[11].getAggregation("_text").getDisableStyleAttribute(), "FormattedText should have disableStyleAttribute set to false by default");
		assert.ok(oFeedList.getItems()[12].getDisableStyleAttribute(), "FeedListItem should have disableStyleAttribute set to true");
		assert.ok(oFeedList.getItems()[12].getAggregation("_text").getDisableStyleAttribute(), "FormattedText should have disableStyleAttribute set to true");
		assert.notOk(oFeedList.getItems()[13].getDisableStyleAttribute(), "FeedListItem should have disableStyleAttribute set to false");
		assert.notOk(oFeedList.getItems()[13].getAggregation("_text").getDisableStyleAttribute(), "FormattedText should have disableStyleAttribute set to false");
	});

	QUnit.test("The convertLinksToAnchorTags property is set by default to LinkConversion.None", function (assert) {
		assert.equal(oFeedList.getItems()[2].getConvertLinksToAnchorTags(), LinkConversion.None, "The default value is sap.m.LinkConversion.None");
	});

	QUnit.test("The convertedLinksDefaultTarget property is set by default to _blank", function (assert) {
		assert.equal(oFeedList.getItems()[2].getConvertedLinksDefaultTarget(), "_blank", "The default value is _blank");
	});


	QUnit.test("Sender inactive, Icon inactive", function (assert) {
		assert.ok(oFeedList.getItems()[2]._oLinkControl.$().hasClass("sapMLnkDsbl"), " Sender Link inactive");
	});

	QUnit.test("Show default icon (icon is initial + showIcon = true)", function (assert) {
		assert.ok(oFeedList.getItems()[3].oAvatar._getIcon().getSrc() === IconPool.getIconURI("person-placeholder"), "Placeholder icon rendered (icon  initial)");
	});

	QUnit.test("Do not show icon", function (assert) {
		assert.ok(!oFeedList.getItems()[7].oAvatar, "No icon rendered");
	});

	QUnit.test("No Icon", function (assert) {
		assert.ok(!oFeedList.getItems()[4].oAvatar.$().hasClass("sapMImg"), "property icon initial: image should not have class sapMImg ");
	});
	QUnit.test("Default src - icon size", function (assert) {
		assert.ok(oFeedList.getItems()[4].oAvatar.$().hasClass("sapFAvatarS"), "Avatar has class sapAvatarS applied");
		assert.equal(oFeedList.getItems()[4].oAvatar.$().css("font-size"), "32px", "Avatar icon font size is 2 rem");
	});
	QUnit.test("Default feedListItem div size", function (assert) {
		assert.ok(oFeedList.getItems()[4].oParent.$().hasClass("sapMList"), "FeedListItem has class sapMList applied");
		assert.equal(oFeedList.getItems()[4].oParent.$().css("font-size"), "16px", "FeedListItem font size is 1 rem");
	});

	QUnit.test("No Timestamp", function (assert) {
		assert.ok(oFeedList.getItems()[4].$("timestamp").length === 0, "no timestamp should be rendered");
	});

	QUnit.test("No Info", function (assert) {
		assert.ok(oFeedList.getItems()[5].$("info").length === 0, "no info should be rendered");
	});

	QUnit.test("No Sender", function (assert) {
		assert.ok(!oFeedList.getItems()[6]._oLinkControl, "No sender name rendered");
	});

	QUnit.test("Sender link disabled", function (assert) {
		assert.ok(!oFeedList.getItems()[2]._oLinkControl.getEnabled(), "Sender link disabled (senderActive = false)");
	});

	QUnit.test("expand/collapse function", function (assert) {
		assert.ok(oFeedList.getItems()[8].$("realtext").text() === oFeedList.getItems()[8]._sShortText, "the collapsed text displayed ");
		assert.ok(oFeedList.getItems()[8].$("threeDots").hasClass("sapMFeedListItemTextString"), "three dots should have class sapMFeedListItemTextString");
		assert.ok(oFeedList.getItems()[8]._oLinkExpandCollapse.$(), "expand/collapse Link rendered");
		assert.ok(oFeedList.getItems()[8].$("threeDots").text() === " ... ", "Three dots rendered between shortened text and the 'expand' link");
		qutils.triggerEvent((jQuery.support.touch ? "tap" : "click"), oFeedList.getItems()[8]._oLinkExpandCollapse.getId());
		assert.ok(oFeedList.getItems()[8].$("threeDots").text() === "  ", "two spaces rendered between full text and 'collapse' link");
		assert.ok(oFeedList.getItems()[8].$("realtext").text() === oFeedList.getItems()[8]._sFullText, "the expanded text displayed ");
		qutils.triggerEvent((jQuery.support.touch ? "tap" : "click"), oFeedList.getItems()[8]._oLinkExpandCollapse.getId());
		assert.ok(oFeedList.getItems()[8].$("threeDots").text() === " ... ", "Three dots rendered between shortened text and the 'expand' link");
		assert.ok(oFeedList.getItems()[8].$("realtext").text() === oFeedList.getItems()[8]._sShortText, "the collapsed text displayed ");
		assert.ok(oFeedList.getItems()[0].getMaxCharacters() === 5000, "maxCharacters should be changeable");
		assert.ok(!oFeedList.getItems()[0]._oLinkExpandCollapse, "expand/collapse Link should not be rendered");
		assert.ok(oFeedList.getItems()[10]._sShortText.length === 20, "the length of collapsed text without spaces equals to the property maxCharacters ");
	});

	QUnit.module("Overridden setter method for property 'type'", {
		beforeEach: function () {
			this.oFeedListItem = new FeedListItem();
		},
		afterEach: function () {
			this.oFeedListItem.destroy();
		}
	});

	QUnit.test("Property is not set if value does not changed", function (assert) {
		//Arrange
		var oSpy = sinon.spy(this.oFeedListItem, "setProperty");
		//Act
		this.oFeedListItem.setType(this.oFeedListItem.getType());
		//Assert
		assert.notOk(oSpy.called, "Property not updated");
	});

	QUnit.test("ListType 'Navigation' ends in type 'Active'", function (assert) {
		//Act
		var oResult = this.oFeedListItem.setType(ListType.Navigation);
		//Assert
		assert.equal(this.oFeedListItem.getType(), "Active", "Property 'type' set to 'Active'");
		assert.deepEqual(this.oFeedListItem, oResult, "Instance returned");
	});

	QUnit.test("Other ListTypes in type corresponding type", function (assert) {
		//Act
		var oResult = this.oFeedListItem.setType(ListType.Inactive);
		//Assert
		assert.equal(this.oFeedListItem.getType(), "Inactive", "Property 'type' set to 'Inactive'");
		assert.deepEqual(this.oFeedListItem, oResult, "Instance returned");
	});

	QUnit.module("Behavior depending on device: only phone", {
		beforeEach: async function () {
			this.bOriginalIsPhone = Device.system.phone;
			Device.system.phone = true;
			appFeedList.invalidate();
			await nextUIUpdate();
		},
		afterEach: function () {
			Device.system.phone = this.bOriginalIsPhone;
		}
	});

	QUnit.test("Correct class is added to realtext element", function (assert) {
		assert.ok(oFeedList.getItems()[8].$("realtext").hasClass("sapMFeedListItemText"), "Text should have the necessary class for phone");
	});

	QUnit.test("Sender name rendering", function (assert) {
		var sLinkControlText = feedData.chunks[0].sender;
		assert.equal(oFeedList.getItems()[0]._oLinkControl.getText(), sLinkControlText, "Sender name rendered for phone");
	});

	QUnit.module("Behavior depending on device: all except phone", {
		beforeEach: async function () {
			this.bOriginalIsPhone = Device.system.phone;
			Device.system.phone = false;
			appFeedList.invalidate();
			await nextUIUpdate();
		},
		afterEach: function () {
			Device.system.phone = this.bOriginalIsPhone;
		}
	});

	QUnit.test("Correct class is added to realtext element", function (assert) {
		assert.ok(oFeedList.getItems()[8].$("realtext").hasClass("sapMFeedListItemTextString"), "Text should have the necessary class for tablet and desktop");
	});

	QUnit.test("Sender name rendering", function (assert) {
		var sLinkControlText = feedData.chunks[0].sender + FeedListItem._oRb.getText("COLON");
		assert.equal(oFeedList.getItems()[0]._oLinkControl.getText(), sLinkControlText, "Sender name rendered with colon for tablet and desktop");
	});

	QUnit.module("Check property combination", {
		beforeEach: async function () {
			this.oFeedListItem = new FeedListItem({
				sender: null,
				text: "Some text which is displayed.",
				timestamp: "March 03 2013",
				iconActive: true,
				showIcon: true,
				senderActive: false
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.oFeedListItem.destroy();
		}
	});

	QUnit.test("The links in the text are recognised", async function (assert) {
		//Arrange
		var sOriginal = "sample text: www.sap.com to be surrounded by tags",
			sTransformed = "sample text: <a href=\"//www.sap.com\" target=\"_self\" class=\"sapMLnk\">www.sap.com</a> to be surrounded by tags",
			sLinkTarget = "_self",
			oSpy = sinon.spy(FormattedText.prototype, "onAfterRendering");

		this.oFeedListItem.setText(sOriginal);
		this.oFeedListItem.setConvertLinksToAnchorTags(LinkConversion.All);
		this.oFeedListItem.setConvertedLinksDefaultTarget(sLinkTarget);
		//Act
		await nextUIUpdate();
		//Assert
		assert.equal(this.oFeedListItem.getAggregation("_text").getConvertLinksToAnchorTags(), LinkConversion.All, "The convertLinksToAnchorTags property has been forwarded to sap.m.FormattedText");
		assert.equal(this.oFeedListItem.getAggregation("_text").getConvertedLinksDefaultTarget(), sLinkTarget, "The ConvertedLinksDefaultTarget property has been forwarded to sap.m.FormattedText");
		assert.equal(this.oFeedListItem._sFullText, sTransformed, "The anchor text has been added correctly");
		//Restore
		oSpy.restore();
	});

	QUnit.test("Correct setter is used if convertLinksToAnchorTags is set to sap.m.LinkConversion.None", function (assert) {
		//Arrange
		var oSpy = sinon.spy(this.oFeedListItem.getAggregation("_text"), "setHtmlText");
		this.oFeedListItem.onBeforeRendering();
		//Assert
		assert.ok(oSpy.calledOnce, "setHtmlText has been used as a setter");
		//Restore
		oSpy.restore();
	});

	QUnit.test("Correct setter is used if convertLinksToAnchorTags is set to sap.m.LinkConversion.All", function (assert) {
		//Arrange
		var oSpy = sinon.spy(this.oFeedListItem.getAggregation("_text"), "setHtmlText");
		this.oFeedListItem.setConvertLinksToAnchorTags(LinkConversion.All);
		//Act
		this.oFeedListItem.onBeforeRendering();
		//Assert
		assert.ok(!oSpy.called, "setHtmlText has not been called");
		//Restore
		oSpy.restore();
	});
	QUnit.module("Events");

	QUnit.test("Press Icon", function (assert) {
		// Arrange
		var oFeedListItem = oFeedList.getItems()[0];
		oFeedListItem.detachIconPress(fnOpenPopup);
		oFeedListItem.attachIconPress(function (oEvent) {
			// Assert
			// Deprecated event parameter
			assert.ok(oEvent.getParameter("domRef"));
			assert.deepEqual(oEvent.getParameter("domRef"), oFeedListItem.oAvatar.getDomRef());
			// New parameter
			assert.ok(typeof oEvent.getParameter("getDomRef") === "function");
			assert.deepEqual(oEvent.getParameter("getDomRef")(), oFeedListItem.oAvatar.getDomRef());
		});
		// Act
		qutils.triggerEvent("tap", oFeedListItem.oAvatar.getId());
	});

	QUnit.test("Press Sender", function (assert) {
		// Arrange
		var oFeedListItem = oFeedList.getItems()[0];
		oFeedListItem.detachSenderPress(fnOpenPopup);
		oFeedListItem.attachSenderPress(function (oEvent) {
			// Assert
			// Deprecated event parameter
			assert.ok(oEvent.getParameter("domRef"));
			assert.deepEqual(oEvent.getParameter("domRef"), oFeedListItem._oLinkControl.getDomRef());
			// New parameter
			assert.ok(typeof oEvent.getParameter("getDomRef") === "function");
			assert.deepEqual(oEvent.getParameter("getDomRef")(), oFeedListItem._oLinkControl.getDomRef());
		});
		// Act
		oFeedListItem._oLinkControl.firePress();
	});

	QUnit.test("Press SPACE Key on Sender", function (assert) {
		qutils.triggerKeyup(oFeedList.getItems()[9]._oLinkControl.getId(), KeyCodes.SPACE, false, false, false);
		assert.equal(oFeedList.getItems()[9].getSender(), "Event was fired", "Sender Press event was fired");
		oFeedList.getItems()[9].setSender("Jack Jones");
	});

	QUnit.test("Press X Key on Sender", function (assert) {
		qutils.triggerKeydown(oFeedList.getItems()[9]._oLinkControl.getId(), KeyCodes.X, false, false, false);
		assert.notEqual(oFeedList.getItems()[9].getSender(), "Hello", "Sender Press event was not fired");
	});

	QUnit.test("Press SPACE Key on MORE", function (assert) {
		qutils.triggerKeyup(oFeedList.getItems()[9]._oLinkExpandCollapse.getId(), KeyCodes.SPACE, false, false, false);
		assert.ok(oFeedList.getItems()[9].$("realtext").text() === oFeedList.getItems()[9]._sFullText, "the expanded text displayed ");
		qutils.triggerKeyup(oFeedList.getItems()[9]._oLinkExpandCollapse.getId(), KeyCodes.SPACE, false, false, false);
		assert.ok(oFeedList.getItems()[9].$("realtext").text() === oFeedList.getItems()[9]._sShortText, "the collapsed text displayed ");
	});

	QUnit.test("Press X Key on MORE", function (assert) {
		qutils.triggerKeydown(oFeedList.getItems()[9]._oLinkExpandCollapse.getId(), KeyCodes.X, false, false, false);
		assert.notEqual(oFeedList.getItems()[9].getSender(), "Hello", "Sender Press event was not fired");
	});

	QUnit.test("URL navigation can be cancelled", async function (assert) {
		// Arrange
		var oFLI = new FeedListItem({
				sender: "Alexandrina Victoria",
				info: "Request",
				timestamp: "March 03 2013",
				convertLinksToAnchorTags: "All",
				text: "Lorem <strong>ipsum dolor sit amet</strong>, <em>consetetur sadipscing elitr</em>, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, <a href='http://www.sap.com'>sed diam voluptua</a>. At vero eos et accusam et justo duo dolores et ea rebum.Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod <strong>tempor invidunt ut labore et dolore magna</strong> aliquyam erat, sed diam voluptua. <em>At vero eos et accusam et justo</em> duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, seddiamnonumyeirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, <u>sed diam nonumy eirmod tempor invidunt ut labore</u> et dolore magna aliquyam erat, sed diam voluptua. <strong>At vero eos et accusam</strong> et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod <a href='//www.sap.com'>tempor invidunt</a> ut labore et dolore magna aliquyam erat, sed diam voluptua. <em>At vero eos et accusam</em> et justo duo dolores et ea rebum. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum."
			}),
			rootElement = document.getElementById("qunit-fixture"),
			fnPreventNavigation = function(oEvent) {
				oEvent.preventDefault();
			},
			oSpy = this.spy(window, "open");

		rootElement.addEventListener("click", fnPreventNavigation, true);
		oFLI.placeAt("qunit-fixture");
		await nextUIUpdate();

		// Act
		oFLI.getDomRef().querySelectorAll(".sapMFeedListItemTextString a")[0].dispatchEvent(new MouseEvent("click", {
			view: window,
			bubbles: true,
			cancelable: true
		}));

		// Assert
		assert.ok(!oSpy.called, "No navigation");

		// Cleanup
		oFLI.destroy();
		rootElement.removeEventListener("click", fnPreventNavigation, true);
	});

	QUnit.module("Rendering behavior");

	QUnit.test("Expanded text should appear also after rerendering", async function (assert) {
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), FeedListItem._sTextShowMore);

		oFeedList.getItems()[10]._toggleTextExpanded();
		await nextUIUpdate();
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), FeedListItem._sTextShowLess);

		oFeedList.getItems()[10]._toggleTextExpanded();
		await nextUIUpdate();
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), FeedListItem._sTextShowMore);
	});

	QUnit.test("Invalidation leads to collapsed text", function (assert) {
		oFeedList.getItems()[10]._toggleTextExpanded();
		oFeedList.getItems()[10].invalidate();
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), FeedListItem._sTextShowMore);
	});

	QUnit.test("Item with a clickable icon is rendered", function (assert) {
		//Arrange
		var oItem = oFeedList.getItems()[0].oAvatar;
		//Act
		var $Image = oItem.getDomRef();
		var sStyleClass = $Image.className;
		//Assert
		assert.ok(sStyleClass.indexOf("sapMFeedListItemImage") >= 0, "Css class 'sapMFeedListItemImage' is present");
	});

	QUnit.test("Item with a non clickable icon is rendered", async function (assert) {
		//Arrange
		var oItem = oFeedList.getItems()[0];
		//Act
		oItem.setIconActive(false);
		await nextUIUpdate();

		var $Image = oItem.oAvatar.getDomRef();
		var sStyleClass = $Image.className;
		//Assert
		assert.ok(sStyleClass.indexOf("sapMFeedListItemImageInactive") >= 0, "Css class 'sapMFeedListItemImageInactive' is present");
	});

	QUnit.module("Customizing LESS/MORE strings");

	QUnit.test("Default behaviour of expand collapse text", function (assert) {
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), "MORE");
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), FeedListItem._sTextShowMore);
	});

	QUnit.test("Expand collapse text changed", async function (assert) {
		oFeedList.getItems()[10].setMoreLabel("MORE TEXT");
		oFeedList.getItems()[10].setLessLabel("LESS TEXT");
		await nextUIUpdate();

		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), "MORE TEXT");
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), oFeedList.getItems()[10].getMoreLabel());
	});

	QUnit.test("Text Expanded", async function (assert) {
		oFeedList.getItems()[10]._toggleTextExpanded();
		await nextUIUpdate();

		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), "LESS TEXT");
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), oFeedList.getItems()[10].getLessLabel());
	});

	QUnit.test("Text Collapsed", async function (assert) {
		oFeedList.getItems()[10]._toggleTextExpanded();
		await nextUIUpdate();

		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), "MORE TEXT");
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), oFeedList.getItems()[10].getMoreLabel());
	});

	QUnit.test("Invalidation leads to collapsed text", function (assert) {
		oFeedList.getItems()[10]._toggleTextExpanded();
		oFeedList.getItems()[10].invalidate();
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), "MORE TEXT");
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), oFeedList.getItems()[10].getMoreLabel());
	});

	QUnit.test("MoreLabel property set to 'null'", async function (assert) {
		oFeedList.getItems()[10].setMoreLabel(null);
		await nextUIUpdate();
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), "MORE");
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), FeedListItem._sTextShowMore);
	});

	QUnit.test("LessLabel property set to 'null'", async function (assert) {
		oFeedList.getItems()[10].setLessLabel(null);
		await nextUIUpdate();
		oFeedList.getItems()[10]._toggleTextExpanded();
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), "LESS");
		assert.equal(oFeedList.getItems()[10]._oLinkExpandCollapse.getText(), FeedListItem._sTextShowLess);
	});

	QUnit.module("Check property combination", {
		beforeEach: async function () {
			this.oFeedListItem = new FeedListItem({
				sender: null,
				text: "Some text which is displayed.",
				timestamp: "March 03 2013",
				iconActive: true,
				showIcon: true,
				senderActive: false
			});
			this.oFeedListItem.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			//this.oFeedListItem.destroy();
		}
	});

	QUnit.test("'sender' is set to null and 'senderActive' is set to false", function (assert) {
		this.oFeedListItem.$().trigger("tap");
		assert.ok(this.oFeedListItem, "FeedListItem is clickable");
	});

	QUnit.test("Only single Press event is added.", async function (assert) {
		assert.equal(Object.keys(this.oFeedListItem.oAvatar.mEventRegistry).length, 1,  "Only single press event is added to the ImageControl");
		this.oFeedListItem.invalidate();
		await nextUIUpdate();

		assert.equal(Object.keys(this.oFeedListItem.oAvatar.mEventRegistry).length, 1,  "Only single press event is added to the ImageControl");
	});

	QUnit.module("HTML Text inside", {
		beforeEach: async function () {
			this.oFeedListItem = new FeedListItem({
				sender: null,
				text: "Some text <strong>which</strong> is <em>displayed</em>."
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.oFeedListItem.destroy();
		}
	});

	QUnit.test("Converts html text to plain text and back to html text", function (assert) {
		//Arrange
		var sHtmlText = this.oFeedListItem._sFullText;
		var sPlainText = "Some text which is displayed.";
		//Act
		var sConvertedText1 = this.oFeedListItem._convertHtmlToPlainText(sHtmlText);
		var sConvertedText2 = this.oFeedListItem._convertPlainToHtmlText(sConvertedText1);
		//Assert
		assert.equal(sConvertedText1, sPlainText, "Html text is converted to plain text");
		assert.equal(sConvertedText2, sHtmlText, "Plain text is converted back to html text");
	});

	QUnit.test("No html text", async function (assert) {
		//Arrange
		var sPlainText = "Some text which is displayed.";
		//Act
		this.oFeedListItem.setText(sPlainText);
		await nextUIUpdate();
		var sText = this.oFeedListItem._sFullText;
		//Assert
		assert.equal(sPlainText, sText, "Text does not have html tags");
	});

	QUnit.test("Html collapsed text ", async function (assert) {
		//Arrange
		var sCollapsedText = "Some text <strong>which</strong>";
		var sFullText = this.oFeedListItem.getText();
		//Act
		this.oFeedListItem.setMaxCharacters(17);
		await nextUIUpdate();
		var sCollapsedTextNew = this.oFeedListItem._sShortText;
		var sFullTextNew = this.oFeedListItem._sFullText;
		//Assert
		assert.equal(sCollapsedText, sCollapsedTextNew, "Collapsed text has html tags");
		assert.equal(this.oFeedListItem._checkTextIsExpandable(), true, "Text is expandable");
		assert.equal(sFullText, sFullTextNew, "Full text has html tags");
	});

	QUnit.test("No collapsed text", function (assert) {
		//Arrange
		var sText = this.oFeedListItem._getCollapsedText();
		var sShortText = this.oFeedListItem._sShortText;
		//Act
		//Assert
		assert.ok(!sShortText, "Short text is null");
		assert.ok(!sText, "Collapsed text is null");
		assert.equal(this.oFeedListItem._checkTextIsExpandable(), false, "Text is not expandable");
	});

	QUnit.test("Empty html tags are removed for collapsed text", async function (assert) {
		//Arrange
		var sText = "<p></p><ul></ul><strong></strong><p>Some</p> text";
		var sCollapsedText = "<p>Some</p>";
		//Act
		this.oFeedListItem.setText(sText);
		this.oFeedListItem.setMaxCharacters(5);
		await nextUIUpdate();
		var sCollapsedTextNew = this.oFeedListItem._sShortText;
		var sFullText = this.oFeedListItem._sFullText;
		//Assert
		assert.equal(sCollapsedText, sCollapsedTextNew, "Empty html tags are removed for collapsed text");
		assert.equal(sText, sFullText, "Full text remains the same");
	});

	QUnit.test("Collapsed text is not cleared from empty tags during onAfterRendering if rendered in expanded mode", function (assert) {
		//Arrange
		this.oFeedListItem.setText("<p></p><ul></ul><strong></strong><p>Some</p> text");
		this.oFeedListItem.setMaxCharacters(5);
		this.oFeedListItem.onBeforeRendering();
		this.oFeedListItem._bTextExpanded = true;
		var oSinonSpy = sinon.spy(this.oFeedListItem, "_clearEmptyTagsInCollapsedText");
		//Act
		this.oFeedListItem.onAfterRendering();
		//Assert
		assert.equal(oSinonSpy.called, false, "Empty HTML tags for collapsed text are not removed");
	});

	QUnit.test("Collapsed text is cleared from empty tags during onAfterRendering if rendered in collapsed mode", function (assert) {
		//Arrange
		this.oFeedListItem.setText("<p></p><ul></ul><strong></strong><p>Some</p> text");
		this.oFeedListItem.setMaxCharacters(5);
		this.oFeedListItem._bTextExpanded = false;
		this.oFeedListItem.onBeforeRendering();
		var oSinonSpy = sinon.spy(this.oFeedListItem, "_clearEmptyTagsInCollapsedText");
		//Act
		this.oFeedListItem.onAfterRendering();
		//Assert
		assert.equal(oSinonSpy.called, true, "Empty HTML tags are removed for collapsed text");
		assert.equal(this.oFeedListItem._bEmptyTagsInShortTextCleared, true, "The flag variable has been set to prevent unnecessary clearing of empty tags");
	});

	QUnit.test("Collapsed text is cleared from empty tags during _toggleTextExpanded if collapsing the text", async function (assert) {
		//Arrange
		this.oFeedListItem.setText("<p></p><ul></ul><strong></strong><p>Some</p> text");
		this.oFeedListItem.setMaxCharacters(5);
		this.oFeedListItem._bTextExpanded = true;
		var oSinonSpy = sinon.spy(this.oFeedListItem, "_clearEmptyTagsInCollapsedText");
		await nextUIUpdate();
		//Act
		this.oFeedListItem._toggleTextExpanded();
		//Assert
		assert.equal(oSinonSpy.called, true, "Empty HTML tags are removed for collapsed text");
		assert.equal(this.oFeedListItem._bEmptyTagsInShortTextCleared, true, "The flag variable has been set to prevent unnecessary clearing of empty tags");
	});

	QUnit.test("A flag _bEmptyTagsInShortTextCleared is set to false before rendering", function (assert) {
		//Arrange
		this.oFeedListItem._bEmptyTagsInShortTextCleared = true;
		//Act
		this.oFeedListItem.onBeforeRendering();
		//Assert
		assert.equal(this.oFeedListItem._bEmptyTagsInShortTextCleared, false, "The flag variable has been reset to false");
	});

	QUnit.test("Treatment of newline character is backward compatible", function (assert) {
		//Arrange
		var sText = "Test\n with a \n \n newline\n";
		//Act
		this.oFeedListItem.setText(sText);
		this.oFeedListItem.onBeforeRendering();
		var sFullText = this.oFeedListItem._sFullText;
		//Assert
		assert.equal(sFullText, "Test<br> with a <br> <br> newline<br>", "The \\n has been replaced with <br> tag");
	});

	QUnit.module("Special characters", {
		beforeEach: async function () {
			var oData, oModel;

			this.oFeedListItem = new FeedListItem({
				sender: "{/sender}",
				senderActive: "{/senderActive}",
				text: "{/text}"
			});

			oData = {
				"text": "Some Text",
				"sender": "Alexandra",
				"senderActive": true
			};
			oModel = new JSONModel();
			oModel.setData(oData);
			this.oFeedListItem.setModel(oModel);
			this.oFeedListItem.placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.oFeedListItem.destroy();
		}
	});

//	QUnit.test("Special characters in the sender property do not lead to an exception", function (assert) {
//		assert.ok(true, "No exception occurred");
//	});

	QUnit.module("Actions aggregation and hidden aggregations", {
		beforeEach: async function () {
			this.oFeedListItem = new FeedListItem({
				actions: [
					new FeedListItemAction(),
					new FeedListItemAction()
				]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.oFeedListItem.destroy();
		}
	});

	QUnit.test("Action aggregation and hidden aggregations", function (assert) {
		assert.equal(this.oFeedListItem.getActions().length, 2, "There are two actions in the aggregation.");
		assert.ok(this.oFeedListItem.getAggregation("_actionButton") instanceof Button, "Hidden aggregation _actionButton is added");
		assert.notOk(this.oFeedListItem.getAggregation("_actionSheet") instanceof ActionSheet, "Hidden aggregation _actionSheet not added");
	});

	QUnit.test("Shows action button", function (assert) {
		assert.ok(this.oFeedListItem.$("actionButton").length > 0, "The action button is rendered");
	});

	QUnit.test("Hides action button", async function (assert) {
		// Arrange
		this.oFeedListItem.destroyAggregation("actions");

		// Act
		await nextUIUpdate();

		// Assert
		assert.ok(this.oFeedListItem.$("actionButton").length === 0, "The action button is not rendered");
	});

	QUnit.module("Actions Button visibility test", {
		beforeEach: async function () {
			this.oFeedListItem = new FeedListItem({
				actions: [
					new FeedListItemAction({
						visible:false
					}),
					new FeedListItemAction({
						visible:false
					})
				]
			}).placeAt("qunit-fixture");
			await nextUIUpdate();
		},
		afterEach: function () {
			this.oFeedListItem.destroy();
		}
	});

	QUnit.test("Action button should not be visible if all actions are set to visible false", function (assert) {
		assert.ok(this.oFeedListItem.$("actionButton").length === 0, "The action button is not rendered when all FeedListItemActions are set visible false");
	});

	QUnit.module("Method 'init'", {
		beforeEach: function () {
			this.oStub = sinon.stub(FeedListItem.prototype, "_onActionButtonPress");
			this.oFeedListItem = new FeedListItem();
		},
		afterEach: function () {
			this.oFeedListItem.destroy();
			this.oStub.restore();
		}
	});

	QUnit.test("The aggregation '_actionButton' is populated with a sap.m.Button", function (assert) {
		// Act
		var oActionButton = this.oFeedListItem.getAggregation("_actionButton");

		// Assert
		assert.ok(oActionButton instanceof Button, "The aggregation contains the correct control instance.");
	});

	QUnit.test("The method '_onActionButtonPress' is called when the action button is pressed", function (assert) {
		// Act
		this.oFeedListItem.getAggregation("_actionButton").firePress();

		// Assert
		assert.ok(this.oStub.calledOnce, "The method has been called once.");
	});

	QUnit.module("Method '_onActionButtonPress'", {
		beforeEach: function () {
			this.oFeedListItem = new FeedListItem();
		},
		afterEach: function () {
			this.oFeedListItem.destroy();
		}
	});

	QUnit.test("Lazy load ActionSheet and call method '_openActionSheet'", function (assert) {
		// Arrange
		this.oFeedListItem._openActionSheet = sinon.stub();
		var oRequireStub = sinon.stub(sap.ui, "require").callsFake(function () {
			this.oFeedListItem._openActionSheet();
		}.bind(this));

		// Act
		this.oFeedListItem._onActionButtonPress();

		// Assert
		assert.ok(oRequireStub.calledWith(["sap/m/ActionSheet"]), "ActionSheet has been required.");
		assert.ok(this.oFeedListItem._openActionSheet.calledOnce, "The method has been called once.");

		// Cleanup
		oRequireStub.restore();
	});

	QUnit.module("Method '_openActionSheet'", {
		beforeEach: function () {
			this.oFeedListItem = new FeedListItem();
		},
		afterEach: function () {
			this.oFeedListItem.destroy();
		}
	});

	QUnit.test("Creates an instance of type sap.m.ActionSheet", function (assert) {
		// Arrange
		var oOpenByStub = sinon.stub(ActionSheet.prototype, "openBy");

		// Act
		this.oFeedListItem._openActionSheet(ActionSheet);
		var oActionSheet = this.oFeedListItem.getAggregation("_actionSheet");

		// Assert
		assert.ok(oActionSheet instanceof ActionSheet, "ActionSheet was created.");
		assert.ok(oActionSheet.hasListeners("beforeOpen"), "Event listeners for beforeOpen have been attached.");

		// Cleanup
		oOpenByStub.restore();
	});

	QUnit.test("The method '_onBeforeOpenActionSheet' is called before the ActionSheet instance is opened.", function (assert) {
		// Arrange
		var oOpenByStub = sinon.stub(ActionSheet.prototype, "openBy");
		this.oFeedListItem._onBeforeOpenActionSheet = sinon.stub();

		// Act
		this.oFeedListItem._openActionSheet(ActionSheet);
		this.oFeedListItem.getAggregation("_actionSheet").fireBeforeOpen();

		// Assert
		assert.ok(this.oFeedListItem._onBeforeOpenActionSheet.calledOnce, "Method has been called once.");

		// Cleanup
		oOpenByStub.restore();
	});

	QUnit.test("The ActionSheet's aggregation 'buttons' gets destroyed before new buttons are added to it.", function (assert) {
		// Arrange
		var oOpenByStub = sinon.stub(ActionSheet.prototype, "openBy");
		var oDestroyAggregationsStub = sinon.stub(ActionSheet.prototype, "destroyAggregation");

		// Act
		this.oFeedListItem._openActionSheet(ActionSheet);

		// Assert
		assert.ok(oDestroyAggregationsStub.calledOnce, "Method has been called once.");
		assert.ok(oDestroyAggregationsStub.calledWith("buttons", true), "Method has been called with the correct parameters.");

		// Cleanup
		oOpenByStub.restore();
		oDestroyAggregationsStub.restore();
	});

	QUnit.test("For each item in aggregation 'actions', a sap.m.Button instance is added to the ActionSheet's aggregation 'buttons'.", function (assert) {
		// Arrange
		var oOpenByStub = sinon.stub(ActionSheet.prototype, "openBy");
		this.oFeedListItem.addAction(new FeedListItemAction({
			"text": "Action1",
			"icon": "Icon1"
		}));
		this.oFeedListItem.addAction(new FeedListItemAction({
			"text": "Action2",
			"icon": "Icon2"
		}));

		// Act
		this.oFeedListItem._openActionSheet(ActionSheet);

		// Assert
		var oActionSheetButtons = this.oFeedListItem.getAggregation("_actionSheet").getButtons();
		var oFeedListItemActions = this.oFeedListItem.getActions();

		assert.equal(oActionSheetButtons.length, oFeedListItemActions.length, "The numbers of items inside the aggregation and the action sheet are the same.");
		assert.equal(oActionSheetButtons[0].getText(), oFeedListItemActions[0].getText(), "The first item's text is correct.");
		assert.equal(oActionSheetButtons[0].getIcon(), oFeedListItemActions[0].getIcon(), "The first item's icon is correct.");
		assert.equal(oActionSheetButtons[1].getText(), oFeedListItemActions[1].getText(), "The second item's text is correct.");
		assert.equal(oActionSheetButtons[1].getIcon(), oFeedListItemActions[1].getIcon(), "The second item's icon is correct.");

		// Cleanup
		oOpenByStub.restore();
	});

	QUnit.test("The ActionSheet instance is opened by the action button.", function (assert) {
		// Arrange
		var oOpenByStub = sinon.stub(ActionSheet.prototype, "openBy");

		// Act
		this.oFeedListItem._openActionSheet(ActionSheet);

		// Assert
		assert.ok(oOpenByStub.calledOnce, "Method has been called once.");
		assert.ok(oOpenByStub.calledWith(this.oFeedListItem.getAggregation("_actionButton")), "Method has been called with the correct parameter.");

		// Cleanup
		oOpenByStub.restore();
	});

	QUnit.module("Method '_onBeforeOpenActionSheet'", {
		beforeEach: function () {
			this.oFeedListItem = new FeedListItem();
		},
		afterEach: function () {
			this.oFeedListItem.destroy();
		}
	});

	QUnit.test("When the device is a phone, no CSS contrast class is set on the ActionSheet's popover.", function (assert) {
		// Arrange
		var oPopover = new Popover();
		var oEvent = {
			getSource: function () {
				return {
					getParent: function () {
						return oPopover;
					}
				};
			}
		};
		var bOriginSystemPhone = Device.system.phone;
		Device.system.phone = true;

		// Act
		this.oFeedListItem._onBeforeOpenActionSheet(oEvent);

		// Assert
		assert.notOk(oPopover.hasStyleClass("sapContrastPlus"), "Popover does not have the CSS contrast class 'sapContrastPlus'.");
		assert.notOk(oPopover.hasStyleClass("sapContrast"), "Popover does not have the CSS contrast class 'sapContrast'.");

		// Cleanup
		Device.system.phone = bOriginSystemPhone;
	});

	QUnit.module("Security");

	QUnit.test("Sanitize CSS position", async function (assert) {
		var oList = new List(),
			oFeedListItem = new FeedListItem({
				sender: "George Washington",
				info: "Reply",
				icon: "sap-icon://edit",
				timestamp: "March 04 2013",
				text: "Lorem ipsum dolor sit amet, <strong class=\"malicious\" style=\"position: absolute !important\">consetetur</strong> sadipscing elitr, <a class=\"malicious\" href=\"https://sap.com\" style=\"position: fixed !important\">sed diam nonumy</a> eirmod tempor invidunt ut labore." +
						"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore." +
						"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore." +
						"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore." +
						"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore." +
						"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore." +
						"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore." +
						"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore." +
						"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore." +
						"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore." +
						"Lorem ipsum dolor sit amet, <strong class=\"malicious\" style=\"position: absolute !important\">consetetur</strong> sadipscing elitr, <a class=\"malicious\" href=\"https://sap.com\" style=\"position: fixed !important\">sed diam nonumy</a> eirmod tempor invidunt ut labore."
			}),
			aMaliciousNodes;

		// Arrange
		oList.addItem(oFeedListItem);

		oList.placeAt("qunit-fixture");
		await nextUIUpdate();

		// Assert
		aMaliciousNodes = oFeedListItem.getDomRef().querySelectorAll(".malicious"); // find all "malicious" links

		assert.strictEqual(aMaliciousNodes.length, 2, "there are 2 'malicious' nodes");
		assert.strictEqual(aMaliciousNodes[0].getAttribute("style"), "position: static !important;", "There is 'position: static !important' added as style attribute to the first 'malicious' node");
		assert.strictEqual(aMaliciousNodes[1].getAttribute("style"), "position: static !important;", "There is 'position: static !important' added as style attribute to the second 'malicious' node");
		assert.strictEqual(oFeedListItem.getDomRef("figure").getAttribute("style"), null, "There is no stile added to the item icon");

		// Act - toggle to full text
		oFeedListItem._toggleTextExpanded();
		await nextUIUpdate();

		// Assert
		aMaliciousNodes = oFeedListItem.getDomRef().querySelectorAll(".malicious"); // find all "malicious" links

		assert.strictEqual(aMaliciousNodes.length, 4, "there are 4 'malicious' nodes");
		assert.strictEqual(aMaliciousNodes[0].getAttribute("style"), "position: static !important;", "There is 'position: static !important' added as style attribute to the first 'malicious' node");
		assert.strictEqual(aMaliciousNodes[1].getAttribute("style"), "position: static !important;", "There is 'position: static !important' added as style attribute to the second 'malicious' node");
		assert.strictEqual(aMaliciousNodes[2].getAttribute("style"), "position: static !important;", "There is 'position: static !important' added as style attribute to the third 'malicious' node");
		assert.strictEqual(aMaliciousNodes[3].getAttribute("style"), "position: static !important;", "There is 'position: static !important' added as style attribute to the fourth 'malicious' node");
		assert.strictEqual(oFeedListItem.getDomRef("figure").getAttribute("style"), null, "There is no stile added to the item icon");

		// Act - toggle back to short text
		oFeedListItem._toggleTextExpanded();
		await nextUIUpdate();

		// Assert
		aMaliciousNodes = oFeedListItem.getDomRef().querySelectorAll(".malicious"); // find all "malicious" links

		assert.strictEqual(aMaliciousNodes.length, 2, "there are 2 'malicious' nodes");
		assert.strictEqual(aMaliciousNodes[0].getAttribute("style"), "position: static !important;", "There is 'position: static !important' added as style attribute to the first 'malicious' node");
		assert.strictEqual(aMaliciousNodes[1].getAttribute("style"), "position: static !important;", "There is 'position: static !important' added as style attribute to the second 'malicious' node");
		assert.strictEqual(oFeedListItem.getDomRef("figure").getAttribute("style"), null, "There is no stile added to the item icon");

		// Cleanup
		oFeedListItem.destroy();
		oList.destroy();
		oFeedListItem = null;
		oList = null;
	});
        QUnit.module("Rendering phone", {
		beforeEach: async function() {
				var oSystem = {
					desktop: false,
					phone: true,
					tablet: false
				};
				this.stub(Device, "system").value(oSystem);
				jQuery("html").addClass("sap-phone");
				this.oFeedListItemTemp = new sap.m.FeedListItem({
					icon: "sap-icon://person-placeholder",
					sender: "John Doe",
					timestamp: "Just now"
				});
				this.oFeedListItemTemp.placeAt("qunit-fixture");
				await nextUIUpdate();
		},
		afterEach: function() {
			this.oFeedListItemTemp.destroy();
		}
	});

	QUnit.test('Rendering of the time stamp', function(assert) {
		this.applyTheme = function(sTheme, fnCallback) {
			this.sRequiredTheme = sTheme;
			if (Theming.getTheme() === this.sRequiredTheme) {
				if (typeof fnCallback === "function") {
					fnCallback.bind(this)();
					fnCallback = undefined;
				}
			} else {
				Theming.setTheme(sTheme);
				Theming.attachApplied(fnThemeApplied.bind(this));
			}

			function fnThemeApplied(oEvent) {
				Theming.detachApplied(fnThemeApplied);
				if (typeof fnCallback === "function") {
					fnCallback.bind(this)();
					fnCallback = undefined;
				}
			}
		};
		var done = assert.async();
		this.applyTheme("sap_horizon", async function() {
			this.oFeedListItemTemp.invalidate();
			await nextUIUpdate();
			assert.ok(window.getComputedStyle(document.querySelector('.sapMFeedListItemTimestamp')).marginTop, '-4px', 'No trimming of timestamp');
			done();
		}.bind(this));
	});

	QUnit.module("Tab Order");

	QUnit.test("Tab Order of Feed List Item", async function (assert) {
		// Arrange
		feedListPage.addContent(oFeedList);
		appFeedList.addPage(feedListPage);
		appFeedList.placeAt("qunit-fixture");
		await nextUIUpdate();
		// Assert
		var oFocusFeedListItem = oFeedList.getItems()[11];
		assert.ok(oFocusFeedListItem.getTabbables()[0] == oFocusFeedListItem.oAvatar.getDomRef());
		assert.ok(oFocusFeedListItem.getTabbables()[1] == oFocusFeedListItem._oLinkControl.getDomRef());
		assert.ok(oFocusFeedListItem.getTabbables()[2] == document.getElementsByClassName("_class")[0]);
		assert.ok(oFocusFeedListItem.getTabbables()[3] == document.getElementById("__link14"));

		// Cleanup
		oFocusFeedListItem.destroy();
		oFocusFeedListItem = null;
	});

});