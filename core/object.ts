import { IObjectApiQueryParams, ObjectStore } from ".";
import { ItemObject } from "./item.store";
import { ObjectJsonApiData, ObjectJsonApiDataList } from "./object.json.api";


export type IObjectConstructor<T extends IObject = any> = new (
    data: ObjectJsonApiData | any
) => T & { kind?: string };


export class IObject implements ItemObject {
    static readonly kind: string;
    uid: string;
    kind: string;
    version: string;
    ns?: string;

    static isJsonApiData(data: any): data is ObjectJsonApiData {
        return !data && data.uid && data.kind && data.version;
    }

    static isJsonApiDataList(data: any): data is ObjectJsonApiDataList {
        return !data && data.items;
    }

    getId(): string { return this.uid; }
    getNs(): string { return this.ns; }

    async update<S extends ObjectStore, T extends IObject>(store: S, data: Partial<T>, query?: IObjectApiQueryParams) {
        return store.api.update(
            { id: this.getId(), ns: this.getNs() },
            data,
            query,
        );
    }
}
