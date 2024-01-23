<script lang="ts">
  import { slide } from "svelte/transition";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let open = false;
  export let title = "";
  export let locked = false;

  function clicked() {
    open = !open;
    dispatch("open", open);
  }
</script>

<div>
  {#if locked}
    <slot name="header">
      <span class="text-sm">{title}</span>
    </slot>
  {:else}
    <a href="#/" on:click={clicked}>
      <slot name="header">
        <span class="text-sm">{title}</span>
      </slot>
    </a>
    {#if open}
      <div transition:slide={{ duration: 200 }}>
        <slot name="body" class="h-auto" />
      </div>
    {/if}
  {/if}
</div>
