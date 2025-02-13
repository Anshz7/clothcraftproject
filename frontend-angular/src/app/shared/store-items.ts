import { Injectable } from "@angular/core";

export interface Store {
    state: string;
    name: string;
    icon: string;
    role: string;
}

const STOREITEMS = [
    { state: 'dashboard', name: 'Dashboard', icon: 'dashboard', role: '' },
    { state: 'category', name: 'Manage Category', icon: 'category', role: 'admin' },
    { state: 'product', name: 'Manage Products', icon: 'inventory', role: 'admin' },
    { state: 'order', name: 'Manage Sale', icon: 'list_alt', role: '' },
    { state: 'bill', name: 'View Bills', icon: 'money', role: '' },
    { state: 'user', name: 'Manage Users', icon: 'people', role: 'admin' },
    { state: 'customer', name: 'View Customers', icon: 'people', role: 'admin' },
];

@Injectable()
export class StoreItems {
    getStoreItem(): Store[] {
        return STOREITEMS;
    }
}