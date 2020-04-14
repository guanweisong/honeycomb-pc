module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'warn',
    'no-underscore-dangle': 'off',
    'react/jsx-no-target-blank': 'off',
  },
}
