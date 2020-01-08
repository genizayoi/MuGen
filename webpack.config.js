const CopyWebpackPlugin = require('copy-webpack-plugin');
const {dirname} = require('path');
module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.js'],
    modules: ['node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /timidity/,
        use: 'transform-loader?brfs',
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: `${dirname(require.resolve('timidity'))}/**/*.wasm`,
        transformPath: (x) => x.replace('node_modules/timidity/', ''),
      },
      {
        from: `${dirname(require.resolve('freepats'))}/**/*.{pat,cfg}`,
        transformPath: (x) => x.replace('node_modules/freepats/', ''),
      },
      'src/index.html',
      'score/*.yaml',
    ]),
  ],
  devtool: 'sourcemap',
};
