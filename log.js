let config = require('./config.json');

export default function log(message) {
    if(config.verbose) {
        console.log(message);
    }
}
