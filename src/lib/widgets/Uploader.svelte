<!-- Select a file to upload to Mayan-->
<script lang="ts">
  import { _ } from "svelte-i18n";
  import type { DocumentType, Cabinet } from "../model/types";
  import { cabinets, documentTypes } from "../model/store";
  import { mayan } from "../model/mayan";
  import Dropdown from "./Dropdown.svelte";
  import Dropzone from "svelte-file-dropzone";
  let selectedFile: File | undefined;
  let selectedType: DocumentType;
  let selectedCabinet: Cabinet;
  let buttontext = $_("upload");
  let fileinput: HTMLInputElement;
  async function uploadFile(): Promise<boolean> {
    buttontext = $_("wait");
    const result = await mayan.createDocument(
      selectedType ?? $documentTypes[0],
      selectedCabinet?.id,
      "deu", // TODO generalize
      selectedFile!,
    );
    if (result) {
      inputlabel = $_("file");
      buttontext = $_("upload");
      return true;
    } else {
      return false;
    }
  }
  function changeName(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      selectedFile = target.files[0];
      inputlabel = selectedFile.name.split("\\").pop() || $_("file");
    }
  }
  function handleDropped(event: any) {
    const files = event.detail.acceptedFiles;
    if (Array.isArray(files)) {
      selectedFile = files[0];
    } else {
      selectedFile = undefined;
    }
    inputlabel = selectedFile?.name.split("\\").pop() || $_("file");
  }
  let inputlabel = $_("file");
</script>

<div class="flex flex-col mt-4 mr-4">
  <Dropdown
    title={$_("doctype")}
    elements={$documentTypes}
    bind:selected={selectedType}
    label={(x) => x.label} />

  <Dropdown
    title={$_("cabinet")}
    elements={$cabinets}
    label={(x) => x.full_path}
    bind:selected={selectedCabinet} />
  <input
    class="inputfile"
    bind:this={fileinput}
    type="file"
    id="files"
    bind:value={selectedFile}
    on:change={changeName} />
  <Dropzone on:drop={handleDropped} inputElement={fileinput} multiple={false}>
    <p>{inputlabel}</p>
  </Dropzone>

  <button
    class="large"
    disabled={selectedFile == undefined}
    on:click={uploadFile}
    class:hidden={selectedFile == undefined}>{buttontext}</button>
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
</style>
