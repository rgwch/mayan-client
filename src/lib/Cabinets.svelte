<!-- Left column on PC displays, top row on mobile devices -->
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { mayan } from './mayan';
  import { cabinets, documentTypes, tags } from './store';
  import type { Cabinet, DocumentType, Tag } from './types';
  import Dropdown from './widgets/Dropdown.svelte';
  import Uploader from './widgets/Uploader.svelte';
  import Search from './widgets/Search.svelte';
  import CreateCabinet from './widgets/CreateCabinet.svelte';
  const dispatch = createEventDispatcher();
  $: toplevel = $cabinets.filter((c) => c.parent_id === null);
  let createPanel = false;
  function addedCabinet(event: any) {
    createPanel = false;
    cabinets.set([...$cabinets, event.detail]);
    toplevel = $cabinets.filter((c) => c.parent_id === null);
  }
</script>

<!-- create new cabinet -->
<div class="flex flex-row">
  <h1 class="text-xl font-bold">{$_('cabinets')}</h1>
  <button class="ml-3 text-xl" on:click={() => (createPanel = !createPanel)}
    >⊕</button>
</div>
{#if createPanel}
  <CreateCabinet on:created={addedCabinet}></CreateCabinet>
{/if}
<!-- List of all cabinets -->
{#each toplevel as cabinet}
  <ul>
    <li>
      <a href="#/" on:click={() => dispatch('selected', cabinet)}
        >{cabinet.label}</a>
    </li>
    {#if cabinet.children.length}
      <ul>
        {#each cabinet.children as child}
          <li>
            <a
              href="#/"
              class="ml-3"
              on:click={() => dispatch('selected', child)}>- {child.label}</a>
          </li>
        {/each}
      </ul>
    {/if}
  </ul>
{/each}
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
<div class="mt-3">
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
    <button class="mt-4 large mx-auto" on:click={() => mayan.logout()}
      >{$_('logout')}</button>
  </div>
</div>
