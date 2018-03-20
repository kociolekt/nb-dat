import path from 'path';
import log from '../log';
import config from '../config.json';
import ClientProtocol from './client-protocol';
import ClientDat from './client-dat';

export default class NotBit {
    async publish(componentPath) {
        let clientProtocol = new ClientProtocol();
        let clientDat = new ClientDat();

        await clientProtocol.connect();

        let key = await clientDat.share(componentPath);
        let name = path.basename(path.dirname(componentPath));

        clientProtocol.on('publish', (data) => {
            log('PUBLISHED ' + data);
        });
        clientProtocol.commandPublish(key, name);
    }
}
