import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  // Ignore generated / external files
  globalIgnores(['dist', 'build', 'node_modules']),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier, // MUST be last
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React 17+ JSX transform
      'react/react-in-jsx-scope': 'off',

      // Hooks correctness (non-negotiable)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Signal real problems, not noise
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],

      // Allow React Three Fiber properties
      'react/no-unknown-property': [
        'error',
        {
          ignore: [
            'args',
            'uniforms',
            'vertexShader',
            'fragmentShader',
            'attach',
          ],
        },
      ],

      // Allow comments in JSX
      'react/jsx-no-comment-textnodes': 'off',

      // Allow unused expressions (for GSAP animations, etc.)
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
]);
