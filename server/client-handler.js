import log from '../log';
import capitalize from '../capitalize';
import config from '../config.json';
import ComponentsManager from './components-manager';
import SimpleEventer from '@k2/simple-eventer';

let defaults = {

};

export default class ClientHandler extends SimpleEventer {
    constructor(socket) {
        super();
        this.socket = socket;
        this.componentsManager = new ComponentsManager();
        this.componentsManager.init();
        
        this.init();
    }

    init() {
        let address = this.socket.remoteAddress;
        let port = this.socket.remotePort;

        log('CONNECTED: ' + address +':'+ port);

        this.socket.on('data', this.processData.bind(this));

        this.socket.on('close', (data) => {
            this.fire('disconnected');
            log('CLOSED: ' + address +' '+ port);
        });

        this.socket.on('drain', () => {
            log('DRAIN');
        });

        this.socket.on('end', () => {
            this.fire('disconnected');
            log('END');
        });

        this.socket.on('lookup', () => {
            log('LOOKUP');
        });

        this.socket.on('error', (e) => {
            this.fire('disconnected');
            log('ERROR');
            log(e);
        });
    }

    processData(data) {
        log('RECIEVED: ' + data);
        let message = JSON.parse(data);
        let handleName = 'handle' + capitalize(message.type);

        if(typeof this[handleName] === 'function') {
            this[handleName](message.data);
        }
    }

    // Ktoś publikuje paczkę
    async handlePublish(data) {
        log('PUBLISHING: ' + data.name + ', ' + data.key);
        try {
            await this.componentsManager.syncComponent(data.key, data.name);
            this.commandPublish(true);
        } catch(e) {
            this.commandPublish(false); 
        }
    }

    // Paczka opublikowana
    commandPublish(status) {
        log('commandPublish');
        this.send('publish', {status});
    }


    send(type, data) {
        log('SENDING');
        log('TYPE ' + type);
        log(this.socket.write(JSON.stringify({type, data})));
    }
}
