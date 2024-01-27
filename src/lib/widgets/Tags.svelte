<script lang="ts">
    import { onMount, createEventDispatcher } from 'svelte';
    import Dropdown from './Dropdown.svelte';
    import { mayan } from '../model/mayan';
    import Colorpicker from 'svelte-awesome-color-picker';
    import { _ } from 'svelte-i18n';
    import { tags } from '../model/store';
    import Fa from 'svelte-fa';
    import { faSquarePlus } from '@fortawesome/free-regular-svg-icons';
    import { faCheck } from '@fortawesome/free-solid-svg-icons';
    const dispatch = createEventDispatcher();
    let openCreateTag = false;
    let color: string = '#aa0000';
    let tagname: string = '';
    async function addTag() {
        await mayan.createTag(tagname, color);
        tags.set(await mayan.listTags());
        openCreateTag = false;
    }
</script>

<div class="flex flex-row items-center">
    {#if openCreateTag}
        <div class="flex-flex-col">
            <input
                type="text"
                class="w-32"
                placeholder={$_('tag_name')}
                bind:value={tagname} />

            <div class="mt-2 flex flex-row items-baseline">
                <Colorpicker
                    bind:hex={color}
                    label={$_('color')}
                    isDialog={true} />
                <button
                    class="ml-6 mt-2 border border-blue-200 p-1 hover:bg-blue-200"
                    class:hidden={!tagname}
                    on:click={addTag}
                    ><Fa
                        icon={faCheck}
                        translateY={0.2}
                        color="#5ff900"
                        scale={1.2}></Fa
                    ></button>
            </div>
        </div>
    {:else}
        <div class="flex-1">
            <Dropdown
                title={$_('tags')}
                elements={$tags}
                label={(t) => t.label}
                on:selected={(t) =>
                    dispatch('selected', {
                        id: -4,
                        full_path: t.detail.label,
                        parent_id: t.detail.id,
                    })} />
        </div>
    {/if}
    <div class="grow"></div>
    <div>
        <button
            on:click={() => {
                openCreateTag = !openCreateTag;
            }}><Fa icon={faSquarePlus} scale="1.2"></Fa></button>
    </div>
</div>
