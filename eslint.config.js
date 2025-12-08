// @ts-check
import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import reactPlugin from "eslint-plugin-react"

export default [
	{ ignores: ["dist", "node_modules", "*.backup", "*.bak"] },
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
			"react/no-unescaped-entities": "warn",
			"@typescript-eslint/no-unused-vars": ["warn", { 
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_"
			}],
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/ban-ts-comment": "warn",
			"@typescript-eslint/no-require-imports": "warn",
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"no-empty": ["warn", { allowEmptyCatch: true }],
			"no-prototype-builtins": "warn",
			"no-case-declarations": "warn",
			"no-undef": "off", // TypeScript가 이미 체크함
			"react-hooks/exhaustive-deps": "off", // 플러그인이 없으면 비활성화
		},
		languageOptions: {
			globals: { 
				...globals.browser, 
				...globals.node,
				React: "readonly",
				JSX: "readonly",
				RequestInit: "readonly",
				HeadersInit: "readonly",
				NotificationPermission: "readonly",
			},
			parserOptions: { 
				ecmaVersion: 2023, 
				sourceType: "module",
				ecmaFeatures: {
					jsx: true
				}
			},
		},
	},
]
