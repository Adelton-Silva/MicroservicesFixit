// .eslintrc.js
module.exports = {
    parser: '@babel/eslint-parser',
    extends: [
      'react-app',
      'react-app/jest',
      'plugin:react/recommended',
    ],
    plugins: [
      'react',
    ],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
      requireConfigFile: false,
      babelOptions: {
        presets: ['@babel/preset-react'],
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    env: {
      browser: true,
      node: true,
      es2020: true,
    },
  };