module.exports = {
  extends: [
    'universe/native',
    'universe/shared/typescript-analysis',
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
  rules: {
    'prettier/prettier': 'warn',
    'import/order': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
}; 