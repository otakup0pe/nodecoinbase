var sinon = require('sinon');
var assert = require('assert');
var ncb = require('../ncb');
var nock = require('nock');

describe('balance', function() {
             it('should return a number', function(done) {
                    var scope = nock('https://coinbase.com')
                        .filteringPath(/api_key=[^&]*/g, 'api_key=XXX')
                        .get('/api/v1/account/balance?api_key=XXX')
                        .reply(200, {currency:'BTC', amount:42});
                    return ncb.balance('foo', function(err, balance) {
                                           if ( err ) { throw err; }
                                           assert(balance == 42);
                                           done();
                                       });
                });
             it('should throw 401 on bad key', function(done) {
                    var scope = nock('https://coinbase.com')
                        .filteringPath(/api_key=[^&]*/g, 'api_key=XXX')
                        .get('/api/v1/account/balance?api_key=XXX')
                        .reply(401);
                    return ncb.balance('foo', function(err, balance) {
                                           assert(err == 'invalid status 401 received');
                                           done();
                                       });
                });
         });

describe('send_btc', function() {
             it('should return a transaction id', function(done) {
                    var scope = nock('https://coinbase.com')
                        .filteringPath(/api_key=[^&]*/g, 'api_key=XXX')
                        .post('/api/v1/transactions/send_money?api_key=XXX',
                              {
                                  transaction :
                                  {
                                      to: 'foo@bar.com',
                                      amount: 42,
                                      note: 'doin thangs'
                                  }
                              })
                        .reply(200,
                               {
                                   success:true,
                                   transaction :
                                   {
                                       id: "42"
                                   }
                               });
                    return ncb.send_btc('foo', 'foo@bar.com', 42, 'doin thangs', function(err, id) {
                                            if ( err ) { throw err; }
                                            assert(id == '42');
                                            done();
                                        });
                });
             it('should throw 401 on bad key', function(done) {
                    var scope = nock('https://coinbase.com')
                        .filteringPath(/api_key=[^&]*/g, 'api_key=XXX')
                        .get('/api/v1/account/balance?api_key=XXX')
                        .reply(401);
                    return ncb.balance('foo', function(err, balance) {
                                           assert(err == 'invalid status 401 received');
                                           done();
                                       });
                });


         });