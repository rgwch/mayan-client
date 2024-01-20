/**
 * Svelte store for global state
 */
import { _ } from 'svelte-i18n';
import { mayan } from './mayan';
import type { Tag, Cabinet, Favorite, DocumentType } from './types';
import { writable } from 'svelte/store';

export const cabinets = writable<Cabinet[]>([]);
export const documentTypes = writable<DocumentType[]>([]);
export const tags = writable<Tag[]>([]);
export const favourites = writable<Favorite[]>([]);

/**
 * Initialize the store with data from the server. Data is ready when the promise resolves.
 */
export const init = async () => {
    cabinets.set(await mayan.listCabinets({ pagesize: 1000 }))
    tags.set(await mayan.listTags({ pagesize: 1000 }));
    documentTypes.set(await mayan.listDocumentTypes());
    favourites.set(await mayan.listFavouriteDocuments())
}


