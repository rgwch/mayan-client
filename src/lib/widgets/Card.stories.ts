import type { Meta, StoryObj } from '@storybook/svelte';
import Card from './Card.svelte';

const meta = {  
    title: 'Widgets/Card',
    component: Card,
    argTypes: {
        heading: { control: 'text' }
      
    },
} satisfies Meta<Card>;

export default meta;
type Story=StoryObj<typeof meta>;

export const Default:Story={
    args:{
        heading: 'Card'
    }
}
