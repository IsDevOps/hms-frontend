import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginJs from '@eslint/js';
import pluginNext from '@next/eslint-plugin-next';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2021,
      sourceType: 'module',
    },
  },
  {
    ignores: [
      '.next/**',
      'public/**',
      '*.config.ts',
      '*.config.mjs',
      '*.config.cjs',
      '*.config.js',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    plugins: {
      '@next/next': pluginNext,
    },
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier,
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript', 'prettier'],

    rules: {
      ...pluginNext.configs.recommended.rules,
      'react/jsx-props-no-spreading': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      'require-jsdoc': 'off',
      'new-cap': ['error', { capIsNew: false }],
      camelcase: 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/promise-function-async': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-unneeded-ternary': 'off',
      'react/jsx-filename-extension': [
        'error',
        { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      ],
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      'consistent-return': 'off',
      'arrow-body-style': 'off',
      'react/jsx-fragments': 'off',
      'react/require-default-props': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'import/extensions': 'off',
      'no-nested-ternary': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      ' @typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      'import/no-cycle': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/prefer-default-export': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-constructed-context-values': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/array-type': 'off',
      'jsx-a11y/heading-has-content': 'off',
      'react/jsx-no-useless-fragment': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      'react/function-component-definition': [
        'off',
        {
          namedComponents: [
            'function-declaration',
            'function-expression',
            'arrow-function',
          ],
          unnamedComponents: ['function-expression', 'arrow-function'],
        },
      ],
    },
  }),
];

export default eslintConfig;
