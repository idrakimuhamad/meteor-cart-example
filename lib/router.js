Router.map(function () {
  this.route("home", {
    path: "/",
    waitOn: function () {
      return Meteor.subscribe("items", function () {
       Session.set("itemReady", true);
      });
    },
    controller: "FrontController",
    onBeforeAction: function () {
      // Session.setDefault("itemReady", false);
    }
  });

  this.route("revieworder", {
    path: "/revieworder?",
    waitOn: function () {
      return Meteor.subscribe("items");
    },
    onBeforeAction: function () {
      Session.set("token", this.params.token);
      Session.set("payerid", this.params.PayerID);
      Meteor.call("getEC", this.params.token, function (error, result) {
        if (! error) {
          var response = arrangeResponse(result),
              itemID = [],
              itemQty = [],
              items = [];

          _.each(response, function (v,k) {
            if (k.indexOf("L_PAYMENTREQUEST_0_NUMBER")>-1) {
              itemID.push(v);
            }
            if (k.indexOf("L_PAYMENTREQUEST_0_QTY")>-1) {
              itemQty.push(v);
            }
          });

          _.each(itemID, function (v,i) {
            var item = Items.findOne({ _id : v });
            items.splice(i, 0, item);
            items[i].quantity = itemQty[i];
          });
          Session.set("items", items);

          Session.set("paymentInfoRequested", true);
        }
      });
    },
    controller: "FrontController"
  });

  this.route("completeOrder", {
    path: "/completeOrder",
    onBeforeAction: function () {
    },
    controller: "FrontController"
  });

  this.route("itemPage", {
    path: "/item/:id",
    waitOn: function () {
      return Meteor.subscribe("items");
    },
    data : function() {
      return Items.findOne(this.params.id);
    },
    onBeforeAction: function () {
    },
    controller: "FrontController"
  });

  this.route("cartPage", {
    path: "/cart",
    waitOn: function () {
      return Meteor.subscribe("items");
    },
    data : function() {
    },
    controller: "FrontController",
    onAfterAction: function () {
      Session.set("currentPage", "cart");
      Session.set("setec", false);
    }
  });
});

FrontController = RouteController.extend({
  layoutTemplate: "layout",
  yieldTemplates: {
    "header": {to: "header"},
    "footer": {to: "footer"},
    "notify": {to: "notify"}
  },
  onBeforeAction: function () {
    Session.set("currentPage", null);
  }
});
