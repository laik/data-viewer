import { observable } from 'mobx';
import { IObject } from './object';
import { IObjectApiLinkRef, ObjectApi } from './object.api';
import { ObjectStore } from './object.store';
import { bind } from './utils';

export function createSelfLink(api: ObjectApi, id: string, ns?: string): string {
  const ref: IObjectApiLinkRef = {
    apiPrefix: api.apiPrefix,
    apiVersion: api.apiVersionWithGroup,
    resource: api.apiResource,
    id: id,
    ns: ns,
  };
  return ObjectApi.createLink(ref);
}

export interface ObjectDetailsProps<T extends Object = any> {
  object: T;
}

export interface ApiComponents {
  Menu?: React.ComponentType;
  Details?: React.ComponentType<ObjectDetailsProps>;
}

@bind()
export class ApiManager<T extends IObject = any> {
  private apis = observable.map<string, ObjectApi>();
  private stores = observable.map<ObjectApi, ObjectStore<T>>();
  private apiStores = observable.map<string, ObjectStore<T>>();
  private views = observable.map<ObjectApi, ApiComponents>();

  getApi(pathOrCallback: string | ((api: ObjectApi) => boolean)) {
    const apis = this.apis;
    if (typeof pathOrCallback === 'string') {
      let api = apis.get(pathOrCallback);
      if (!api) {
        const { apiBase } = ObjectApi.parseApi(pathOrCallback);
        api = apis.get(apiBase);
      }
      return api;
    } else {
      return Array.from(apis.values()).find(pathOrCallback);
    }
  }

  registerApi(apiBase: string, api: ObjectApi) {
    if (this.apis.has(apiBase)) return;
    this.apis.set(apiBase, api);
  }

  protected resolveApi(api: string | ObjectApi): ObjectApi {
    if (typeof api === 'string') return this.getApi(api);
    return api;
  }

  protected unregisterApi(api: string | ObjectApi) {
    if (typeof api === 'string') this.apis.delete(api);
    else {
      const apis = Array.from(this.apis.entries());
      const entry = apis.find(entry => entry[1] === api);
      if (entry) this.unregisterApi(entry[0]);
    }
  }

  registerStore(api: ObjectApi, store: ObjectStore<T>) {
    this.registerApi(api.apiBase, api);
    this.stores.set(api, store);
    this.apiStores.set(api.apiResource, store);
  }

  getStore(api: ObjectApi | string, onlyStores?: boolean): ObjectStore<T> {
    if (onlyStores && typeof api === 'string') {
      return this.stores.get(this.resolveApi(api));
    }
    if (typeof api === 'string') {
      return this.apiStores.get(api);
    }
    return this.stores.get(api);
  }

  getStores(apis: string[]): ObjectStore<T>[] {
    return apis.map(api => this.getStore(api));
  }

  registerViews(api: ObjectApi | ObjectApi[], views: ApiComponents) {
    if (Array.isArray(api)) {
      api.forEach(api => this.registerViews(api, views));
      return;
    }
    const currentViews = this.views.get(api) || {};
    this.views.set(api, {
      ...currentViews,
      ...views,
    });
  }

  getViews(api: string | ObjectApi): ApiComponents {
    return this.views.get(this.resolveApi(api)) || {};
  }
}

export const apiManager = new ApiManager();
