var HotTap = require('hottap').hottap;
var _ = require('underscore');

var base_url = 'https://coinbase.com/api/v1/';

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

module.exports = {
    balance:balance
}