Items = new Meteor.Collection("items");

// Set the permission
Items.allow({
  insert: function (userId, booking) {
    return false; // disallow any insertion from client. use method instead
  },
  update: function (userId, party, fields, modifier) {
    return false; // disallow any insertion from client. use method instead
  },
  remove: function (userId, party) {
    return false; // disallow any insertion from client. use method instead
  }
});

// API credentials
var user = "lulz_api1.ebay.com",
    password = "1394421936",
    signature = "AFcWxV21C7fd0v3bYYYRCpSSRl31AS4PTBFxknVnTdhxVPQtr4rk.0An",
    nvp = "&USER=" + user + "&PWD=" + password + "&SIGNATURE=" + signature;

//PayPal Sandbox URL
redirectEC= "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=";

//PayPal Sandbox endpoint
endpoint = "https://api-3t.sandbox.paypal.com/nvp";

// SetEC
Meteor.methods({
  setEC: function (items, rootURL) {
    var previousId = null,
        totalPrice = 0,
        c = [],
        itemRequest = "";

    _.each(items, function(el, i) {
      var item = Items.findOne(el.itemID);
      totalPrice += item.price*el.quantity;

      itemRequest += "&L_PAYMENTREQUEST_0_NUMBER" + i + "=" + item._id + "&L_PAYMENTREQUEST_0_NAME" + i + "=" + item.itemName + "&L_PAYMENTREQUEST_0_QTY" + i + "="
      + el.quantity + "&L_PAYMENTREQUEST_0_AMT" + i + "=" + item.price;
    });

    this.unblock();
    if (Meteor.isServer) {
      return Meteor.http.call("GET", endpoint, {
          query: nvp+"&METHOD=SetExpressCheckout&VERSION=95.0"
          + "&RETURNURL=" + rootURL + "/revieworder"
          + "&CANCELURL=" + rootURL
          + "&PAYMENTREQUEST_0_CURRENCYCODE=USD"
          + "&LOCALCODE=US"
          + "&NOSHIPPING=1"
          + "&PAYMENTREQUEST_0_AMT=" + totalPrice.toFixed(2)
          + "&PAYMENTREQUEST_0_ITEMAMT=" + totalPrice.toFixed(2)
          + "&PAYMENTREQUEST_0_DESC=Video Game from MeteorCart"
          + "&PAYMENTREQUEST_0_PAYMENTACTION=Sale" + itemRequest
      });
    }
  },
  getEC: function (token) {
    this.unblock();
    if (Meteor.isServer) {
      return Meteor.http.call("GET", endpoint, {
          query: nvp+"&METHOD=GetExpressCheckoutDetails&VERSION=95.0"
          + "&TOKEN=" + token
      });
    }
  },
  doEC: function (items, token, payerid) {
    var totalPrice = 0,
        itemRequest = "";

    _.each(items, function(el, i) {
      var price = +el.price,
          quantity = +el.quantity,
          itemName = el.itemName;

      totalPrice += price*quantity;
      itemRequest += "&L_PAYMENTREQUEST_0_NAME" + i + "=" + itemName + "&L_PAYMENTREQUEST_0_QTY" + i + "="
      + quantity + "&L_PAYMENTREQUEST_0_AMT" + i + "=" + price.toFixed(2);
    });

    this.unblock();
    if (Meteor.isServer) {
      return Meteor.http.call("GET", endpoint, {
          query: nvp+"&METHOD=DoExpressCheckoutPayment&VERSION=95.0"
          + "&PAYMENTREQUEST_0_CURRENCYCODE=USD"
          + "&LOCALCODE=US"
          + "&TOKEN=" + token
          + "&PAYERID=" + payerid
          + "&NOSHIPPING=1"
          + "&PAYMENTREQUEST_0_AMT=" + totalPrice.toFixed(2)
          + "&PAYMENTREQUEST_0_ITEMAMT=" + totalPrice.toFixed(2)
          + "&PAYMENTREQUEST_0_DESC=Video Game from MeteorCart"
          + "&PAYMENTREQUEST_0_PAYMENTACTION=Sale"
          + itemRequest
      });
    }
  }
});
