"use strict";

const ccxt = require ('ccxt'),
    asTable = require ('as-table'),
    asciichart = require ('asciichart'),
    log = require ('ololog').configure ({ locate: false });
require ('ansicolor').nice

let sleep = (ms) => new Promise (resolve => setTimeout (resolve, ms));

(async () => {
    let exchange = new ccxt.bittrex  ({
        "apiKey": "x",
        "secret": "x",
    })
    try {
        const orders = await exchange.fetchOrders ()
        log (asTable (orders.map (order => ccxt.omit (order, [ 'timestamp', 'info' ]))))
        const order = await exchange.fetchOrder (orders[0]['id'])
        log (order);
    } catch (e) {
        if (e instanceof ccxt.DDoSProtection || e.message.includes ('ECONNRESET')) {
            log.bright.yellow ('[DDoS Protection] ' + e.message)
        } else if (e instanceof ccxt.RequestTimeout) {
            log.bright.yellow ('[Request Timeout] ' + e.message)
        } else if (e instanceof ccxt.AuthenticationError) {
            log.bright.yellow ('[Authentication Error] ' + e.message)
        } else if (e instanceof ccxt.ExchangeNotAvailable) {
            log.bright.yellow ('[Exchange Not Available Error] ' + e.message)
        } else if (e instanceof ccxt.ExchangeError) {
            log.bright.yellow ('[Exchange Error] ' + e.message)
        } else if (e instanceof ccxt.NetworkError) {
            log.bright.yellow ('[Network Error] ' + e.message)
        } else {
            throw e;
        }
    }
}) ();
