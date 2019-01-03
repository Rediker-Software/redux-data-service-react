import { addDecorator, configure } from "@storybook/react";
import { withInfo } from "@storybook/addon-info";
import backgrounds from "@storybook/addon-backgrounds";
import centered from "@storybook/addon-centered";

import "./style.css";

function loadStories() {
  const req = require.context("../../src/", true, /story\.tsx?$/)
  req.keys().forEach(req)
}

addDecorator((story, context) => withInfo()(story)(context));
addDecorator(backgrounds([
  { name: "Slate", value: "#f4f6f8", "default": true },
  { name: "White", value: "white" },
]));
addDecorator(centered);

configure(loadStories, module);
