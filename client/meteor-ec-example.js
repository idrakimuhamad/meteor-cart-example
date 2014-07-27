// Local collection for cart item
Cart = new Meteor.Collection(null);

Template.header.helpers({
  cartCount: function () {
    var cart = Cart.find({}).fetch(),
        count = 0;

    _.each(cart, function (el, i) {
      count += el.quantity;
    });

    return count > 1 ? count + " items": count + " item";
  }
});

Template.home.helpers({
  game: function () {
    return Items.find({});
  }
});

Template.home.events({
  'click .add-to-cart': function (e, t) {
    e.preventDefault();
    var itemID = $(e.currentTarget).closest(".shop-item").data("id");
    console.log(itemID);
    Cart.update({ "itemID" : itemID },
      { $inc: {quantity: 1} },
      { upsert: true }, function (error, result) {
      if (!error) {
        Session.set("itemAdded", true);
        Meteor.setTimeout(function () {
          Session.set("itemAdded", false);
        }, 3000);
      }
    });
  },
  'click .view': function (e) {
    window.scroll(0,0);
  }
});

Template.itemPage.events({
  'click .add-to-cart': function (e) {
    e.preventDefault();
    var itemID = $(e.currentTarget).closest(".item-container").data("id");
    Cart.update({ "itemID" : itemID },
      { $inc: {quantity: 1} },
      { upsert: true }, function (error, result) {
      if (!error) {
        Session.set("itemAdded", true);
        Meteor.setTimeout(function () {
          Session.set("itemAdded", false);
        }, 3000);
      }
    });
  }
});

Template.cartPage.helpers({
  items: function () {
    if (Items.findOne() && Session.equals("currentPage", "cart")) {
      var cartItems = Cart.find({}, {sort: {itemID: 1}}).fetch(),
          items = [];

      _.each(cartItems, function(el, i) {
        var item = Items.findOne(el.itemID);
        items.splice(i, 0, item);
        items[i].quantity = el.quantity;
      });

      return items;
    }
  },
  item: function () {
    return this;
  },
  imageURL: function () {
    return this.imageURL
  },
  itemPrice: function () {
    return this.price;
  },
  totalPrice: function () {
    var totalPrice = 0;

    _.each(this, function(el, i) {
      var price = +el.price,
          quantity = +el.quantity;

      totalPrice += price*quantity;
    });

    return totalPrice.toFixed(2);
  },
  request: function () {
    return Session.get("setec");
  },
  done: function () {
    return Session.get("doneSet");
  },
  visible: function () {
    return Session.get("setec") || Session.get("doneSet") ? "visible" : "";
  }
});

Template.cartPage.events({
  'click .checkout-paypal': function (e) {
    e.preventDefault();
    var cartItems = Cart.find({}, {sort: {itemID: 1}}).fetch();
    if (cartItems.length) {
      Session.set("setec", true);

      Meteor.call("setEC", cartItems, function (error, result) {
        if (! error) {
          Session.set("setec", false);
          Session.set("doneSet", true);
          var response = arrangeResponse(result);
          window.location = redirectEC + escape(response.TOKEN);
        }
      });
    }
  }
});

Template.revieworder.helpers({
  detailsRequested: function () {
    return Session.get("paymentInfoRequested");
  },
  orderDetails: function () {
    return Session.get("items");
  },
  imageURL: function () {
    return this.imageURL
  },
  itemName: function () {
    return this.itemName;
  },
  itemPrice: function () {
    return this.price;
  },
  quantity: function () {
    return this.quantity;
  },
  totalPrice: function () {
    var totalPrice = 0;

    _.each(this, function(el, i) {
      var price = +el.price,
          quantity = +el.quantity;

      totalPrice += price*quantity;
    });

    return totalPrice.toFixed(2);
  },
  processingPayment: function () {
    return Session.get("processingPayment");
  },
  visible: function () {
    return Session.get("processingPayment") ? "visible" : "";
  }
});

Template.revieworder.events({
  'click .pay-now': function (e) {
    e.preventDefault();
    Session.set("processingPayment", true);

    var token = Session.get("token"),
        payerid = Session.get("payerid");

    Meteor.call("doEC", Session.get("items"), token, payerid, function (error, result) {
      if (! error) {
        var response = arrangeResponse(result);
        Router.go("/completeorder");
      }
    });
  }
});

Template.completeOrder.helpers({
  booking: function () {
    return parseInt(Math.random() * (99999 - 10000) + 10000);
  }
});

Template.notify.helpers({
  visible: function () {
    return Session.get("itemAdded") || Session.get("itemRemoved") ? "visible" : "";
  },
  itemAdded: function () {
    return Session.get("itemAdded");
  },
  itemRemoved: function () {
    return Session.get("itemRemoved");
  }
});

arrangeResponse = function (result) {
  var response = new Object;
  var content = unescape(result.content);
  content = content.split("&");
  for (var i = 0; i < content.length; i++) {
    var title = content[i].split("=");
    if(title.length > 1) {
      response[title[0].toUpperCase()] = title[1];
    }
  }
  return response;
}