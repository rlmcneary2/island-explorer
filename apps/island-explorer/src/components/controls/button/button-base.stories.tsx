import { Story, Meta } from "@storybook/react";
import { ButtonBase, Props } from "./button-base";

export default {
  component: ButtonBase,
  title: "ButtonBase"
} as Meta;

const Template: Story<Props> = args => <ButtonBase {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: "I'm a button"
};
