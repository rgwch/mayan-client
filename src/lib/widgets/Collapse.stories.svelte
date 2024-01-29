<script context="module" lang="ts">
import Collapse from './Collapse.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export const meta = {
    title: 'Widgets/Collapse',
    component: Collapse,
    argTypes: {
        open: { control: 'boolean' },
        title: { control: 'text' },
        locked: { control: 'boolean' }

    },
} 

</script>
<script lan="ts">
    import { Story, Template } from '@storybook/addon-svelte-csf';

</script>

<Template let:args>
    <Collapse {...args}>
        <div slot="header">Header</div>
        <div slot="body">Body</div>
    </Collapse>
</Template>

<Story name="normal" args={{title:"Click me"}}>
   
</Story>
<Story name="open" args={{ open: true }} />