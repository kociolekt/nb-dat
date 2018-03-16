let log = require('../config.json');
let config = require('../config.json');

let SimpleEventer = require('@k2/simple-eventer');

let defaults = {

};

class ClientHandler extends SimpleEventer {
    constructor(socket) {
        super();
        this.socket = socket;

        this.init();
    }

    init() {
        log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);

        this.socket.on('data', this.processData.bind(this));

        this.socket.on('close', (data) => {
            this.fire('disconnected');
            log('CLOSED: ' + this.socket.remoteAddress +' '+ this.socket.remotePort);
        });
    }

    processData(data) {
        log('RECIEVED: ' + data);
        let message = JSON.parse(data);
        let handleName = 'handle' + message.type.toUpperCase();

        if(typeof this[handleName] === 'function') {
            this[handleName](message.data);
        }
    }

    // Ktoś publikuje paczkę
    handlePublish(data) {
        log('PUBLISHING: ' + data.name + ', ' + data.key);

        this.commandPublish(true);
    }

    // Paczka opublikowana
    commandPublish(status) {
        this.send('publish', {status});
    }


    send(type, data) {
        this.socket.write(JSON.stringify({type, data}));
    }
}

module.exports = ClientHandler;
