import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ESLint configuration for clean code formatting and linting
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),
  {
    // Ignore build and dependency directories
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
  {
    // Apply to all JavaScript and TypeScript files
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        tsconfigRoot: __dirname,
      },
    },
    rules: {
      // Custom rules can be added here
      'prettier/prettier': 'error',
      'react/jsx-boolean-value': ['error', 'always'],
      'react/self-closing-comp': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
  },
];

export default eslintConfig;
