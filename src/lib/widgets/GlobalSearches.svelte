<script lang="ts">
  import Search from "./Search.svelte";
  import Tags from "./Tags.svelte";
  import {createEventDispatcher} from "svelte";
  import {slide} from "svelte/transition";
  import {_} from "svelte-i18n";
  const dispatch = createEventDispatcher();
</script>
<div transition:slide={{ duration: 200 }}>
  <ul>
    <li>
      <!-- Favorites -->
      <a
        href="#/"
        on:click={() =>
          dispatch("selected", { id: -3, full_path: $_("favorites") })}
        >{$_("favorites")}</a>
    </li>
    <li>
      <!-- last created -->
      <a
        href="#/"
        on:click={() =>
          dispatch("selected", { id: -1, full_path: $_("lastcreated") })}
        >{$_("lastcreated")}</a>
    </li>
    <li>
      <!-- last accessed -->
      <a
        href="#/"
        on:click={() =>
          dispatch("selected", { id: -2, full_path: $_("lastaccessed") })}
        >{$_("lastaccessed")}</a>
    </li>
    <li>
      <!-- matching a search term -->
      <Search
        on:search={(event) =>
          dispatch("selected", { id: -5, full_path: event.detail })}></Search>
    </li>
  </ul>
  <!-- having a tag -->
  <div class="mt-3 w-32">
    <Tags on:selected></Tags>
  </div>
</div>