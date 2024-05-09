/* eslint-env node */
// eslint-disable-next-line import/no-extraneous-dependencies
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'standard',
    '@vue/prettier',
    '@vue/eslint-config-typescript',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'import/extensions': [
      'error',
      'always',
      {
        ts: 'never', // 禁止使用导入语句中的 '.ts' 扩展名
        tsx: 'never',
        js: 'never', // 如果你的项目中也有 JavaScript 文件，也禁止使用 '.js' 扩展名
        jsx: 'never'
      }
    ]
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@', './src'] // 将 @assets 别名映射到实际的路径
          // 添加其他别名映射
        ],
        extensions: ['.ts', '.js', '.vue'] // 如果你的项目中使用了 TypeScript、JavaScript 和 Vue 文件
      }
    }
  }
}
