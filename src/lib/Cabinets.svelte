<!-- Left column on PC displays, top row on mobile devices -->
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { slide } from 'svelte/transition';
  import { _ } from 'svelte-i18n';
  import { mayan } from './model/mayan';
  import Fa from 'svelte-fa';
  import { faPlus, faFolderPlus } from '@fortawesome/free-solid-svg-icons';
  import { cabinets, documentTypes, tags } from './model/store';
  import type { Cabinet, DocumentType, Tag } from './model/types';
  import Dropdown from './widgets/Dropdown.svelte';
  import Uploader from './widgets/Uploader.svelte';
  import Search from './widgets/Search.svelte';
  import CreateCabinet from './widgets/CreateCabinet.svelte';
  import { Tree } from './model/tree';
  import { CabinetTreeLoader } from './model/treeloader';
  import Treeview from './widgets/Treeview.svelte';
  const dispatch = createEventDispatcher();
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

<!-- create new cabinet -->
<div class="flex flex-row">
  <h1 class="text-xl font-bold">{$_('cabinets')}</h1>
  <button
    class="ml-3 text-sm text-gray-600"
    on:click={() => (createPanel = !createPanel)}
    ><Fa icon={faFolderPlus}></Fa></button>
</div>
{#if createPanel}
  <div transition:slide={{ duration: 200 }}>
    <CreateCabinet on:created={addedCabinet}></CreateCabinet>
  </div>
{/if}
<!-- List of all cabinets -->
<ul>
  {#each toplevel as tree}
    <li>
      <Treeview {tree} on:selected></Treeview>
    </li>
  {/each}
</ul>

<!-- collections not related to a single cabinet -->
<h1 class="text-xl font-bold mt-4 pt-2 border-t-2 border-blue-200">
  {$_('all')}
</h1>
<ul>
  <li>
    <!-- Favorites -->
    <a
      href="#/"
      on:click={() =>
        dispatch('selected', { id: -3, full_path: $_('favorites') })}
      >{$_('favorites')}</a>
  </li>
  <li>
    <!-- last created -->
    <a
      href="#/"
      on:click={() =>
        dispatch('selected', { id: -1, full_path: $_('lastcreated') })}
      >{$_('lastcreated')}</a>
  </li>
  <li>
    <!-- last accessed -->
    <a
      href="#/"
      on:click={() =>
        dispatch('selected', { id: -2, full_path: $_('lastaccessed') })}
      >{$_('lastaccessed')}</a>
  </li>
  <li>
    <!-- matching a search term -->
    <Search
      on:search={(event) =>
        dispatch('selected', { id: -5, full_path: event.detail })}></Search>
  </li>
</ul>
<!-- having a tag -->
<div class="mt-3 w-32">
  <Dropdown
    title={$_('tags')}
    elements={$tags}
    label={(t) => t.label}
    on:selected={(t) =>
      dispatch('selected', {
        id: -4,
        full_path: t.detail.label,
        parent_id: t.detail.id,
      })} />
</div>

<!-- Create/Upload documents -->
<div>
  <div class="mt-4 pt-2 border-t-2 border-blue-200">
    <p class="text-center text-xl font-bold">{$_('create')}</p>
    <Uploader></Uploader>
  </div>
  <!-- Logout -->
  <div class="border-t-2 mt-4 border-blue-200">
    <button class="mt-4 large w-40" on:click={() => mayan.logout()}
      >{$_('logout')}</button>
  </div>
</div>
