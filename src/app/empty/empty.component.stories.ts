import type { Meta, StoryObj } from '@storybook/angular';
import { EmptyComponent } from './empty.component';

const meta: Meta<EmptyComponent> = {
  component: EmptyComponent,
  title: 'EmptyComponent',
};
export default meta;
type Story = StoryObj<EmptyComponent>;

export const Primary: Story = {
  args: {},
};
