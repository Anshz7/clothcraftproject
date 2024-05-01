import { Injectable } from "@angular/core";

export interface Store {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const STOREITEMS = [
    { state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: '' }
];

@Injectable()
export class StoreItems {
    getStoreItem(): Store[] {
        return STOREITEMS;
    }
}