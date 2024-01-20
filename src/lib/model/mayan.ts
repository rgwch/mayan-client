/**
 * This file contains the Mayan class which is used to communicate with the Mayan EDMS API. 
 * All API calls happen here. All are asynchronous and return a Promise.
 */
import type { Cabinet, Document, Tag, DocumentType, Favorite } from "./types";

import axios from 'axios'
const API = "/api/v4/"
const defaultPageSize = 25
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

export type querySegment = {
  page?: number,
  pagesize?: number
}

export class Mayan {
  private url: string = "";
  private token: string = "";

  /**
   * Connect to a running Mayan EDMS instance. Username and password are the credentials of a user with access to the API.
   * @param url The base URL of the server (e.g. https://mayan.example.com)
   * @param username
   * @param password
   * @returns true on success
   */
  public async connect(
    url: string,
    username: string,
    password: string,
    resumable: boolean
  ): Promise<boolean> {
    if (!url) throw new Error("URL is required")
    if (!username) throw new Error("Username is required")
    if (!password) throw new Error("Password is required")
    if (url.endsWith(API)) url = url.slice(0, -API.length)
    if (!url.startsWith("http")) url = "https://" + url
    if (url.endsWith("/")) url = url.slice(0, -1);
    this.url = url + API;
    const body = {
      username: username,
      password: password,
    };
    this.token = "";
    const json = await this.post("auth/token/obtain/", body);
    if (json) {
      this.token = json.token;
      axios.defaults.headers.common['Authorization'] = `Token ${this.token}`
      /* If the user wants to stay logged in: Store token and url */
      if (resumable) {
        localStorage.setItem("token", this.token);
        localStorage.setItem("url", this.url);
      }
      return true;
    } else {
      return false;
    }
  }
  /**
   * Logout from the current session. The token is removed from the local storage and from axios.
   */

  public logout() {
    localStorage.removeItem("token");
    axios.defaults.headers.common['Authorization'] = undefined
    localStorage.setItem("url", this.url.substring(0, this.url.length - API.length));
    window.location.reload();
  }

  /**
   * Check if a previous session can be resumed with a previously stored token (and resume it, of so).
   * @returns true if a previous session was resumed
   */
  public async canResume(): Promise<boolean> {
    this.token = localStorage.getItem("token") ?? "";
    this.url = localStorage.getItem("url") ?? "";
    if (this.token.length > 0 && this.url.length > 0) {
      try {
        axios.defaults.headers.common['Authorization'] = `Token ${this.token}`
        const test = await this.request("cabinets/", { page: 1, pagesize: 1 });
        if (test) {
          return true;
        }
      } catch (err) {
        axios.defaults.headers.common['Authorization'] = undefined
        return false;
      }
    }
    return false;
  }

  /**
   * Convert internally stored links (such as http://dockervm:8000/api/v4/documents/1/) 
   * to the current URL (e.g. https://my.mayan.server/api/v4/documents/1/
   * @param url the url to convert
   * @returns the real URL for the requested resource or null
   */
  public normalizeURL(url: string): string {
    if (!url || url.startsWith(this.url)) return url;
    const internal = url.substring(
      url.indexOf(API) + API.length
    );
    return this.url + internal;
  }
  /**
   * return only the internal part of a URL (e.g. documents/1/)
   * @param url the full url
   * @returns 
   */
  public stripURL(url: string): string {
    if (!url) return url;
    const internal = url.substring(
      url.indexOf(API) + API.length
    );
    return internal;
  }

  /**
   * Generic POST or PUT request to Mayan (internally used by other methods)
   * @param suburl REST Endpoint to call
   * @param body Request body
   * @returns the server's answer
   */
  public async post(suburl: string, body: any, method = "POST"): Promise<any> {

    try {
      const result = await axios({
        method,
        url: this.url + suburl,
        data: body
      })
      return result.data
    } catch (e) {
      console.log(e);
      return undefined;
    }
  }
  /**
   * generic GET request to Mayan (internally used by other methods)
   * The method will call the endpoint repeatedly until all results are fetched or the limit is reached
   * @param suburl REST Endpoint to call
   * @param limit maximum result site (0: no limit, fetch all)
   * @returns
   */
  public async request(suburl: string, segment: querySegment = { page: 1, pagesize: defaultPageSize }): Promise<Array<any>> {
    const pagenum = segment.page ?? 1
    const pagesize = segment.pagesize ?? defaultPageSize
    let page = this.url + suburl + `?page=${pagenum}&page_size=${pagesize}`;
    try {
      const result = await axios({
        method: "GET",
        url: page
      })
      const json = result.data;
      if (json.results && Array.isArray(json.results)) {
        return (json.results);
      } else {
        return [json]
      }
    } catch (e) {
      console.log(e);
      return [];
    }
  }

  /**
   * Generic retrieve a single object from Mayan
   * @param url the URL to retrieve
   * @returns
   */
  public async loadBlob(url: string): Promise<any> {
    const headers = new Headers();
    headers.append("Authorization", "Token " + this.token);
    const options = {
      method: "GET",
      headers,
    };
    const result = await fetch(this.normalizeURL(url), options);
    const blob = await result.blob()
    return blob
  }
  /**
   * Generic retrieve an image from Mayan
   * @param url the URL to retrieve
   * @returns an ObjectURL for the image
   */
  public async loadImage(url: string): Promise<any> {
    const headers = new Headers();
    headers.append("Authorization", "Token " + this.token);
    const options = {
      method: "GET",
      headers,
    };
    const result = await fetch(this.normalizeURL(url), options);
    const blob = await result.blob()
    return URL.createObjectURL(blob);
  }

  /**
   * Fetch the preview images for a document
   * @param document 
   * @returns a list of URLs with image data
   */
  public async getImageURLs(document: Document): Promise<Array<string>> {
    const urlList = document?.version_active?.page_list_url;
    if (urlList) {
      const list = await this.request(this.stripURL(urlList));
      const result = list.map((page: any) => this.normalizeURL(page.image_url));
      return result
    }
    return []
  }
  /**
   * List all cabinets
   * @returns
   */
  public async listCabinets(segm?: querySegment): Promise<Array<Cabinet>> {
    return this.request("cabinets/", segm);
  }

  /**
   * Create a new cabinet
   * @param name label for the cabinet
   * @param parent null to create toplevel cabinet, or the id of the parent cabinet
   * @returns tne newly created cabinet
   */
  public async createCabinet(name: string, parent: number | null = null): Promise<Cabinet> {
    if (parent) {
      const parents: Array<Cabinet> = await this.listCabinets({ pagesize: 1000 })
      const parentObj = parents.find(cab => cab.id == parent)
      parent = parentObj?.id ?? null
    }
    const body = {
      label: name,
      parent
    };
    const created = await this.post("cabinets/", body);
    return created
  }
  /**
   * Remove a cabinet
   * @param cabinet_id 
   * @returns true on success
   */
  public async deleteCabinet(cabinet_id: number): Promise<boolean> {
    try {
      await axios({
        method: "DELETE",
        url: this.url + "cabinets/" + cabinet_id + "/"
      })
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }
  /**
   * List all cabinets a document is in
   * @param document 
   * @returns 
   */
  public async listCabinetsOfDocument(document: Document): Promise<Array<Cabinet>> {
    return this.request("documents/" + document.id + "/cabinets/");
  }

  /**
   * Add a document to a cabinet
   * (Current user need permission to add documents to cabinets)
   * @param document_id 
   * @param cabinet_id 
   * @returns 
   */
  public async addDocumentToCabinet(document_id: number, cabinet_id: string): Promise<any> {
    return this.post("cabinets/" + cabinet_id + "/documents/add/", { document: document_id }, "POST");
  }

  /**
   * remove a document from a cabinet
   * (Current user need permission to remove documents from cabinets)
   * @param document_id 
   * @param cabinet 
   * @returns 
   */
  public async removeDocumentFromCabinet(document_id: number, cabinet: Cabinet): Promise<any> {
    return this.post("cabinets/" + cabinet.id + "/documents/remove/", { document: document_id }, "POST");
  }
  /**
   * List all documents. This is probably a very expensive operation.
   * @returns
   */
  public async listDocuments(segm?: querySegment): Promise<Array<Document>> {
    return this.request("documents/", segm);
  }
  /**
   * List all documents in a cabinet
   * @param cabinet
   * @returns
   */
  public async listDocumentsFromCabinet(
    cabinet: Cabinet,
    segm?: querySegment
  ): Promise<Array<Document>> {
    return this.request("cabinets/" + cabinet.id + "/documents", segm);
  }
  /**
   * Retrieve recently added documents
   * @returns
   */
  public async listRecentlyAddedDocuments(segm?: querySegment): Promise<Array<Document>> {
    return this.request("documents/created/", segm);
  }
  /**
   * retrieve recently accessed documents
   * @param limit 
   * @returns 
   */
  public async listRecentlyAccessedDocuments(segm?: querySegment): Promise<Array<Document>> {
    const result = await this.request("documents/accessed/", segm);
    return result.map(obj => obj.document)
  }
  /**
   * List all favourite documents of the current user
   * @returns
   */
  public async listFavouriteDocuments(segm?: querySegment): Promise<Array<Favorite>> {
    return await this.request("documents/favorites/", segm);
  }

  /**
   * Add document to the current user's favorite list
   * @param document 
   * @returns 
   */
  public async addToFavourites(document: Document): Promise<any> {
    return this.post("documents/favorites/", { document_id: document.id }, "POST");
  }

  /**
   * remove document from the current user's favorite list
   * @param document_id 
   * @returns true on success
   */
  public async removeFromFavourites(document_id: number): Promise<boolean> {
    try {
      const favs = await this.listFavouriteDocuments()
      const fav = favs.find(fav => fav.document.id == document_id)
      if (fav) {
        const result = await axios({
          method: "DELETE",
          url: this.url + "documents/favorites/" + fav.id + "/"
        })
        return true
      }
    } catch (err) {
      console.log(err)
    }
    return false
  }
  /**
   * List all available document types
   * (Current user need permission to view document types)
   * @returns
   */
  public async listDocumentTypes(segm?: querySegment): Promise<Array<DocumentType>> {
    return this.request("document_types/", segm);
  }

  /**
   * List all tags in the system. 
   * (Current user need permission to view tags)
   * @returns 
   */
  public async listTags(segm?: querySegment): Promise<Array<Tag>> {
    return this.request("tags/", segm);
  }

  /**
   * List all tags linked to a document
   * @param document 
   * @returns 
   */
  public async listTagsForDocument(document: Document): Promise<Array<Tag>> {
    return this.request("documents/" + document.id + "/tags/");
  }

  /**
   * Add an existing tag to a document
   * @param document 
   * @param tag 
   * @returns 
   */
  public async addTagToDocument(document: Document, tag: Tag): Promise<any> {
    return this.post("documents/" + document.id + "/tags/attach/", { tag: tag.id }, "POST");
  }
  /**
   * remove a tag from a document (without removing the tag itself from the system )
   * @param document 
   * @param tag 
   * @returns 
   */
  public async removeTagFromDocument(document: Document, tag: Tag): Promise<any> {
    return this.post("documents/" + document.id + "/tags/remove/", { tag: tag.id }, "POST");
  }

  /**
   * List all documents with a given tag
   * @param tag 
   * @returns 
   */
  public async listDocumentsWithTag(tag: Tag): Promise<Array<Document>> {
    return this.request("tags/" + tag.id + "/documents/");
  }
  /**
   * List all documents with a given tag id
   * @param id 
   * @returns 
   */
  public async listDocumentsWithTagId(id: number): Promise<Array<Document>> {
    return this.request("tags/" + id + "/documents/");
  }
  /**
   * Modify a document
   * @param document 
   * @param changes 
   * @returns 
   */
  public async updateDocument(document: Document, changes: any): Promise<Document> {
    return this.post("documents/" + document.id + "/", changes, "PUT");
  }

  /**
   * Set a desription for a document
   * @param document 
   * @param description 
   * @returns 
   */
  public async setDescription(document: Document, description: string) {
    const body = {
      description: description,
    };
    return this.post("documents/" + document.id + "/", body, "PUT");
  }

  /**
   * Create a new document
   * @param type 
   * @param description 
   * @param language 
   * @returns 
   */
  public async createDocument(type: DocumentType, cabinet_id: number, language: string = "deu", file: File): Promise<Document> {
    const body = {
      document_type_id: type.id,
      label: file.name,
      file_latest: null,
      version_active: null,
      language
    };
    const ret = await this.post("documents/", body);
    if (ret) {
      let form = new FormData();
      form.append('file_new', file);
      form.append('action', "1");
      form.append("action_name", "replace")

      try {
        const response = await axios.post(`${this.url}documents/${ret.id}/files/`, form, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status == 202) {
          if (cabinet_id) {
            await this.addDocumentToCabinet(ret.id, cabinet_id.toString())
          }

          return ret;
        }
        return response.data;
      } catch (err) {
        console.log(err)
        throw new Error("Could not upload file")
      }
    } else {
      throw new Error("Could not create document")
    }

  }

  /**
   * retrieve documents matching a given query
   * @param query a search term
   * @returns the list of matching documents
   */
  public async filterByContent(query: string): Promise<Array<Document>> {
    return this.request("search/documents.documentsearchresult?q=" + query);
  }

}



export const mayan = new Mayan();
