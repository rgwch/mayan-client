<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
</script>

<div class="flex flex-row">
    <button>&lt;</button>
    <input type="number" />
    <button>&gt;</button>
</div>
