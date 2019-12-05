sap.ui.define([
	"co/uk/nathanhand/azure/controller/baseController",
	"sap/ui/model/json/JSONModel"
], function(baseController, JSONModel) {
	"use strict";

	return baseController.extend("co.uk.nathanhand.azure.controller.mainView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function() {
			this.authenticateOnAzure();
		},

		setAzureProfileModel: function(user){
			var userData = new JSONModel(user.profile);
			this.getView().setModel(userData, "azureUser");	
		},

		authenticateOnAzure: function(){
			var authContext = this.returnAuthContext();
					var user = authContext.getCachedUser();
					debugger;
					if (user) {
						this.setAzureProfileModel(user);
						//set user data to a model maybe?
					} else {
						this.loginAndSetToken();
					}
		},

		loginAndSetToken: function(){
			var authContext = this.returnAuthContext();
			if (authContext.isCallback(window.location.hash)) {
				authContext.handleWindowCallback();
			}
			var user = authContext.getCachedUser();
			if (user) {
				authContext.acquireToken(authContext.config.clientId, function (error, token) {
					if (error) {
						if (isCallback && !authContext.getLoginError()) {
							window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
						}
					} else {
						//Tokens are often required for secure API calls
						localStorage.setItem("token", token);
					}
				});
			} else {
				authContext.login();
			}
		},

		returnAuthContext: function () {
			if (!this._authContext) {
				var config = {
					tenant: 	"YOUR TENANT ID",
					clientId: 	"YOUR CLIEND ID",
					postLogoutRedirectUri: window.location.origin,
					cacheLocation: 'localStorage' // enable this for IE, as sessionStorage does not work for localhost.
				};
				this._authContext = new AuthenticationContext(config);
			}
			return this._authContext;
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 */
		onBeforeRendering: function() {

		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 */
		onAfterRendering: function() {

		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 */
		onExit: function() {

		}
	});
});