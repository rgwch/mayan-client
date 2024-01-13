import type { Cabinet, Document, Tag, DocumentType } from "./types";
import axios from 'axios'
const API = "/api/v4/"
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

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
      if (resumable) {
        localStorage.setItem("token", this.token);
        localStorage.setItem("url", this.url);
      }
      return true;
    } else {
      return false;
    }
  }
  public logout() {
    localStorage.removeItem("token");
    localStorage.setItem("url", this.url.substring(0, this.url.length - API.length));
    // localStorage.removeItem("url");
    window.location.reload();
  }

  /**
   * Check if a previous session can be resumed (and resume it)
   * @returns true if a previous session was resumed
   */
  public async canResume(): Promise<boolean> {
    this.token = localStorage.getItem("token") ?? "";
    this.url = localStorage.getItem("url") ?? "";
    if (this.token.length > 0 && this.url.length > 0) {
      try {
        const test = await this.request("cabinets/", 1);
        axios.defaults.headers.common['Authorization'] = `Token ${this.token}`
        return true;
      } catch (err) {
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
      url.indexOf("/api/v4/") + "api/v4/".length + 1
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
      url.indexOf("/api/v4/") + "api/v4/".length + 1
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
  public async request(suburl: string, limit = 0): Promise<Array<any>> {
    let ret: Array<any> = [];
    let pagesize = Math.min(limit, 50);
    let page = this.url + suburl + (pagesize ? "?page_size=" + pagesize : "");
    do {
      try {
        const result = await axios({
          method: "GET",
          url: page
        })
        const json = result.data;
        ret = ret.concat(json.results);
        page = this.normalizeURL(json.next);
      } catch (e) {
        console.log(e);
        return ret;
      }
    } while (page && (!limit || ret.length < limit));
    return ret;
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
  public async listCabinets(): Promise<Array<Cabinet>> {
    return this.request("cabinets/");
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
  public async listDocuments(): Promise<Array<Document>> {
    return this.request("documents/");
  }
  /**
   * List all documents in a cabinet
   * @param cabinet
   * @returns
   */
  public async listDocumentsFromCabinet(
    cabinet: Cabinet,
    limit = 0
  ): Promise<Array<Document>> {
    return this.request("cabinets/" + cabinet.id + "/documents", limit);
  }
  /**
   * Retrieve recently added documents
   * @returns
   */
  public async listRecentlyAddedDocuments(limit = 0): Promise<Array<Document>> {
    return this.request("documents/created/", limit);
  }
  /**
   * retrieve recently accessed documents
   * @param limit 
   * @returns 
   */
  public async listRecentlyAccessedDocuments(limit = 0): Promise<Array<Document>> {
    const result = await this.request("documents/accessed/", limit);
    return result.map(obj => obj.document)
  }
  /**
   * List all favourite documents of the current user
   * @returns
   */
  public async listFavouriteDocuments(limit = 0): Promise<Array<Document>> {
    const result = await this.request("documents/favorites/", limit);
    return result.map(obj => obj.document)
  }

  /**
   * List all available document types
   * (Current user need permission to view document types)
   * @returns
   */
  public async listDocumentTypes(): Promise<Array<DocumentType>> {
    return this.request("document_types/");
  }

  /**
   * List all tags in the system. 
   * (Current user need permission to view tags)
   * @returns 
   */
  public async listTags(): Promise<Array<Tag>> {
    return this.request("tags/");
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

  public async listDocumentsWithTag(tag: Tag): Promise<Array<Document>> {
    return this.request("tags/" + tag.id + "/documents/");
  }
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
   * @param label 
   * @param language 
   * @returns 
   */
  public async createDocument(type: DocumentType, cabinet_id: number, label: string, language: string = "deu", file: File): Promise<Document> {
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

}



export const mayan = new Mayan();
