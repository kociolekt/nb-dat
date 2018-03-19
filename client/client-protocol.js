import net from 'net';
import log from '../config.json';
import SimpleEventer from '@k2/simple-eventer';

let defaults = {
    autoconnect: false,
    host: config.host,
    port: config.port,
    verbose: 1
};

export default class ClientProtocol extends SimpleEventer {
    constructor(options) {
        super();

        this.settings = Object.assign({}, defaults, options);

        this.client = null;

        if(this.settings.autoconnect) {
            this.connect();
        }
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.client = new net.Socket();

            this.client.connect(this.settings.port, this.settings.host, () => {
                log('CONNECTED TO: ' + config.host + ':' + config.port);

                this.client.on('data', this.processData.bind(this));

                this.client.on('close', function() {
                    log('DISCONNECTED (BY SERVER)');
                });

                this.fire('connected');
                resolve(this);
            });
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

    // Publikacja paczki
    commandPublish(key, name) {
        this.send('publish', {key, name});
    }

    // Odebranie iformacji czy udalo sie opublikowac
    handlePublish(data) {
        this.fire('publish', data);
    }

    send(type, data) {
        this.client.write(JSON.stringify({type, data}));
    }

    disconnect() {
        log('DISCONNECTED (BY CLIENT)');
        this.client.destroy();
    }

    log(message) {
        if(this.settings.verbose) {
            console.log(message);
        }
    }
}
