<!-- Right panel on PC displays, bottom portion on mobile devices: List of documents according to current selection-->
<script lang="ts">
  import DocumentDisplay from "./Document.svelte";
  import { _ } from "svelte-i18n";
  import { mayan } from "./model/mayan";
  import type { Document, Cabinet } from "./model/types";
  import Dial from "./widgets/Dial.svelte";
  import { cabinets } from "./model/store";
  export let cabinet: Cabinet | null;
  let currentCabinet = cabinet?.id;
  const pagesize = 25;
  let currentPage: number = 1;
  let docs: Array<Document> | null = null;
  let hasNext = false;
  let hasPrev = false;

  $: if (cabinet?.id !== currentCabinet) {
    currentCabinet = cabinet?.id;
    currentPage=1
    reload().then((d) => {
      docs = d;
    });
  }
  async function reload(): Promise<Array<Document>> {
    let d = [];
    docs = null;
    // console.log("reloading page " + currentPage);
    switch (cabinet!.id) {
      case -1:
        d = await mayan.listRecentlyAddedDocuments({
          page: currentPage,
          pagesize,
        });
        break;
      case -2:
        d = await mayan.listRecentlyAccessedDocuments({
          page: currentPage,
          pagesize,
        });
        break;
      case -3:
        const result = await mayan.listFavouriteDocuments({
          page: currentPage,
          pagesize,
        });
        d = result.map((d) => d.document);
        break;
      case -4:
        d = await mayan.listDocumentsWithTagId(cabinet!.parent_id!);
        break;
      case -5:
        d = await mayan.filterByContent(cabinet!.full_path);
        break;
      default:
        d = await mayan.listDocumentsFromCabinet(cabinet!, {
          page: currentPage,
          pagesize,
        });
    }
    if (d) {
      hasPrev = currentPage > 1;
      hasNext = d.length == pagesize;
    }else{
      currentPage=1
      hasPrev=false
      return await reload()
    }
    return d;
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
      {:else}
        <Dial
          bind:current={currentPage}
          {hasNext}
          {hasPrev}
          on:change={async () => {
            docs = await reload();
          }}></Dial>
      {/if}
    </div>

    <ul class="overflow-y-auto h-[80vh]">
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
          <p class="mx-auto mt-5">{$_("no_documents")}</p>
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
      {$_("select_cabinet")}
    </p>
  {/if}
</div>
