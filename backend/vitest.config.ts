import { defineConfig, configDefaults } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
	test: {
		exclude: [...configDefaults.exclude, "tests/__mocks__/**/*"],
		include: ["tests/**/*"],
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
});
