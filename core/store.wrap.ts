import { IObject } from '.';
import { ObjectStore } from './object.store';


export interface IStore<T extends ObjectStore<IObject>> {
  stores: Store<T>[];
  getStore(key: keyof T): T;
}

export interface Store<S extends ObjectStore<IObject>> {
  store: S;
  iswatch: boolean;
}

export function storeables<S extends ObjectStore<IObject>>(
  stores: Store<S>[],
) {
  return function classes<T extends { new(...args: any[]): {} }>(
    constructor: T
  ) {
    return class extends constructor {
      stores = stores;
      componentDidMount() {
        stores.map(item => {
          const { store, iswatch } = item;
          store.loadAll()
            .then(() => {
              if (store.isLoaded) {
                iswatch ? store.watch() : () => { };
              }
            })
            .catch(err => {
              console.error(err);
            });
        });
      }
      componentWillUnmount() {
        stores.map(item => {
          const { store, } = item;
          store.stop();
        });
      }
    };
  };
}
