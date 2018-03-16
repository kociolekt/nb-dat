let config = require('../config.json');
let ClientProtocol = require('./client-protocol');

class NotBit {
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

module.exports = NotBit;
