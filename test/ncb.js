var sinon = require('sinon');
var assert = require('assert');
var ncb = require('../ncb');
var nock = require('nock');

describe('balance', function() {
             it("should return a number", function(done) {
                    var scope = nock("https://coinbase.com")
                        .filteringPath(/api_key=[^&]*/g, 'api_key=XXX')
                        .get("/api/v1/account/balance?api_key=XXX")
                        .reply(200, {currency:"BTC", amount:42});
                    return ncb.balance('foo', function(err, balance) {
                                    if ( err ) { throw err; }
                                    assert(balance == 42);
                                    done();
                                });
                    });
});