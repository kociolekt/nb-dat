let Dat = require('dat-node');
let log = require('../config.json');

let defaults = {
    ignore: ['**/node_modules/**'],
    componentDir: process.cwd(),
    verbose: 1
};

class ClientDat {
    constructor(options) {
        this.dat = null;

        this.settings = Object.assign({}, defaults, options);
    }

    share(name) {
        return new Promise((resolve, reject) => {
            let dir = this.settings.componentDir;

            Dat(dir, {temp: true}, (err, dat) => {
                if (err) {
                    reject(err);
                }

                let network = dat.joinNetwork();

                network.once('connection', () => {
                    log('Connected');
                });

                let progress = dat.importFiles(dir, {
                    ignore: this.settings.ignore
                }, (err) => {
                    if (err) {
                        reject(err);
                    }
                    log('Done importing');
                    log('Archive size:', dat.archive.content.byteLength);
                    resolve();
                });

                progress.on('put', (src, dest) => {
                    log('Added', dest.name);
                });

                log(`Sharing: ${dat.key.toString('hex')}\n`);
            });
        });
    }

    download() {
        return new Promise((resolve, reject) => {
            let dir = this.settings.componentDir;

            Dat(dir, {temp: true}, (err, dat) => {
                if (err) {
                    throw err;
                }

                let network = dat.joinNetwork();

                network.once('connection', () => {
                    log('Connected');
                });

                let progress = dat.importFiles(dir, {
                    ignore: this.settings.ignore
                }, (err) => {
                    if (err) throw err;
                    log('Done importing');
                    log('Archive size:', dat.archive.content.byteLength);
                });

                progress.on('put', (src, dest) => {
                    log('Added', dest.name);
                });

                log(`Sharing: ${dat.key.toString('hex')}\n`);
            });
        });
    }

    async close() {
        return new Promise((resolve, reject) => {
            if(this.dat) {
                this.dat.close(resolve);
            } else {
                resolve();
            }
        });
    }
}

module.exports = ClientDat;
