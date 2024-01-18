/**
 * Cache some expensive operations
 */
import { _ } from 'svelte-i18n';
import { mayan } from './mayan';
import type { Tag, Cabinet, Favorite, DocumentType } from './types';
import { writable } from 'svelte/store';

export const cabinets = writable<Cabinet[]>([]);
export const documentTypes = writable<DocumentType[]>([]);
export const tags = writable<Tag[]>([]);
export const favourites = writable<Favorite[]>([]);

export const init = async () => {
    cabinets.set(await mayan.listCabinets())
    tags.set(await mayan.listTags());
    documentTypes.set(await mayan.listDocumentTypes());
    favourites.set(await mayan.listFavouriteDocuments())
}


