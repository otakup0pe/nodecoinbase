var HotTap = require('hottap').hottap;
var _ = require('underscore');

var base_url = 'https://coinbase.com/api/v1/';

function buy_price(amount, next) {
    var url = base_url + 'prices/buy?qty=' + amount;
    return HotTap(url).request('GET', function(err, response) {
                                   if ( err ) { return next(err); };
                                   if ( response.status != 200 ) {
                                       return next('invalid status ' + response.status + ' received');
                                   } else {
                                       var json = JSON.parse(response.body);
                                       if ( _.isUndefined(json.amount) || _.isUndefined(json.currency) ) {
                                           return next('invalid response received');
                                       } else {
                                           if ( json.currency != 'USD' ) {
                                               return next('invalid currency received');
                                           } else {
                                               return next(null, json.amount);                                  
                                           }
                                       }
                                   }
                               });
}

function sell_price(amount, next) {
    var url = base_url + 'prices/sell?qty=' + amount;
    return HotTap(url).request('GET', function(err, response) {
                                   if ( err ) { return next(err); };
                                   if ( response.status != 200 ) {
                                       return next('invalid status ' + response.status + ' received');
                                   } else {
                                       var json = JSON.parse(response.body);
                                       if ( _.isUndefined(json.amount) || _.isUndefined(json.currency) ) {
                                           return next('invalid response received');
                                       } else {
                                           if ( json.currency != 'USD' ) {
                                               return next('invalid currency received');
                                           } else {
                                               return next(null, json.amount);                                  
                                           }
                                       }
                                   }
                               });
}

function balance(api_key, next) {
    var url = base_url + 'account/balance?api_key=' + api_key;
    return HotTap(url).request("GET", function(err, response) {
                      if ( err ) { return next(err); };
                      if ( response.status != 200 ) {
                          return next('invalid status ' + response.status + ' received');
                      } else {
                          var json = JSON.parse(response.body);
                          if ( _.isUndefined(json.amount) || _.isUndefined(json.currency) ) {
                              return next('invalid response received');
                          } else {
                              if ( json.currency != 'BTC' ) {
                                  return next('invalid currency received');
                              } else {
                                  return next(null, json.amount);                                  
                              }
                          }
                      }
                  });
}

function send_btc(api_key, email, amount, note, next) {
    var url = base_url + 'transactions/send_money?api_key=' + api_key;
    var o_body = {
        transaction : {
            to : email,
            amount : amount,
            note : note
        }
    };
    return HotTap(url).request("POST", 
                               {"Content-Type" : "application/json"},
                               JSON.stringify(o_body),
                               function(err, response) {
                                   if ( err ) { return next(err); };
                                   if ( response.status != 200 ) {
                                       return next('invalid status ' + response.status + ' received');
                                   } else {
                                       var json = JSON.parse(response.body);
                                       if ( _.isUndefined(json.success) ) {
                                           return next('invalid response received (no success)');
                                       } else {
                                           if ( ! json.success ) {
                                               return next(JSON.stringify(json.errors));
                                           } else {
                                               if ( _.isUndefined(json.transaction.id) ) {
                                                   return next('invalid response received (no transaction id)');
                                               }
                                               return next(null, json.transaction.id);
                                           }
                                       }
                                   }
                               });
}

module.exports = {
    balance:balance,
    send_btc:send_btc,
    buy_price:buy_price,
    sell_price:sell_price
}