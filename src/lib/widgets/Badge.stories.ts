import type { Meta, StoryObj } from '@storybook/svelte';

import Badge from './Badge.svelte';

const meta = {
    title: 'Widgets/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        backgroundcolor: { control: 'color' },
        textcolor: { control: 'color'},
        text: { control: 'text'}
    },
    } satisfies Meta<Badge>;

 export default meta;
 type Story = StoryObj<typeof meta>;
 
 export const green:Story={
        args:{
            backgroundcolor: 'green',
            textcolor: 'white',
            text: 'green'
        }
 }

 export const red:Story={
    args:{
        backgroundcolor: 'red',
        textcolor: 'white',
        text: 'red'
    }
}