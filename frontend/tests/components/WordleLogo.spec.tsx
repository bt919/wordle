import { test, expect } from "vitest";
import { render } from "vitest-browser-react";

import { WordleLogo } from "../../src/components/WordleLogo.tsx"
import { Wrapper } from "./setup/wrapper.tsx"


test("renders wordle logo component", async () => {
    const wrapper = Wrapper(<WordleLogo theme="dark" />);
    const { getByText } = render(wrapper);

    await expect.element(getByText("Wordle")).toBeInTheDocument();
});
