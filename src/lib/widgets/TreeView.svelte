<script lang="ts">
  import Fa from 'svelte-fa';
  import {
    faCaretRight,
    faCaretDown,
    faGripVertical,
  } from '@fortawesome/free-solid-svg-icons';
  import type { Tree, ITreeListener } from '../tree';
  // import { v4 as uuid } from 'uuid';
  import { createEventDispatcher } from 'svelte';
  const DND_TYPE = 'application/x-webelexis-treeview';

  export let trees: Array<Tree<any>>;
  export let labelProvider: (x: Tree<any>) => string;
  const dispatch = createEventDispatcher();
  function handleDragStart(event: any, node: Tree<any>) {
    event.dataTransfer.effectAllowed = 'move';
    // const id = uuid();
    const id = '1';
    // global.volatile[id] = node;
    event.dataTransfer.setData(DND_TYPE, id);
    event.target.style.opacity = '0.4';
    event.target['data-id'] = id;
  }
  function handleDragEnd(event: any) {
    event.target.style.opacity = '1.0';

    const id = event.target['data-id'];
    // console.log("dropped " + id);

    /* const tree: Tree<any> = global.volatile[id];
    if (tree) {
      tree.remove;
      const index = trees.findIndex((t) => t.payload == tree.payload);
      if (index != -1) {
        trees.splice(index, 1);
        trees = trees;
      }
      delete global.volatile[id];
    }
    */
  }
  function dropped(event: any) {
    const id = event.dataTransfer.getData(DND_TYPE);
    // console.log(id);
    /*
    const tree = global.volatile[id];
    if (!trees) {
      trees = new Array<Tree<any>>();
    }
    trees.push(tree);
    trees = trees;
    */
  }
  function dragenter(event: any) {
    // event.target.style.backgroundColor="red"
  }
  function dragleave(event: any) {}
  function dragover(event: any) {
    event.dataTransfer.effectAllowed = 'move';
  }
</script>

<template>
  <div
    class="scrollpanel h-max w-max overflow-y-auto overflow-x-hidden bg-blue-400"
    role="tree"
    tabindex="-1"
    on:drop|preventDefault|stopPropagation={dropped}
    on:dragenter|preventDefault={dragenter}
    on:dragleave|preventDefault={dragleave}
    on:dragover|preventDefault={dragover}>
    {#each trees as e, index}
      <div
        tabindex={index}
        class="px-2 my-0"
        draggable="true"
        on:dragstart={(event) => handleDragStart(event, e)}
        on:dragend={handleDragEnd}
        role="treeitem"
        aria-expanded={e.props.open ? 'true' : 'false'}
        aria-selected={false}>
        <!-- Fa class="mx-2 cursor-move" icon="{faGripVertical}" / -->
        <span
          on:click={() => {
            e.props.open = !e.props.open;
          }}
          class="cursor-pointer">
          <Fa
            icon={e.props.open ? faCaretDown : faCaretRight}
            class="inline" /></span>
        <span class="mx-2 my-0" on:click={() => dispatch('selected', e)}>
          {labelProvider(e)}</span>
        {#if e.props.open}
          <div class="relative left-2">
            <svelte:self trees={e.getChildren()} {labelProvider} on:selected />
          </div>
        {/if}
      </div>
    {/each}
  </div>
</template>
