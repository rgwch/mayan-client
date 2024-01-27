<!-- Left column on PC displays, top row on mobile devices -->
<script lang="ts">
  import { onMount, createEventDispatcher } from "svelte";
  import { slide } from "svelte/transition";
  import { _ } from "svelte-i18n";
  import { mayan } from "./model/mayan";
  import Fa from "svelte-fa";
  import { faPlus, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
  import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
  import { cabinets, documentTypes, tags } from "./model/store";
  import type { Cabinet, DocumentType, Tag } from "./model/types";
  import Dropdown from "./widgets/Dropdown.svelte";
  import Collapse from "./widgets/Collapse.svelte";
  import Uploader from "./widgets/Uploader.svelte";
  import Tags from "./widgets/Tags.svelte";
  import Search from "./widgets/Search.svelte";
  import CreateCabinet from "./widgets/CreateCabinet.svelte";
  import { Tree } from "./model/tree";
  import { CabinetTreeLoader } from "./model/treeloader";
  import Treeview from "./widgets/Treeview.svelte";
    import GlobalSearches from "./widgets/GlobalSearches.svelte";
  const dispatch = createEventDispatcher();
  let cabinetsOpen = window.screen.availWidth > 767 ? true : false;
  let globalsOpen = window.screen.availWidth > 767 ? true : false;

  let toplevel: Array<Tree<Cabinet>> = [];
  $: {
    toplevel = $cabinets
      .filter((c) => c.parent_id === null)
      .map((c) => new Tree<Cabinet>(null, c, new CabinetTreeLoader()));
  }
  let createPanel = false;
  function addedCabinet(event: any) {
    createPanel = false;
    cabinets.set([...$cabinets, event.detail]);
  }
</script>

<!-- Cabinet list -->
<div class="flex flex-row">
  <h1 class="text-xl font-bold">
    <a href="#/" on:click={() => (cabinetsOpen = !cabinetsOpen)}>
      {$_("cabinets")}
    </a>
  </h1>
  {#if cabinetsOpen}
    <button
      class="ml-3 text-sm text-gray-600"
      on:click={() => (createPanel = !createPanel)}
      ><Fa icon={faFolderPlus}></Fa></button>
  {/if}
</div>
<!-- create new cabinet -->
{#if createPanel}
  <div transition:slide={{ duration: 200 }}>
    <CreateCabinet on:created={addedCabinet}></CreateCabinet>
  </div>
{/if}
<!-- List of all cabinets -->
{#if cabinetsOpen}
  <ul transition:slide={{ duration: 200 }}>
    {#each toplevel as tree}
      <li>
        <Treeview {tree} on:selected></Treeview>
      </li>
    {/each}
  </ul>
{/if}

<!-- collections not related to a single cabinet -->
<div class="mt-4 pt-2 border-t-2 border-blue-200">
  <Collapse bind:open={globalsOpen}>
    <div slot="header">
      <span class="text-xl">{$_("all")}</span>
    </div>
    <div slot="body">
      <GlobalSearches></GlobalSearches>
    </div>
  </Collapse>
</div>
<!-- Create/Upload documents -->
<div>
  <div class="mt-4 pt-2 border-t-2 border-blue-200">
    <Collapse>
      <div slot="header">
        <span class="text-xl">{$_("create")}</span>
      </div>
      <div slot="body">
        <Uploader></Uploader>
      </div>
    </Collapse>
  </div>
  <!-- Logout -->
  <div class="border-t-2 mt-4 border-blue-200">
    <button class="mt-4 large w-40" on:click={() => mayan.logout()}
      >{$_("logout")}</button>
  </div>
</div>
