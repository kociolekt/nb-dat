var net = require('net');
var Dat = require('dat-node');

var HOST = '127.0.0.1';
var PORT = 6969;
var src = process.cwd();

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('I am Chuck Norris!');

});

client.on('data', function(data) {
    
    console.log('DATA: ' + data);
    client.destroy();
});

client.on('close', function() {
    console.log('Connection closed');
});



Dat(src, {temp: true}, function (err, dat) {
  if (err) throw err

  var network = dat.joinNetwork()
  network.once('connection', function () {
    console.log('Connected')
  })
  var progress = dat.importFiles(src, {
    ignore: ['**/node_modules/**']
  }, function (err) {
    if (err) throw err
    console.log('Done importing')
    console.log('Archive size:', dat.archive.content.byteLength)
  })
  progress.on('put', function (src, dest) {
    console.log('Added', dest.name)
  })

  console.log(`Sharing: ${dat.key.toString('hex')}\n`)
})
