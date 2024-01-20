<!-- Search box to filter documents -->
<script lang="ts">
    import { _ } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';
    import Fa from 'svelte-fa';
    import { faSearch } from '@fortawesome/free-solid-svg-icons';
    const dispatch = createEventDispatcher();
    let text = '';
    function doSearch() {
        dispatch('search', text);
        text = '';
    }
</script>

<div>
    <div class="mt-2 flex rounded-md shadow-sm">
        <div class="relative flex flex-grow items-stretch focus-within:z-10">
            <input
                type="text"
                name="filter"
                id="filter"
                bind:value={text}
                on:keypress={(e) => {
                    if (e.key === 'Enter') {
                        doSearch();
                    }
                }}
                class="block rounded-none rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm w-full md:w-32"
                placeholder={$_('search')} />
        </div>
        <button
            type="button"
            on:click={doSearch}
            class="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-blue-300">
            <Fa icon={faSearch} />
        </button>
    </div>
</div>
