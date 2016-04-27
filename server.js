'use strict';

const app          = require('koa')();
const bodyParser   = require('koa-bodyparser');
const send         = require('koa-send');
const serve        = require('koa-static');
const router       = require('koa-router')();

app.use(bodyParser());
app.use(serve('dist'));

app.use(function* () {
    yield send(this, '/dist/index.html');
});

app.on('error', err => console.log(err));

app.listen(7777, () => console.log('example running on port 8888'));
