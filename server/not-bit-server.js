import log from '../log';
import net from 'net';
import SimpleEventer from '@k2/simple-eventer';
import ClientHandler from './client-handler';
import config from '../config.json';

let defaults = {
    autolisten: true,
    host: config.host,
    port: config.port
};

export default class NotBitServer extends SimpleEventer {
    constructor(options) {
        super();

        this.settings = Object.assign({}, defaults, options);

        this.server = null;
        this.clients = [];

        if(this.settings.autolisten) {
            this.listen();
        }
    }

    listen() {
        this.server = net.createServer((sock) => {
            let client = new ClientHandler(sock);

            this.clients.push(client);

            client.on('disconnected', () => {
                let index = this.clients.indexOf(client);

                if (index > -1) {
                    this.clients.splice(index, 1);
                }
            });
        }).listen(this.settings.port, this.settings.host);

        log('Server listening on ' + this.settings.host + ':' + this.settings.port);
    }
}
