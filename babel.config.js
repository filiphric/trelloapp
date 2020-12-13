module.exports = {
  'presets': [
    [
      '@babel/preset-env'
    ]
  ],
  plugins: [
    ['babel-plugin-istanbul', {
      extension: ['.js']
    }]
  ]
};