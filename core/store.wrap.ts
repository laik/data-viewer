import { ObjectStore } from './object.store';

export function storeables<S extends ObjectStore>(
  stores: { store: S, iswatch: boolean }[],
) {
  return function classes<T extends { new(...args: any[]): {} }>(
    constructor: T
  ) {
    return class extends constructor {
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
