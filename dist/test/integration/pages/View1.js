sap.ui.define(["sap/ui/test/Opa5"],function(e){"use strict";var i="View1";e.createPageObjects({onTheAppPage:{actions:{},assertions:{iShouldSeeTheApp:function(){return this.waitFor({id:"app",viewName:i,success:function(){e.assert.ok(true,"The View1 view is displayed")},errorMessage:"Did not find the View1 view"})}}}})});