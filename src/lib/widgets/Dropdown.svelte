<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { _ } from 'svelte-i18n';
    const dispatch = createEventDispatcher();
    export let title: string;
    let originalTitle = title;
    export let selected: any = null;
    export let elements: Array<any>;
    export let label: (x: any) => string = (elem) => elem.tostring();
    export let small: boolean = false;
    export let left = true;
    let open = false;
</script>

<div class="relative inline-block text-left">
    {#if small}
        <div>
            <button
                type="button"
                on:click={() => {
                    open = !open;
                }}
                class="flex items-center rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true">
                <span class="sr-only">Open options</span>
                <svg
                    class="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                        d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                </svg>
            </button>
        </div>
    {:else}
        <div>
            <button
                type="button"
                on:click={() => {
                    open = !open;
                }}
                class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                id="menu-button"
                aria-expanded="true"
                aria-haspopup="true">
                {title}
                <svg
                    class="-mr-1 h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true">
                    <path
                        fill-rule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                        clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    {/if}
    <!--
      Dropdown menu, show/hide based on menu state.
  
      Entering: "transition ease-out duration-100"
        From: "transform opacity-0 scale-95"
        To: "transform opacity-100 scale-100"
      Leaving: "transition ease-in duration-75"
        From: "transform opacity-100 scale-100"
        To: "transform opacity-0 scale-95"
    -->
    {#if open}
        <div 
            class="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-60"
            class:left-0={left}
            class:right-0={!left}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabindex="-1">
            <div class="py-1" role="none">
                <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                {#each elements as item}
                    <a
                        href="#/"
                        on:click={() => {
                            title = label(item);
                            open = false;
                            dispatch('selected', item);
                            selected = item;
                        }}
                        class="text-gray-700 block px-4 py-2 text-sm"
                        role="menuitem"
                        tabindex="-1">
                        {label(item)}</a>
                {/each}
                <a
                    href="#/"
                    on:click={() => {
                        title = originalTitle;
                        selected = null;
                        open = false;
                        dispatch('selected', null);
                    }}
                    class="text-gray-700 block px-4 py-2 text-sm"
                    role="menuitem"
                    tabindex="-1">
                    {$_('none')}</a>
            </div>
        </div>
    {/if}
</div>
