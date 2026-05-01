import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: {
    tsconfigPath: 'tsconfig.json',
  },
  rules: {
    'no-console': 'warn',
    'ts/no-unsafe-assignment': 'off',
    'ts/no-unsafe-member-access': 'off',
    'ts/no-unsafe-return': 'off',
    'ts/strict-boolean-expressions': 'off',
    'node/prefer-global/process': 'off',
  },
})
