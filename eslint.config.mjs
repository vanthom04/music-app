import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/generated/**"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-console": ["warn", { allow: ["info", "warn", "error"] }],
      // "indent": ["warn", 2],
      "keyword-spacing": 1,
      "arrow-spacing": 1,
      "comma-spacing": 1,
      "semi": [1, "never"],
      "no-multi-spaces": 1,
      "no-trailing-spaces": 1,
      "no-useless-catch": "off",
      "array-bracket-spacing": 1,
      "no-multiple-empty-lines": 1,
      "quotes": ["warn", "double"],
      "object-curly-spacing": [1, "always"],
      "space-before-blocks": ["warn", "always"],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { vars: "all" }],
      "react-hooks/exhaustive-deps": "warn",
      "import/no-anonymous-default-export": "off",
      "@next/next/no-img-element": "off"
    }
  }
]

export default eslintConfig
