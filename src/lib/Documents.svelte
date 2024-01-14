<!-- Right panel on PC displays, bottom portion on mobile devices: List of documents according to current selection-->
<script lang="ts">
  import DocumentDisplay from './Document.svelte';
  import { _ } from 'svelte-i18n';
  import { mayan } from './mayan';
  import type { Document, Cabinet } from './types';
  import Uploader from './widgets/Uploader.svelte';
  export let cabinet: Cabinet | null;
  let docs: Array<Document> = [];

  $: if (cabinet != null) {
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
</script>

<div>
  {#if cabinet}
    <h1 class="text-xl font-bold">{cabinet.full_path}</h1>
    <ul>
      {#each docs as doc}
        <li>
          {#key doc.id}
            <DocumentDisplay document={doc} />
          {/key}
        </li>
      {/each}
    </ul>
  {:else}
    <p class="mx-auto mt-5">
      {$_('select_cabinet')}
      <a href="#/" on:click={mayan.logout}>{$_('logout')}</a>
    </p>
  {/if}
</div>
