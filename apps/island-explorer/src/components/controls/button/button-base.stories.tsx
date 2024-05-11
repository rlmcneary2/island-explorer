import type { StoryObj, Meta } from "@storybook/react";
import { ButtonBase } from "./button-base";

const meta: Meta<typeof ButtonBase> = {
  component: ButtonBase,
  title: "ButtonBase"
};

export default meta;

export const Primary: StoryObj<typeof ButtonBase> = {
  args: { children: "I'm a button" }
};
