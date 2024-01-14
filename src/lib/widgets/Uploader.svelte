<!-- Select a file to upload to Mayan-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { _ } from 'svelte-i18n';
  import type { DocumentType, Cabinet } from '../types';
  import { store } from '../store';
  import { mayan } from '../mayan';
  import Dropdown from './Dropdown.svelte';
  let selectedFile: File;
  let documentTypes: Array<DocumentType> = [];
  let cabinets: Array<Cabinet> = [];
  let selectedType: DocumentType;
  let selectedCabinet: Cabinet;
  let buttontext = $_('upload');

  async function uploadFile(): Promise<boolean> {
    buttontext = $_('wait');
    const result = await mayan.createDocument(
      selectedType,
      selectedCabinet?.id,
      'deu', // TODO generalize
      selectedFile,
    );
    if (result) {
      inputlabel = $_('file');
      buttontext = $_('upload');
      return true;
    } else {
      return false;
    }
  }
  function changeName(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      selectedFile = target.files[0];
      inputlabel = selectedFile.name.split('\\').pop() || $_('file');
    }
  }
  let inputlabel = $_('file');
  onMount(async () => {
    documentTypes = await store.getDocumentTypes();
    cabinets = await store.getCabinets();
  });
</script>

<div class="flex flex-col mt-4 mr-4">
  <Dropdown
    title={$_('doctype')}
    elements={documentTypes}
    bind:selected={selectedType}
    label={(x) => x.label} />

  <Dropdown
    title={$_('cabinet')}
    elements={cabinets}
    label={(x) => x.label}
    bind:selected={selectedCabinet} />
  <input
    class="inputfile"
    type="file"
    id="files"
    accept=".pdf"
    bind:value={selectedFile}
    on:change={changeName} />
  <label for="files">{inputlabel}</label>

  <button class="large" on:click={uploadFile}>{buttontext}</button>
</div>

<style>
  .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
  .inputfile + label {
    margin-top: 2px;
    margin-bottom: 2px;
    display: inline-block;
    font-weight: 500;
    padding: 0.3rem 1.2rem;
    border: 1px solid lightblue;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .inputfile:focus + label {
    outline: 2px dotted blue;
    outline: -webkit-focus-ring-color auto 5px;
  }
  .inputfile:hover + label {
    background-color: lightblue;
  }
</style>
