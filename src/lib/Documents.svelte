<!-- Right panel on PC displays, bottom portion on mobile devices: List of documents according to current selection-->
<script lang="ts">
  import DocumentDisplay from './Document.svelte';
  import { _ } from 'svelte-i18n';
  import { mayan } from './model/mayan';
  import type { Document, Cabinet } from './model/types';
  import { cabinets } from './model/store';
  export let cabinet: Cabinet | null;
  let docs: Array<Document> | null = null;

  $: if (cabinet != null) {
    docs = null;
    switch (cabinet.id) {
      case -1:
        mayan.listRecentlyAddedDocuments().then((result) => {
          docs = result;
        });
        break;
      case -2:
        mayan.listRecentlyAccessedDocuments().then((result) => {
          docs = result;
        });
        break;
      case -3:
        mayan.listFavouriteDocuments().then((result) => {
          docs = result.map((d) => d.document);
        });
        break;
      case -4:
        mayan.listDocumentsWithTagId(cabinet.parent_id).then((result) => {
          docs = result;
        });
        break;
      case -5:
        mayan.filterByContent(cabinet.full_path).then((result) => {
          docs = result;
        });
        break;
      default:
        mayan.listDocumentsFromCabinet(cabinet).then((result) => {
          docs = result;
        });
    }
  }
  function deleteCabinet() {
    if (cabinet) {
      mayan.deleteCabinet(cabinet.id).then(() => {
        cabinets.set($cabinets.filter((c) => c.id != cabinet?.id));
        cabinet = null;
      });
    }
  }
</script>

<div>
  {#if cabinet}
    <div class="flex flex-row">
      <h1 class="text-xl font-bold">{cabinet.full_path}</h1>
      {#if docs && docs.length == 0}
        <button class="ml-3 text-xl" on:click={deleteCabinet}>⊖</button>
      {/if}
    </div>
    <ul>
      {#if docs == null}
        <li>
          <div class="flex justify-center">
            <div
              class="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16">
              <img src="/loading.gif" alt="loading..." />
            </div>
          </div>
        </li>
      {:else if docs.length == 0}
        <li>
          <p class="mx-auto mt-5">{$_('no_documents')}</p>
        </li>
      {:else}
        {#each docs as doc}
          <li>
            {#key doc.id}
              <DocumentDisplay document={doc} />
            {/key}
          </li>
        {/each}
      {/if}
    </ul>
  {:else}
    <p class="mx-auto mt-5">
      {$_('select_cabinet')}
      <a href="#/" on:click={mayan.logout}>{$_('logout')}</a>
    </p>
  {/if}
</div>
