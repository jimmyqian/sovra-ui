import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  // Base JavaScript recommendations
  js.configs.recommended,

  // Vue 3 recommended rules
  ...vue.configs['flat/recommended'],

  // Configuration for all files
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly'
      }
    },
    plugins: {
      prettier
    },
    rules: {
      // Prettier integration
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          semi: false,
          trailingComma: 'none',
          tabWidth: 2,
          printWidth: 80,
          endOfLine: 'lf'
        }
      ],

      // General best practices
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-else-return': 'error',
      'no-useless-return': 'error',
      'array-callback-return': 'error',
      'consistent-return': 'error',

      // Import/Export
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'off'
    }
  },

  // TypeScript-specific configuration
  {
    files: ['**/*.{ts,tsx,vue}'],
    ignores: ['vite.config.ts', '*.config.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: './tsconfig.json'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier
    },
    rules: {
      // Disable base rules that are covered by TypeScript
      'no-unused-vars': 'off',
      'no-undef': 'off',

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false
        }
      ]
    }
  },

  // Vue-specific configuration
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 2020,
        sourceType: 'module',
        extraFileExtensions: ['.vue']
      }
    },
    plugins: {
      vue,
      '@typescript-eslint': typescript,
      prettier
    },
    rules: {
      // Disable TypeScript rules that require type information
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',

      // Vue 3 specific rules
      'vue/multi-word-component-names': 'warn',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/prop-name-casing': ['error', 'camelCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],

      // Vue best practices
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'warn',
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/no-boolean-default': 'error',
      'vue/no-duplicate-attributes': 'error',
      'vue/order-in-components': 'error',

      // Vue 3 Composition API
      'vue/prefer-separate-static-class': 'error',

      // Template formatting
      'vue/html-indent': ['error', 2],
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'always'
        }
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'never',
            normal: 'never',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 3,
          multiline: 1
        }
      ]
    }
  },

  // Apply Prettier config to disable conflicting rules
  prettierConfig,

  // Ignore files
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '*.min.js',
      'coverage/',
      '.vscode/',
      '.idea/',
      '*.d.ts',
      'vite.config.ts.timestamp-*',
      'CLAUDE.md'
    ]
  }
]
