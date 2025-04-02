// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'expo',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier'],
  ignorePatterns: ['/dist/*', '/node_modules/*'],
  rules: {
    'prettier/prettier': 'error',
    'no-duplicate-imports': 'error',
  },
  root: true,
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
};
