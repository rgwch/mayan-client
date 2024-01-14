<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { _ } from 'svelte-i18n';
  import { mayan } from './mayan';
  import { store } from './store';
  import type { Cabinet, DocumentType, Tag } from './types';
  import Dropdown from './widgets/Dropdown.svelte';
  import Uploader from './widgets/Uploader.svelte';
  const dispatch = createEventDispatcher();
  let cabinets: Array<Cabinet> = [];
  let doctypes: Array<DocumentType> = [];
  let toplevel: Array<Cabinet> = [];
  let tags: Array<Tag> = [];
  onMount(async () => {
    cabinets = await store.getCabinets();
    toplevel = cabinets.filter((c) => c.parent_id === null);
    doctypes = await store.getDocumentTypes();
    tags = await store.getTags();
  });
</script>

<h1 class="text-2xl font-bold">{$_('cabinets')}</h1>
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
<h1 class="text-2xl font-bold mt-4 pt-2 border-t-2 border-blue-200">
  {$_('all')}
</h1>
<ul>
  <li>
    <a
      href="#/"
      on:click={() =>
        dispatch('selected', { id: -3, full_path: $_('favorites') })}
      >{$_('favorites')}</a>
  </li>
  <li>
    <a
      href="#/"
      on:click={() =>
        dispatch('selected', { id: -1, full_path: $_('lastcreated') })}
      >{$_('lastcreated')}</a>
  </li>
  <li>
    <a
      href="#/"
      on:click={() =>
        dispatch('selected', { id: -2, full_path: $_('lastaccessed') })}
      >{$_('lastaccessed')}</a>
  </li>
</ul>
<div class="mt-3">
  <Dropdown
    title={$_('tags')}
    elements={tags}
    label={(t) => t.label}
    on:selected={(t) =>
      dispatch('selected', {
        id: -4,
        full_path: t.detail.label,
        parent_id: t.detail.id,
      })} />
</div>

<div>
  <div class="mt-4 pt-2 border-t-2 border-blue-200">
    <p class="text-center text-2xl font-bold">{$_('create')}</p>
    <Uploader></Uploader>
  </div>
  <div class="border-t-2 mt-4  border-blue-200">
    <button class="mt-4 large mx-auto" on:click={() => mayan.logout()}
      >{$_('logout')}</button>
  </div>
</div>
