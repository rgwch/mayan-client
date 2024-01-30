import type { Meta, StoryObj } from '@storybook/svelte';

import Dropdown from './Dropdown.svelte';
import StoryDecorator from './StoryDecorator.svelte';

const meta = {
  title: 'Widgets/Dropdown',
  component: Dropdown,
  argTypes: {
    title: { control: 'string' },
    selected: { control: 'any' },
    elements: { control: 'Array' },
    label: { control: 'function' },
    small: { control: 'boolean' },
    left: { control: 'boolean' }
  },
} satisfies Meta<Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const text: Story = {
  // decorators: [() => StoryDecorator],

  args: {
    title: 'Dropdown',
    selected: 'Dropdown',
    elements: ['Element1', 'Element2', 'Element3'],
    label: (e: string) => e,
    small: false,
    left: true
  }
}

export const symbol: Story = {
  args: {
    title: 'Dropdown',
    selected: 'Dropdown',
    elements: ['Element1', 'Element2', 'Element3'],
    label: (e: string) => e,
    small: true,
    left: true
  }
}
