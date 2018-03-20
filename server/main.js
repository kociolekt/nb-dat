import NotBitServer from './not-bit-server';

let notBitServer = new NotBitServer();

/*
var net = require('net');
var archiver = require('hypercore-archiver');
var hypercore = require('hypercore');

var ar = archiver('./archiver');
var feed = hypercore('./feed');
var HOST = '127.0.0.1';
var PORT = 6969;
*/
/*
net.createServer(function(sock) {

    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

    sock.on('data', function(data) {

        //console.log('DATA ' + sock.remoteAddress + ': ' + data);
        //sock.write('You said "' + data + '"');


    });

    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);
*/


/*
feed.on('ready', function () {
  ar.add(feed.key, function (err) {
    console.log('will now archive the feed')
  })
})

ar.on('sync', function (feed) {
  console.log('feed is synced', feed.key)
})*/
