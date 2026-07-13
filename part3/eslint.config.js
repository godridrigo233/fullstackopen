import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // 1. Configuración recomendada base de ESLint
  js.configs.recommended,

  // 2. Ignorar la carpeta del build de React para que no la revise
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**']
  },

  // 3. Reglas personalizadas para tu servidor Node.js
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.node
      },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      'eqeqeq': 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0,
      'no-unused-vars': ['error', { argsIgnorePattern: 'next' }]
    },
  },
])