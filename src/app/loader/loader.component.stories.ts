import type { Meta, StoryObj } from '@storybook/angular';
import { LoaderComponent } from './loader.component';

const meta: Meta<LoaderComponent> = {
  component: LoaderComponent,
  title: 'LoaderComponent',
};
export default meta;
type Story = StoryObj<LoaderComponent>;

export const Primary: Story = {
  args: {},
};
