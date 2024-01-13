<script lang="ts">
  import {createEventDispatcher} from 'svelte';
  const dispatch= createEventDispatcher();
  export let text: string;
  export let textcolor: string;
  export let backgroundcolor: string;
</script>
<span style="color:{textcolor};background-color:{backgroundcolor};" class="inline-flex items-center gap-x-0.5 rounded-md bg-[{backgroundcolor}] px-2 py-1 mx-1 text-xs font-medium text-[{textcolor}] ring-1 ring-inset ring-gray-500/10">
  {text}
  <button type="button" class="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-[{backgroundcolor}]/20" on:click={()=>{dispatch("remove")}}>
    <span class="sr-only">Remove</span>
    <svg viewBox="0 0 14 14" class="h-3.5 w-3.5 stroke-gray-600/50 group-hover:stroke-gray-600/75">
      <path d="M4 4l6 6m0-6l-6 6" />
    </svg>
    <span class="absolute -inset-1"></span>
  </button>
</span>