import type { Preview } from "@storybook/svelte";
import StoryDecorator from "./StoryDecorator.svelte";
import "../src/app.css";
const preview: Preview = {
  decorators: [() => StoryDecorator],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
