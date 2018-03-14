module.exports = {
  entry: './src/ui/app.js',
  mode: 'development',
  target: 'electron-renderer',
  output: {
    path: `${__dirname}/src/ui`,
    filename: 'renderer.js',
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
};
