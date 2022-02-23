import { ObjectStore } from './object.store';

export function storeables<S extends ObjectStore>(
  s: S[],
  isWatch: boolean = true // 是否监听
) {
  return function classes<T extends { new(...args: any[]): {} }>(
    constructor: T
  ) {
    return class extends constructor {
      defaultSortInfo = { name: 'updatetime', dir: -1 };
      componentDidMount() {
        // 页面生命周期挂载完成后，批量加载资源，创建 watch 接口
        s.map(item => {
          item
            .loadAll()
            .then(() => {
              if (item.isLoaded) {
                isWatch ? item.watch() : () => { };
              }
            })
            .catch(err => {
              console.error(err);
            });
        });
      }
      componentWillUnmount() {
        // 页面生命周期即将销毁时，批量注销资源
        s.map(item => item.stop());
      }
    };
  };
}
