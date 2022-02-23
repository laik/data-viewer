import orderBy from 'lodash/orderBy';
import { action, computed, observable } from 'mobx';
import { JsonApiData } from "./json.api";
import { bind, noop } from './utils';

export interface ItemObject extends JsonApiData {
    getId()
}

@bind()
export abstract class ItemStore<T extends ItemObject = any> {
    abstract loadAll(): Promise<void>;

    @observable isLoading = false;
    @observable isLoaded = false;

    @observable protected items = observable.array<T>([], { deep: false });
    @observable selectedItemsIds = observable.map<string, boolean>();

    @computed get selectedItems(): T[] {
        return this.items.filter(item => this.selectedItemsIds.get(item.getId()));
    }

    protected defaultSorting = (item: T) => {
        if (item?.version !== undefined) {
            return item?.version;
        }
    };

    @action
    protected sortItems(items: T[] = this.items, sorting?: ((item: T) => any)[], order?: 'asc' | 'desc'): T[] {
        return orderBy(items, sorting || this.defaultSorting, (order = 'desc'));
    }

    protected async createItem(...args: any[]): Promise<any>;
    @action
    protected async createItem(request: () => Promise<T>) {
        const newItem = await request();
        const item = this.items.find(item => item.getId() === newItem.getId());
        if (item) {
            return item;
        } else {
            const items = this.sortItems([...this.items, newItem]);
            this.items.replace(items);
            return newItem;
        }
    }

    protected async loadItem(...args: any[]): Promise<T>;
    @action
    protected async loadItem(request: () => Promise<T>, sortItems = true) {
        const item = await request().catch(() => null);
        if (item) {
            const existingItem = this.items.find(el => el.getId() === item.getId());
            if (existingItem) {
                const index = this.items.findIndex(item => item === existingItem);
                this.items.splice(index, 1, item);
            } else {
                let items = [...this.items, item];
                if (sortItems) items = this.sortItems(items);
                this.items.replace(items);
            }
            return item;
        }
    }

    @action
    protected async updateItem(item: T, request: () => Promise<T>) {
        const updatedItem = await request();
        const index = this.items.findIndex(i => i.getId() === item.getId());
        this.items.splice(index, 1, updatedItem);
        return updatedItem;
    }

    @action
    protected removeItem = (removeItem: T) => {
        this.items.replace(this.items.filter(item => item.getId() !== removeItem.getId()));
    };

    isSelected(item: T) {
        return !!this.selectedItemsIds.get(item.getId());
    }

    @action
    select(item: T) {
        this.selectedItemsIds.set(item.getId(), true);
    }

    @action
    unselect(item: T) {
        this.selectedItemsIds.delete(item.getId());
    }

    @action
    toggleSelection(item: T) {
        if (this.isSelected(item)) {
            this.unselect(item);
        } else {
            this.select(item);
        }
    }

    @action
    toggleSelectionAll(visibleItems: T[] = this.items) {
        const allSelected = visibleItems.every(this.isSelected);
        if (allSelected) {
            visibleItems.forEach(this.unselect);
        } else {
            visibleItems.forEach(this.select);
        }
    }

    isSelectedAll(visibleItems: T[] = this.items) {
        if (!visibleItems.length) return false;
        return visibleItems.every(this.isSelected);
    }

    @action
    resetSelection() {
        this.selectedItemsIds.clear();
    }

    @action
    reset() {
        this.resetSelection();
        this.items.clear();
        this.selectedItemsIds.clear();
    }

    subscribe(...args: any[]) {
        return noop;
    }

    *[Symbol.iterator]() {
        yield* this.items;
    }
}
