import type { Meta, StoryObj } from '@storybook/svelte';
import Dial from './Dial.svelte';

const meta = {  
    title: 'Widgets/Dial',
    component: Dial,
    argTypes: {
        current: { control: 'number' },
        hasNext: { control: 'boolean' },
        hasPrev: { control: 'boolean' },
      
    },
} satisfies Meta<Dial>;

export default meta;
type Story=StoryObj<typeof meta>;

export const Default:Story={
    args:{
        current: 5,
        hasNext: true,
        hasPrev: true
    }
}
