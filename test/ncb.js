var sinon = require('sinon');
var assert = require('assert');
var ncb = require('../ncb');
var nock = require('nock');
var _ = require('underscore');

function nockit(method, suffix, body) {
    var scope = nock('https://coinbase.com')
        .filteringPath(/api_key=[^&]*/g, 'api_key=XXX');
    if ( _.isUndefined(body) ) {
        scope = scope.intercept('/api/v1/' + suffix + '?api_key=XXX', method);
    } else {
        scope = scope.intercept('/api/v1/' + suffix + '?api_key=XXX', method, body);
    }
    return scope;
}

describe('balance', function() {
             it('should return a number', function(done) {
                    var scope = nockit('GET', 'account/balance')
                        .reply(200, {currency:'BTC', amount:42});
                    return ncb.balance('foo', function(err, balance) {
                                           if ( err ) { throw err; }
                                           assert(balance == 42);
                                           done();
                                       });
                });
             it('should throw 401 on bad key', function(done) {
                    
                    var scope = nockit('GET', 'account/balance')
                        .reply(401);
                    return ncb.balance('foo', function(err, balance) {
                                           assert(err == 'invalid status 401 received');
                                           done();
                                       });
                });
         });

describe('send_btc', function() {
             var t_to = 'foo@bar.com';
             var t_amount = 42;
             var t_note = 'doin thangs';
             var n_body = {
                 transaction :
                 {
                     to: t_to,
                     amount: t_amount,
                     note: t_note
                 }
             };
             it('should return a transaction id', function(done) {
                    var scope = nockit('POST', 'transactions/send_money', n_body);
                        scope.reply(200,
                               {
                                   success:true,
                                   transaction :
                                   {
                                       id: "42"
                                   }
                               });
                    return ncb.send_btc('foo', t_to, t_amount, t_note, function(err, id) {
                                            if ( err ) { throw err; }
                                            assert(id == '42');
                                            done();
                                        });
                });
             it('should throw 401 on bad key', function(done) {
                    var scope = nockit('POST', 'transactions/send_money', n_body);
                    scope.reply(401);
                    return ncb.send_btc('foo', t_to, t_amount, t_note, function(err, id) {
                                                assert(err == 'invalid status 401 received');
                                                done();
                                       });
                });


         });