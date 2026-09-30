import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^(_|ignore)',
        },
      ],
    },
  },
  {
    // Écrans de l’administration Payload : liens et formulaires vers l’admin et les routes API, navigation classique voulue.
    files: ['src/components/admin/**'],
    rules: { '@next/next/no-html-link-for-pages': 'off' },
  },
  {
    ignores: ['.next/', 'next-env.d.ts', 'src/app/(payload)/**', 'src/payload-types.ts', 'src/migrations/**', 'src/payload-generated-schema.ts'],
  },
]

export default eslintConfig
