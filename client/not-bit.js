import config from '../config.json';
import ClientProtocol from './client-protocol';

export default class NotBit {
    constructor() {
        this.clientProtocol = null;

        this.init();
    }

    init() {
        this.initConnection();
    }

    initConnection() {
        this.clientProtocol = new ClientProtocol();
    }

    async publish() {
        await this.clientProtocol.connect();
        this.clientProtocol.commandPublish('testkey', 'testname');
    }
}
