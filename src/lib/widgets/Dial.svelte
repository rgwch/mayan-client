<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let current: number;
    export let hasNext: boolean = false;
    export let hasPrev: boolean = false;
    const dispatch = createEventDispatcher();
    function change(nr: number) {
        current += nr;
        dispatch("change", current);
    }
</script>

<div
    class="flex flex-row items-end relative bottom-1"
    class:invisible={hasPrev == false && hasNext == false}>
    <button
        class="border border-blue-800 bottom-2 px-1 mx-2 hover:bg-blue-200 h-5 text-sm"
        class:invisible={!hasPrev}
        disabled={!hasPrev}
        on:click={() => change(-1)}>&lt;</button>
    <div class="mt-1">{current}</div>
    <button
        class="border border-blue-800 px-1 mx-2 hover:bg-blue-200 h-5 text-sm"
        class:invisible={!hasNext}
        disabled={!hasNext}
        on:click={() => change(1)}>&gt;</button>
</div>
