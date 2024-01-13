<script lang="ts">
    export let heading: string;
</script>

<div class="bg-white shadow sm:rounded-lg border border-blue-200">
    <div class="m-1 px-2">
        <h3 class="text-sm font-semibold leading-6 text-gray-900">
            {heading}
        </h3>
        <slot />
    </div>
</div>
