import archiver from 'hypercore-archiver';
import hypercore from 'hypercore';
import log from '../log';
import SimpleEventer from '@k2/simple-eventer';
import JsonDB from 'node-json-db';

let defaults = {
    cwd: process.cwd(),
    dbName: 'nbsdb',
    archiverPath: './archiver',
    feedPath: './feed'
};

let instance = null;

export default class ComponentsManager {
  constructor(options) {

    if(instance) {
      return instance;
    } else {
      instance = this;
    }

    this.settings = Object.assign({}, defaults, options);

    this.db = null;
    this.archiver = null;
    this.feed = null;
    this.synced = null;
  }

  async init() {
    this.initDatabase();
    this.initArchiver();
    await this.initFeed();
  }

  initDatabase() {
    this.db = new JsonDB(this.settings.dbName, true, false);
  }

  initArchiver() {
    this.archiver = archiver(this.settings.archiverPath);
    this.synced = new SimpleEventer();
    this.archiver.on('sync', (feed) => {
      console.log('Feed is synced', feed.key);
      this.synced.fire('sync', feed.key);
    })
  }

  initFeed() {
    return new Promise((resolve, reject) => {
      this.feed = hypercore(this.settings.feedPath);

      this.feed.on('ready', () => {
        resolve();
      })
    });
  }

  syncComponent(key, name) {
    return new Promise((resolve, reject) => {
      log('SYNC OF')

      let isSynced = ({target: syncedKey}) => {
        if(key === syncedKey) {
          this.synced.off('sync', isSynced);
          this.db.push('/nameToKey/' + name, key);
          this.db.push('/keyToName/' + key, name);
          resolve(syncedKey);
        }
      }

      this.synced.on('sync', isSynced);

      this.archiver.add(key, (err) => {
        if(err) {
          this.synced.off('sync', isSynced);
          reject(err);
        }
        console.log('Syncing feed ' + key);
      });
    });
  }
}
