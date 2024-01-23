<!-- Display a single document -->
<script lang="ts">
  import { mayan } from "./model/mayan";
  import { createEventDispatcher } from "svelte";
  import { DateTime } from "luxon";
  import { _ } from "svelte-i18n";
  import { slide } from "svelte/transition";
  import { cabinets, tags, favourites, documentTypes } from "./model/store";
  import type { Document, Tag, DocumentType, Cabinet } from "./model/types";
  import Fa from "svelte-fa";
  import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
  import Badge from "./widgets/Badge.svelte";
  import Dropdown from "./widgets/Dropdown.svelte";
  import Card from "./widgets/Card.svelte";
  const dispatch = createEventDispatcher();
  export let document: Document;
  let imageURL: any;
  let isOpen: boolean = false;
  let imageList: Array<string>;
  let assignedTags: Array<Tag> = [];
  let currentImage: number = 0;
  let assignedCabinets: Array<Cabinet> = [];
  let isFavorite: boolean = false;
  let title: string = $_("wait");
  let editingTitle: boolean = false;
  let editingDoctype: boolean = false;
  makeTitle();
  async function load() {
    isOpen = !isOpen;
    if (isOpen) {
      if (document.version_active?.page_list_url) {
        imageList = await mayan.getImageURLs(document);
        if (imageList.length > 0) {
          imageURL = await mayan.loadImage(imageList[0]);
          currentImage = 0;
        }
      }
      assignedTags = await mayan.listTagsForDocument(document);
      assignedCabinets = await mayan.listCabinetsOfDocument(document);
    } else {
      URL.revokeObjectURL(imageURL);
    }
  }
  async function nextImage() {
    if (currentImage < imageList.length - 1) {
      currentImage++;
      imageURL = await mayan.loadImage(imageList[currentImage]);
    }
  }
  async function prevImage() {
    if (currentImage > 0) {
      currentImage--;
      imageURL = await mayan.loadImage(imageList[currentImage]);
    }
  }
  async function saveDesc(event: any) {
    console.log("save " + document.description);
    await mayan.updateDocument(document, { description: document.description });
  }
  async function downloadFile() {
    const blob = await mayan.loadBlob(document.file_latest.download_url);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.label;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  }
  async function removeTag(tag: Tag) {
    await mayan.removeTagFromDocument(document, tag);
    assignedTags = await mayan.listTagsForDocument(document);
  }
  async function addTag(event: any) {
    await mayan.addTagToDocument(document, event.detail);
    assignedTags = await mayan.listTagsForDocument(document);
  }
  async function addCabinet(event: any) {
    await mayan.addDocumentToCabinet(document.id, event.detail?.id);
    assignedCabinets = await mayan.listCabinetsOfDocument(document);
  }
  async function removeCabinet(cab: Cabinet) {
    await mayan.removeDocumentFromCabinet(document.id, cab);
    assignedCabinets = await mayan.listCabinetsOfDocument(document);
  }
  async function editTitle() {
    await mayan.updateDocument(document, { label: document.label });
    await makeTitle();
    editingTitle = false;
  }
  async function makeTitle(): Promise<string> {
    const favs = $favourites.map((f) => f.document);
    title =
      document.label +
      " (" +
      DateTime.fromISO(document.datetime_created).toFormat($_("dateformat")) +
      ")";
    if (favs.find((f) => f.id === document.id)) {
      isFavorite = true;
      title = "★ " + title;
    }
    return title;
  }
  async function makeFavorite() {
    isFavorite = !isFavorite;
    if (isFavorite) {
      await mayan.addToFavourites(document);
    } else {
      await mayan.removeFromFavourites(document.id);
    }
    favourites.set(await mayan.listFavouriteDocuments());
    await makeTitle();
  }
  async function deleteDocument() {
    if (confirm($_("really_delete", { values: { file: document.label } }))) {
      const id = document.id;
      await mayan.deleteDocument(document);
      dispatch("deleted", id);
    }
  }
  async function setDocumentType(dt: DocumentType) {
    await mayan.setDocumentType(document.id, dt.id);
    document.document_type = dt;
    editingDoctype = false;
  }
</script>

<div>
  <div class="flex flex-row">
    {#if editingTitle}
      <div
        role="textbox"
        tabindex="0"
        contenteditable="true"
        on:blur={editTitle}
        on:keypress={(e) => {
          if (e.key === "Enter") {
            editTitle();
            e.preventDefault();
          }
        }}
        bind:innerText={document.label}>
      </div>
    {:else}
      <a href="#/" class="text-sm" on:click={load}>{title}</a>
    {/if}
    {#if isOpen}
      <a href="#/" on:click={() => (editingTitle = true)}>
        <Fa icon={faPencil} class="ml-2" /></a>
      <a href="#/" on:click={deleteDocument}>
        <Fa icon={faTrash} class="ml-2" /></a>
    {/if}
  </div>
  {#if isOpen}
    <div transition:slide={{ duration: 200 }}>
      <div class="text-xs font-medium flex flex-row">
        <div>
          {$_("created")}: {DateTime.fromISO(
            document.datetime_created,
          ).toFormat($_("dateformat"))}
        </div>
        <div class="ml-4 flex flex-row">
          {#if editingDoctype}
            <Dropdown
              title={document.document_type.label}
              elements={$documentTypes}
              small={false}
              label={(dt) => dt.label}
              left={false}
              on:selected={(dt) => setDocumentType(dt.detail)} />
          {:else}
            <span>{$_("doctype")}: {document.document_type.label}</span>
          {/if}

          <a
            href="#/"
            on:click={() => {
              editingDoctype = !editingDoctype;
            }}>
            <Fa icon={faPencil} class="ml-2" />
          </a>
        </div>
        <div class="ml-4">
          <input
            type="checkbox"
            bind:checked={isFavorite}
            on:click={makeFavorite} />
          {$_("favorite")}
        </div>
      </div>
      <!-- Show associated cabinets and allow adding and removing -->
      <div class="flex flex-row border p-2 w-full">
        {#each assignedCabinets as cab}
          <Badge
            text={cab.full_path}
            textcolor={"#000000"}
            backgroundcolor={"#eeeeee"}
            on:remove={() => removeCabinet(cab)}></Badge>
        {/each}
        <div class="flex-grow"></div>
        <Dropdown
          title={$_("add_cabinet")}
          elements={$cabinets.sort((a, b) =>
            a.full_path.localeCompare(b.full_path),
          )}
          small={true}
          label={(c) => c.full_path}
          left={false}
          on:selected={(c) => addCabinet(c)} />
      </div>
      <!-- Show associated tags and allow adding and removing -->
      <div class="flex flex-row border bg-blue-100 my-1 p-2 w-full">
        {#each assignedTags as tag}
          <Badge
            text={tag.label}
            textcolor={tag.color}
            backgroundcolor={"#1a1a1a1a"}
            on:remove={() => removeTag(tag)}></Badge>
        {/each}
        <div class="flex-grow"></div>
        <Dropdown
          title={$_("add_tag")}
          elements={$tags}
          small={true}
          label={(t) => t.label}
          left={false}
          on:selected={addTag}>
        </Dropdown>
      </div>
      <!-- Show descrition and allow editing. Save on focus lost -->
      <Card heading={$_("description")}>
        <textarea
          class="w-full"
          on:focusout={saveDesc}
          placeholder={$_("no_description")}
          bind:value={document.description} />
      </Card>
      <!-- Show preview images and allow navigation and download -->
      <div class="border border-blue-200 m-2 p-2">
        {#if imageURL}
          <div class="border border-blue-100 m-2 p-2">
            {#if imageList.length > 1}
              <button
                class="border border-blue-800 p-1 mx-2 hover:bg-blue-200"
                on:click={prevImage}>&lt;</button>
              {$_("page")}
              {currentImage + 1} / {imageList.length}
              <button
                class="border border-blue-800 p-1 mx-2 hover:bg-blue-200"
                on:click={nextImage}>&gt;</button>
            {/if}
            <button
              class="border border-blue-800 p-1 mx-2 hover:bg-blue-200"
              on:click={downloadFile}>{$_("download")}</button>
            <img src={imageURL} alt={document.label} width="400" />
          </div>
        {:else}
          <p>{$_("no_image")}</p>
        {/if}
      </div>
    </div>
  {/if}
</div>
