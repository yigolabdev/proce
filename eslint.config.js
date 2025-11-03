// @ts-check
import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import reactPlugin from "eslint-plugin-react"
import reactHooks from "eslint-plugin-react-hooks"

export default [
	{ ignores: ["dist", "node_modules"] },
	{
		files: ["**/*.{ts,tsx}"]
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	reactPlugin.configs.flat.recommended,
	{
		settings: { react: { version: "detect" } },
		rules: {
			"react/react-in-jsx-scope": "off",
			"react/prop-types": "off",
			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
		},
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: { ecmaVersion: 2023, sourceType: "module" },
		},
	},
	{
		rules: {
			"prettier/prettier": ["error", {}]
		},
		plugins: { prettier: { rules: {} } },
	},
]
