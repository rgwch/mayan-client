<script lang="ts">
  import DocumentDisplay from "./Document.svelte";
  import { _ } from "svelte-i18n";
  import { mayan } from "./mayan";
  import type { Document, Cabinet } from "./types";
  import Uploader from "./widgets/Uploader.svelte";
  export let cabinet: Cabinet | null;
  let docs: Array<Document> = [];

  $: if (cabinet != null) {
    if (cabinet.id === -1) {
      mayan.listRecentlyAddedDocuments().then((result) => {
        docs = result;
      });
    } else if (cabinet.id === -2) {
      mayan.listRecentlyAccessedDocuments().then((result) => {
        docs = result;
      });
    } else if (cabinet.id === -3) {
      mayan.listFavouriteDocuments().then((result) => {
        docs = result;
      });
    } else if (cabinet.id === -4) {
      mayan.listDocumentsWithTagId(cabinet.parent_id).then((result) => {
        docs = result;
      });
    } else {
      mayan.listDocumentsFromCabinet(cabinet).then((result) => {
        docs = result;
      });
    }
  }
</script>

<div>
  {#if cabinet}
    <h1 class="text-2xl font-bold">{cabinet.full_path}</h1>
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
      {$_("select_cabinet")}
      <a href="#/" on:click={mayan.logout}>{$_("logout")}</a>
    </p>
  {/if}
</div>
