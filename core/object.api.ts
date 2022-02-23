import merge from 'lodash/merge';
import { stringify } from 'querystring';
import { apiManager } from './api.manager';
import { IObject, IObjectConstructor } from './object';
import { ObjectJsonApi, ObjectJsonApiData, ObjectJsonApiDataList } from './object.json.api';
import { objectWatchApi } from './object.watch.api';

export interface IObjectApiOptions<T extends IObject> {
  kind: string;
  apiBase: string;
  isNs: boolean;
  objectConstructor?: IObjectConstructor<T>;
  request?: any;
  resource?: string;
}

export interface IObjectApiQueryParams {
  watch?: boolean | number;
  resourceVersion?: string;
  timeoutSeconds?: number;
  limit?: number; // doesn't work with ?watch
  continue?: string; // might be used with ?limit from second request
  ns?: string;
  path?: string; // label update datastructure field
}

export interface IObjectApiQueryParamsExtension extends IObjectApiQueryParams {
  [key: string]: any;
}

export interface IObjectApiLinkRef {
  apiPrefix?: string;
  apiVersion: string;
  resource: string;
  ns?: string;
  id: string;
}

type CallbackVoid = () => void;

export class ObjectApi<T extends IObject = any> {
  static matcher =
    /(\/apis?.*?)\/(?:(.*?)\/)?(v.*?)(?:\/namespaces\/(.+?))?\/([^\/]+)(?:\/([^\/?]+))?.*$/;
  api: any;

  static parseUrl(apiPath = '') {
    if (apiPath === '') {
      throw new Error('Invalid API path');
    }
    apiPath = new URL(apiPath, location.origin).pathname;
    return ObjectApi.parseApi(apiPath);
  }

  static parseApi(apiPath = '') {
    const [, apiPrefix, apiGroup = '', apiVersion, ns, resource, name] = apiPath.match(ObjectApi.matcher) || [];
    const apiVersionWithGroup = [apiGroup, apiVersion].filter(v => v).join('/');
    const apiBase = [apiPrefix, apiGroup, apiVersion, resource].filter(v => v).join('/');
    return {
      apiBase,
      apiPrefix,
      apiGroup,
      apiVersion,
      apiVersionWithGroup,
      ns,
      resource,
      name,
    };
  }

  constructor(protected options: IObjectApiOptions<T>) {
    const {
      kind,
      isNs = false,
      objectConstructor = IObject as IObjectConstructor,
      request = ObjectApi,
    } = options || {};

    const {
      apiBase,
      apiPrefix,
      apiGroup,
      apiVersion,
      apiVersionWithGroup,
      ns,
      resource,
      name,
    } = ObjectApi.parseApi(options.apiBase);

    this.kind = kind;
    this.isNs = isNs;
    this.apiBase = apiBase;
    this.apiPrefix = apiPrefix;
    this.apiGroup = apiGroup;
    this.apiVersion = apiVersion;
    this.apiVersionWithGroup = apiVersionWithGroup;
    this.apiResource = resource;
    this.namespace = ns;
    this.request = request;
    this.objectConstructor = objectConstructor;

    this.parseResponse = this.parseResponse.bind(this);
    this.parseResponseNotUpdateStore = this.parseResponseNotUpdateStore.bind(this);
    apiManager.registerApi(apiBase, this);
  }

  readonly request: ObjectJsonApi;
  readonly kind: string;
  readonly apiBase: string;
  readonly apiPrefix: string;
  readonly apiGroup: string;
  readonly apiVersion: string;
  readonly apiVersionWithGroup: string;
  readonly apiResource: string;
  readonly isNs: boolean;
  readonly namespace: string;

  protected versions = new Map<string, string>();
  public objectConstructor: IObjectConstructor<T>;

  watch(): CallbackVoid[] {
    return [
      objectWatchApi.subscribe(this),
      objectWatchApi.watch(),
    ];
  }

  getWatchUrl(ns = '', query: IObjectApiQueryParams = {}): string {
    return this.getUrl(
      { ns },
      {
        watch: 1,
        resourceVersion: this.getVersion(ns) || '0',
        ...query,
      }
    );
  }

  setVersion(ns = '', newVersion: string) {
    this.versions.set(ns, newVersion);
  }

  getVersion(ns = '') {
    return this.versions.get(ns);
  }

  async refreshResourceVersion(params?: { ns: string }) {
    return this.list(params, { limit: 1 });
  }

  static watchAll(...apis: ObjectApi[]) {
    const disposers = apis.map(api => api.watch());
    return () =>
      disposers.forEach(unwatchs => unwatchs.forEach(unwatch => unwatch()));
  }

  static createLink(ref: IObjectApiLinkRef): string {
    const { apiPrefix = '/apis', resource, apiVersion, id } = ref;
    let { ns } = ref;
    if (ns) {
      ns = `namespaces/${ns}`;
    }
    return [apiPrefix, apiVersion, ns, resource, id].filter(v => !!v).join('/');
  }

  getUrl({ id = '', ns = '' } = {}, query?: Partial<IObjectApiQueryParams>, op?: string) {
    const { apiPrefix, apiVersionWithGroup, apiResource } = this;
    const resourcePath = ObjectApi.createLink({
      apiPrefix: apiPrefix,
      apiVersion: apiVersionWithGroup,
      resource: apiResource,
      ns: this.isNs ? ns : undefined,
      id: id,
    });
    if (this.isNs) {
      query = merge({}, query);
    }
    op = op ? '/op/' + op : ''
    return resourcePath + op + (query ? `?` + stringify(query) : '');
  }

  parseResponse(
    data: ObjectJsonApiData | ObjectJsonApiData[] | ObjectJsonApiDataList
  ): any {
    const ObjectConstructor = this.objectConstructor;

    if (IObject.isJsonApiData(data)) {
      return new ObjectConstructor(data);
    } else if (IObject.isJsonApiDataList(data)) {// process items list response
      const { ns, version, items } = data;
      this.setVersion(ns || '', version);
      return items.map(item => new ObjectConstructor({ ...item }));
    }
    else if (Array.isArray(data)) {
      // custom apis might return array for list response, e.g. users, groups, etc.
      return data.map(data => new ObjectConstructor(data));
    } else if (JSON.stringify(data).includes('Items')) {
      return [];
    }
    return data;
  }

  parseResponseNotUpdateStore(
    data: ObjectJsonApiData | ObjectJsonApiData[] | ObjectJsonApiDataList
  ): any {
    const ObjectConstructor = this.objectConstructor;

    if (IObject.isJsonApiData(data)) {
      return new ObjectConstructor(data);
    } else if (IObject.isJsonApiDataList(data)) {// process items list response
      const { items } = data;
      return items.map(item => new ObjectConstructor({ ...item }));
    }
    else if (Array.isArray(data)) {// custom apis might return array for list response, e.g. users, groups, etc.
      return data.map(data => new ObjectConstructor(data));
    } else if (JSON.stringify(data).includes('Items')) {
      return [];
    }
    return data;
  }

  query = async (
    params: {} = { namespace: '', name: '' },
    query?: IObjectApiQueryParamsExtension,
    op?: string,
  ) => {
    return await this.request
      .get(this.getUrl(params, query, op))
      .then(this.parseResponseNotUpdateStore) as T[];
  }

  queryOne = async (
    params: {} = { namespace: '', name: '' },
    query?: IObjectApiQueryParamsExtension,
    op?: string,
  ) => {
    const r = await this.query(params, query, op);
    return r.length && r[0] ? r[0] : undefined;
  }

  async list(
    { ns = '' } = {},
    query?: IObjectApiQueryParams,
    op?: string,
  ): Promise<T[]> {
    return this.request
      .get(this.getUrl({ ns }), { query })
      .then(this.parseResponse);
  }

  async get(
    { id = '', ns = '' } = {},
    query?: IObjectApiQueryParams,
    op?: string,
  ): Promise<T> {
    return this.request
      .get(this.getUrl({ ns, id }), { query })
      .then(this.parseResponse);
  }

  async create(
    { ns = '', labels = {} } = {},
    data?: Partial<T>,
    query?: IObjectApiQueryParams,
    op?: string,
  ): Promise<T> {
    const apiUrl = this.getUrl({ ns }, query, op);
    return this.request
      .post(apiUrl, {
        data: merge(
          data,
          {
            ns: ns,
            labels: labels,
          },
        ),
      })
      .then(this.parseResponse);
  }

  async update(
    { id = '', ns = '' } = {},
    data?: Partial<T>,
    query?: IObjectApiQueryParams,
    op?: string,
  ): Promise<T> {
    const apiUrl = this.getUrl({ ns, id }, query, op);
    return this.request.put(apiUrl, { data }).then(this.parseResponse);
  }

  async delete({ id = '', ns = '' } = {}, query?: IObjectApiQueryParams): Promise<T> {
    const apiUrl = this.getUrl({ ns, id }, query);
    return this.request.del(apiUrl, {}).then(this.parseResponse);
  }

  async upload<D = string | ArrayBuffer>(data: D) {
    const apiUrl = this.getUrl({}, {}, 'upload');
    return this.request.post(apiUrl, { data }).then(this.parseResponse);
  }
}
