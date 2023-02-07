import { writable } from 'svelte/store';

export const lateStore = writable<string[]>([]);

export const moneyStore = writable<number>(0);
