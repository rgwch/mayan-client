<script lang="ts">
  import { mayan } from './mayan';
  import { DateTime } from 'luxon';
  import { _ } from 'svelte-i18n';
  import { store } from './store';
  import type { Document, Tag, DocumentType, Cabinet } from './types';
  import Collapse from './widgets/Collapse.svelte';
  import Badge from './widgets/Badge.svelte';
  import Dropdown from './widgets/Dropdown.svelte';
  import Card from './widgets/Card.svelte';
  export let document: Document;
  let imageURL: any;
  let isOpen: boolean = false;
  let imageList: Array<string>;
  let tags: Array<Tag> = [];
  let allTags: Array<Tag> = [];
  let currentImage: number = 0;
  let cabinets: Array<Cabinet> = [];
  let allCabinets: Array<Cabinet> = [];
  store.getTags().then((t) => (allTags = t));
  store.getCabinets().then((c) => (allCabinets = c));
  async function load() {
    if (isOpen) {
      if (document.version_active?.page_list_url) {
        imageList = await mayan.getImageURLs(document);
        if (imageList.length > 0) {
          imageURL = await mayan.loadImage(imageList[0]);
          currentImage = 0;
        }
      }
      tags = await mayan.listTagsForDocument(document);
      cabinets = await mayan.listCabinetsOfDocument(document);
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
    console.log('save ' + document.description);
    await mayan.updateDocument(document, { description: document.description });
  }
  async function downloadFile() {
    const blob = await mayan.loadBlob(document.file_latest.download_url);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = window.document.createElement('a');
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
    tags = await mayan.listTagsForDocument(document);
  }
  async function addTag(event: any) {
    await mayan.addTagToDocument(document, event.detail);
    tags = await mayan.listTagsForDocument(document);
  }
  async function addCabinet(event: any) {
    await mayan.addDocumentToCabinet(document.id, event.detail?.id);
    cabinets = await mayan.listCabinetsOfDocument(document);
  }
  async function removeCabinet(cab: Cabinet) {
    await mayan.removeDocumentFromCabinet(document.id, cab);
    cabinets = await mayan.listCabinetsOfDocument(document);
  }
</script>

<div>
  <Collapse title={document.label} on:open={load} bind:open={isOpen}>
    <div slot="body">
      <div class="text-xs font-medium flex flex-row">
        <div>
          {$_('created')}: {DateTime.fromISO(
            document.datetime_created,
          ).toFormat($_('dateformat'))}
        </div>
        <div class="ml-4">
          {$_('doctype')}: {document.document_type.label}
        </div>
      </div>
      <div class="flex flex-row border p-2 w-full">
        {#each cabinets as cab}
          <Badge
            text={cab.full_path}
            textcolor={'#000000'}
            backgroundcolor={'#eeeeee'}
            on:remove={() => removeCabinet(cab)}></Badge>
        {/each}
        <div class="flex-grow"></div>
        <Dropdown
          title={$_('add_cabinet')}
          elements={allCabinets}
          small={true}
          label={(c) => c.full_path}
          left={false}
          on:selected={(c) => addCabinet(c)} />
      </div>

      <div class="flex flex-row border bg-blue-100 my-1 p-2 w-full">
        {#each tags as tag}
          <Badge
            text={tag.label}
            textcolor={tag.color}
            backgroundcolor={'#1a1a1a1a'}
            on:remove={() => removeTag(tag)}></Badge>
        {/each}
        <div class="flex-grow"></div>
        <Dropdown
          title={$_('add_tag')}
          elements={allTags}
          small={true}
          label={(t) => t.label}
          left={false}
          on:selected={addTag}>
        </Dropdown>
      </div>
      <Card heading={$_('description')}>
        <textarea
          class="w-full"
          on:focusout={saveDesc}
          placeholder={$_('no_description')}
          bind:value={document.description} />
      </Card>
      <div class="border border-blue-200 m-2 p-2">
        {#if imageURL}
          <div class="border border-blue-100 m-2 p-2">
            {#if imageList.length > 1}
              <button
                class="border border-blue-800 p-1 mx-2 hover:bg-blue-200"
                on:click={prevImage}>&lt;</button>
              {$_('page')}
              {currentImage + 1} / {imageList.length}
              <button
                class="border border-blue-800 p-1 mx-2 hover:bg-blue-200"
                on:click={nextImage}>&gt;</button>
            {/if}
            <button
              class="border border-blue-800 p-1 mx-2 hover:bg-blue-200"
              on:click={downloadFile}>{$_('download')}</button>
            <img src={imageURL} alt={document.label} width="400" />
          </div>
        {:else}
          <p>{$_('no_image')}</p>
        {/if}
      </div>
    </div>
  </Collapse>
</div>
