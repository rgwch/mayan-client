<script lang="ts">
  import { _ } from "svelte-i18n";
  import { mayan } from "../mayan";
  import { store } from "../store";
  import type { Cabinet, DocumentType, Tag } from "../types";
  import { onMount, createEventDispatcher } from "svelte";
  import Dropdown from "./Dropdown.svelte";
  let selectedParent: Cabinet | null = null;
  let name: string = "";
  let cabinets: Array<Cabinet> = [];
  function createCabinet() {
    mayan.createCabinet(name, selectedParent?.id).then((result) => {
      console.log(result);
    });
  }
  onMount(async () => {
    cabinets = await store.getCabinets();
  });
</script>

<div class="flex flex-col">
  <Dropdown
    title={$_("parent")}
    elements={cabinets}
    label={(c) => c.label}
    bind:selected={selectedParent}></Dropdown>
  <input
    type="text"
    placeholder={$_("name")}
    bind:value={name}
    class="border-2 border-gray-200 rounded-md p-2" />
  <button class="large" on:click={createCabinet}> {$_("create")}</button>
</div>
