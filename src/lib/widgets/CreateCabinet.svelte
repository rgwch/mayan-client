<script lang="ts">
  import { _ } from 'svelte-i18n';
  import { mayan } from '../model/mayan';
  import { cabinets } from '../model/store';
  import type { Cabinet, DocumentType, Tag } from '../model/types';
  import { onMount, createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  import Dropdown from './Dropdown.svelte';
  let selectedParent: Cabinet | null = null;
  let name: string = '';
  function createCabinet() {
    mayan.createCabinet(name, selectedParent?.id).then((result) => {
      if (result) {
        name = '';
        selectedParent = null;
        dispatch('created', result);
      }
    });
  }
</script>

<div class="flex flex-col">
  <Dropdown
    title={$_('parent')}
    elements={$cabinets}
    label={(c) => c.label}
    bind:selected={selectedParent}></Dropdown>
  <input
    type="text"
    placeholder={$_('name')}
    bind:value={name}
    class="border-2 border-gray-200 rounded-md p-2" />
  <button class="large" on:click={createCabinet}> {$_('create')}</button>
</div>
