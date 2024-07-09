module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'babel-plugin-root-import',
        {
          rootPathSuffix: './src/',
          rootPathPrefix: '@/',
        },
      ],
    ],
  };
};
