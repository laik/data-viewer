import { merge } from 'lodash';
import { action, computed, observable, reaction } from 'mobx';
import { ItemStore } from './item.store';
import { IObject } from './object';
import { IObjectApiQueryParams, ObjectApi } from './object.api';
import { IObjectWatchEvent, objectWatchApi } from './object.watch.api';
import { redux_userconfig } from './redux.store';
import { bind } from './utils/bind';

export interface IObjectStoreParams {
  ns: string;
  labels?: {
    [label: string]: string;
  };
}

type NoopCB = () => void;

@bind()
export abstract class ObjectStore<T extends IObject> extends ItemStore<T> {
  abstract api: ObjectApi<T>;
  public limit: number = -1;

  private defers: NoopCB[] = [];
  private userConfig = redux_userconfig();

  watch() {
    this.bindWatchEventsUpdater();
    this.defers.push(
      ...[objectWatchApi.addListener(this, this.onWatchApiEvent)]
    );
    this.defers.push(...this.api.watch());
  }

  stop() {
    this.defers.reverse().map(cb => cb());
    objectWatchApi.reset();
  }

  getById(id: string): T {
    return this._items.find(item => item.getId() === id);
  }

  protected async loadItems(ns?: string[]): Promise<T[]> {
    const { limit } = this;
    const querys = this.querys({ limit });
    if (!ns || ns.length == 0) {
      return this.api.list({}, querys);
    } else {
      return Promise.all(ns.map(ns => this.api.list({ ns }), querys)).
        then(items => items.flat());
    }
  }

  @action
  async loadAll() {
    let items: T[];
    this.isLoading = true;
    try {
      items = await this.loadItems()
    } catch (e) {
    } finally {
      if (this.items) {
        this._items.replace(items);
      }
      this.isLoaded = true
      this.isLoading = false
    }
  }

  protected async createItem(params: IObjectStoreParams, data?: Partial<T>, query?: IObjectApiQueryParams): Promise<T> {
    return this.api.create(params, data, query);
  }

  async create(params: IObjectStoreParams, data?: Partial<T>, query?: IObjectApiQueryParams): Promise<T> {
    const querys = this.querys(query);
    const newItem = await this.createItem(params, data, querys);
    if (this._items.findIndex(item => item?.getId() === newItem?.getId()) > 0) {
      return newItem;
    }
    const items = this.sortItems([...this._items, newItem]);
    this._items.replace(items);
    return newItem;
  }

  async apply(item: T, data?: Partial<T>, query?: IObjectApiQueryParams): Promise<T> {
    const querys = this.querys(query);
    if (
      this._items.findIndex(
        item => {
          item.getId() == item.getId() && item.getNs() == item.getNs();
        }) > 0
    ) {
      return this.update(item, data, querys);
    }
    return this.create({ ns: item.getNs() }, data, querys);
  }

  protected querys(query?: IObjectApiQueryParams): IObjectApiQueryParams {
    // 数据库分库后增加查询条件（database | schmea split by tenant)
    return merge({}, query);
  }

  async update(item: T, data: Partial<T>, query?: IObjectApiQueryParams): Promise<T> {
    // 从`api update`更新成功以后回写入`itemsStore item`
    const querys = this.querys(query);
    const newItem = await item.update(this, data, querys);
    const index = this._items.findIndex(
      item => item.getId() === newItem.getId()
    );
    this._items.splice(index, 1, newItem);
    return newItem;
  }

  async remove(item: { ns: string; id: string } | T, query?: IObjectApiQueryParams): Promise<T> {
    // 从`api delete`更新成功以后移除`itemsStore item`
    let id, ns;
    if (item instanceof IObject) {
      id = item.getId();
      ns = item.getNs();
    } else {
      id = item.id;
      ns = item.ns;
    }
    const querys = this.querys(query);
    const removeItem = await this.api
      .delete({ id: id, ns: ns }, querys)
      .then(item => {
        this.removeItem(item);
        return item;
      });
    return removeItem;
  }

  // collect items from watch-api events to avoid UI blowing up with huge streams of data
  protected eventsBuffer = observable<IObjectWatchEvent<IObject>>(
    [],
    {
      deep: false,
    }
  );

  protected bindWatchEventsUpdater(delay = 1000) {
    return reaction(
      () => this.eventsBuffer.slice()[0],
      this.updateFromEventsBuffer,
      {
        delay: delay,
      }
    );
  }

  subscribe(apis = [this.api]) {
    apis = apis.filter(api => (true ? api.isNs : true));
    return ObjectApi.watchAll(...apis);
  }

  protected onWatchApiEvent(evt: IObjectWatchEvent) {
    if (!this.isLoaded) return;
    const { store } = evt;
    if (evt.store.api.apiResource !== this.api.apiResource) {
      throw new Error('type not supported push');
    }
    store.eventsBuffer.push(evt);
  }

  @computed get items() {
    return this._items.slice();
  }

  @action
  protected updateFromEventsBuffer() {
    if (!this.eventsBuffer.length) {
      return;
    }
    // create latest non-observable copy of items to apply updates in one action (==single render)
    let items = this._items.slice();
    this.eventsBuffer.clear().forEach(({ type, object }) => {
      const { uid, kind } = object;
      const index = items.findIndex(item => item.getId() === uid && item.kind === kind);
      const item = items[index];
      switch (type) {
        case 'ADDED':
        case 'MODIFIED':
          const newItem = new this.api.objectConstructor(object);
          if (!item) {
            items.push(newItem);
          } else {
            items.splice(index, 1, newItem);
          }
          break;
        case 'DELETED':
          if (item) {
            items.splice(index, 1);
          }
          break;
      }
    });

    // slice to max allowed items
    if (this.limit && this.limit != -1 && items.length > this.limit) {
      items = items.slice(-this.limit);
    }
    // update items
    this._items.replace(this.sortItems(items));
  }
}
