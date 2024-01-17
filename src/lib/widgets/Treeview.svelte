<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { Tree } from '../model/tree';
    import { cabinets } from '../model/store';
    const dispatch = createEventDispatcher();
    export let tree: Tree<any>;

    async function expand() {
        dispatch('selected', tree.payload);
        if (tree.props.expanded) {
            tree.removeChildren();
            tree.props.expanded = false;
            return;
        }
        await tree.getChildrenLazy();
        tree.props.expanded = true;
    }
    function hasChildren() {
        return $cabinets.some((c) => c.parent_id === tree.payload.id);
    }
</script>

<div>
    {#if tree.props.expanded}
        <a href="#/" on:click={expand}>- {tree.payload.label} </a>
        <ul>
            {#each tree.getChildren() as child}
                <li class="ml-3">
                    <svelte:self tree={child} on:selected></svelte:self>
                </li>
            {/each}
        </ul>
    {:else if hasChildren()}
        <a href="#/" on:click={expand}>+ {tree.payload.label} </a>
    {:else}
        <a href="#/" on:click={() => dispatch('selected', tree.payload)}
            >{tree.payload.label}</a>
    {/if}
</div>
