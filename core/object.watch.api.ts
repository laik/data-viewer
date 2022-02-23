import { computed, observable, reaction } from 'mobx';
import { stringify } from 'querystring';
import { apiManager } from './api.manager';
import { EventSourcePolyfill as EventSource } from './eventsource/eventsource';
import { JsonApiData, ObjectStore } from './index';
import { ObjectApi } from './object.api';
import { redux_update_userconfig, redux_userconfig } from './redux-store';
import { UserConfig } from './user-config';
import { bind, EventEmitter, interval } from './utils';

export interface IWatchRouteQuery {
  api: string | string[];
}
export interface IObjectWatchEvent<T = any> {
  type: 'ADDED' | 'MODIFIED' | 'DELETED';
  object?: T;
  store?: ObjectStore;
}
export interface IObjectWatchRouteEvent {
  type: string;
  url: string;
  userConfig: UserConfig;
  status: number;
}

export type EventCallback = (evt: IObjectWatchEvent) => void;

@bind()
export class ObjectWatchApi {
  protected evtSource: EventSource;
  protected onData = new EventEmitter<[IObjectWatchEvent]>();
  protected subscribers = observable.map<ObjectApi, number>();
  protected reconnectInterval = interval(60 * 5, this.reconnect); // background reconnect every 5min
  protected reconnectTimeoutMs = 5000;
  protected maxReconnectsOnError = 10;
  protected reconnectAttempts = this.maxReconnectsOnError;
  protected apiUrl = '/watch';
  protected cloudPlatform = true;

  constructor() {
    reaction(
      () => this.activeApis,
      () => this.connect(),
      {
        fireImmediately: true,
        delay: 1000,
      }
    );
  }

  @computed get apiURL(): string {
    return this.apiUrl;
  }

  @computed get activeApis() {
    return Array.from(this.subscribers.keys());
  }

  watch() { return () => { } }

  getSubscribersCount(api: ObjectApi) {
    return this.subscribers.get(api) || 0;
  }

  subscribe(...apis: ObjectApi[]) {
    apis.forEach(api => {
      this.subscribers.set(api, this.getSubscribersCount(api) + 1);
    });
    return () =>
      apis.forEach(api => {
        const count = this.getSubscribersCount(api) - 1;
        if (count <= 0) this.subscribers.delete(api);
        else this.subscribers.set(api, count);
      });
  }

  protected getQuery(): Partial<IWatchRouteQuery> {
    return {
      api: this.activeApis.map(api => {
        return api.getWatchUrl();
      }).flat()
    }
  }

  protected connect() {
    if (this.evtSource) this.disconnect(); // close previous connection
    if (!this.activeApis.length) {
      return;
    }
    const query = this.getQuery();
    const apiUrl = `${this.apiURL}?${stringify(query)}`;
    const userConfig = redux_userconfig();
    const token = userConfig?.token || '';
    this.evtSource = new EventSource(apiUrl, {
      headers: {
        Authorization: token,
      },
    });
    this.evtSource.onmessage = this.onMessage;
    this.evtSource.onerror = this.onError;
    if (!query.api) {
      this.disconnect();
      this.reset();
      this.writeLog('NOT API REGISTERED');
      return;
    }
    this.writeLog('CONNECTING', query.api);
  }

  reconnect() {
    if (!this.evtSource || this.evtSource.readyState !== EventSource.OPEN) {
      this.reconnectAttempts = this.maxReconnectsOnError;
      this.connect();
    }
  }

  protected disconnect() {
    if (!this.evtSource) return;
    this.evtSource.close();
    this.evtSource.onmessage = null;
    this.evtSource = null;
  }

  protected onMessage(evt: MessageEvent) {
    if (!evt.data) return;
    let data = JSON.parse(evt.data);
    if (!this.onData) {
      return;
    }
    if ((data as IObjectWatchEvent).object) {
      console.log("onMessage:", evt.type, evt.data.object);
      this.onData.emit(data);
    } else {
      if (typeof this.onRouteEvent === 'function') {
        this.onRouteEvent(data);
      }
    }
  }

  protected async onRouteEvent({ type, url, userConfig }: IObjectWatchRouteEvent) {
    if (type === 'STREAM_END') {
      this.disconnect();
      const { apiBase, ns } = ObjectApi.parseApi(url);
      if (apiBase === '' || ns === '') {
        return;
      }
      const api = apiManager.getApi(apiBase);
      if (api) {
        await api.refreshResourceVersion({ ns });
        this.reconnect();
      }
    } else if (type.toLowerCase() === 'ping') {
      // console.log('onMessage: PING');
    } else if (type === 'STREAM_ERROR') {
      this.disconnect();
      // console.log('onMessage: STREAM_ERROR');
    } else if (type === "USER_CONFIG") {
      // 用户信息经过 watch 推流
      // console.log('onMessage: update config');
      redux_update_userconfig(userConfig)
    }
  }

  protected onError(evt: MessageEvent) {
    const { reconnectAttempts: attemptsRemain, reconnectTimeoutMs } = this;
    if (evt.eventPhase === EventSource.CLOSED) {
      if (attemptsRemain > 0) {
        this.reconnectAttempts--;
        setTimeout(() => this.connect(), reconnectTimeoutMs);
      }
    }
  }

  protected writeLog(...data: any[]) {
    console.log('%cOBJECT-WATCH-API:', `font-weight: bold`, ...data);
  }

  addListener<T extends ObjectStore>(store: T, ecb: EventCallback) {
    const listener = (evt: IObjectWatchEvent<JsonApiData>) => {
      const { ns, version } = evt.object;
      store.api.setVersion(ns || '', version);
      const evtKind = evt.object?.kind || '';
      if (evtKind === store.api.apiResource) {
        evt.store = store;
        ecb(evt);
      }
    };
    this.onData.addListener(listener);
    return () => {
      this.onData.removeListener(listener);
    };
  }

  reset() {
    this.subscribers.clear();
  }
}

export const objectWatchApi = new ObjectWatchApi();
