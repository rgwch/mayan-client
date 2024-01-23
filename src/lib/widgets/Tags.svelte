<script lang="ts">
    import { onMount, createEventDispatcher } from "svelte";
    import Dropdown from "./Dropdown.svelte";
    import Colorpicker from "svelte-awesome-color-picker";
    import { _ } from "svelte-i18n";
    import { tags } from "../model/store";
    import Fa from "svelte-fa";
    import { faSquarePlus } from "@fortawesome/free-regular-svg-icons";
    import { faCheck } from "@fortawesome/free-solid-svg-icons";
    const dispatch = createEventDispatcher();
    let createTag = false;
    let color: string = "#000000";
    let tagname: string = "";
</script>

<div class="flex flex-row items-center">
    {#if createTag}
        <div class="flex-flex-col">
            <input
                type="text"
                class="w-32"
                placeholder={$_("tag_name")}
                bind:value={tagname} />

            <div class="mt-2">
                <Colorpicker
                    bind:hex={color}
                    label={$_("color")}
                    isDialog={true} />
                <button class="pt-2 ml-2"><Fa icon={faCheck}></Fa></button>
            </div>
        </div>
    {:else}
        <Dropdown
            title={$_("tags")}
            elements={$tags}
            label={(t) => t.label}
            on:selected={(t) =>
                dispatch("selected", {
                    id: -4,
                    full_path: t.detail.label,
                    parent_id: t.detail.id,
                })} />
    {/if}
    <span class="ml-4 pl-2"
        ><button
            on:click={() => {
                createTag = !createTag;
            }}><Fa icon={faSquarePlus} scale="1.2"></Fa></button>
    </span>
</div>
