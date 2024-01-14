import { _ } from 'svelte-i18n';
import type { Tag, Cabinet, Favorite, DocumentType } from './types';
import { mayan } from './mayan';

export class Store {
    private tags: Tag[] = [];
    private cabinets: Cabinet[] = [];
    private documentTypes: DocumentType[] = [];
    private favourites: Favorite[] = [];

    public async getTags() {
        if (this.tags.length == 0) {
            this.tags = await mayan.listTags();
        }
        return this.tags
    }
    public async getCabinets() {
        if (this.cabinets.length == 0) {
            this.cabinets = await mayan.listCabinets();
        }
        return this.cabinets
    }
    public async getDocumentTypes() {
        if (this.documentTypes.length == 0) {
            this.documentTypes = await mayan.listDocumentTypes();
        }
        return this.documentTypes
    }
    public async getFavourites(reload: boolean = false) {
        if (reload || (this.favourites.length === 0)) {
            this.favourites = await mayan.listFavouriteDocuments()
        }
        return this.favourites
    }
}

export const store = new Store();
