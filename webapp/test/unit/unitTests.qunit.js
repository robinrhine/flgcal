/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"robin/Calcualtion_Engine/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});