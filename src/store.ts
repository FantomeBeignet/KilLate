import { writable } from 'svelte/store';

export const lateStore = writable<string[]>([]);
