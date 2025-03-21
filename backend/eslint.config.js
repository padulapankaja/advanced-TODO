// eslint.config.js (CommonJS version)
const js = require("@eslint/js");
const ts = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const prettier = require("eslint-plugin-prettier");
module.exports = [
  js.configs.recommended,
  {
    ignores: [
      "dist/**",        
      "src/__tests__/**", 
      "node_modules/**", 
      "eslint.config.js",
      "jest.config.js",       
    ],
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals:{
        console: "readonly",
        process: "readonly",
      }
    },
    
    plugins: {
      "@typescript-eslint": ts,
      prettier,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-non-null-assertion": "error",
      "no-process-exit": "warn",
    },
  },
];
