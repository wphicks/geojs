var path = require('path');
var webpack = require('webpack');
var exec = require('child_process').execSync;
var sha = '';
var loaders = require('./node_modules/vtk.js/Utilities/config/webpack.loaders.js');

if (!exec) {
  console.warn('Node 0.12 or greater is required for detecting the git hash.');
}

try {
  sha = exec('git rev-parse HEAD', {cwd: __dirname}).toString().trim();
} catch (e) {
  console.warn('Could not determine git hash.');
}

var define_plugin = new webpack.DefinePlugin({
  GEO_SHA: JSON.stringify(sha),
  GEO_VERSION: JSON.stringify(require('./package.json').version)
});

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    geo: './index.js',
    'geo.min': './index.js'
  },
  output: {
    path: path.join(__dirname, 'dist', 'built'),
    publicPath: 'dist/built',
    filename: '[name].js',
    library: 'geo',
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      jquery: 'jquery/dist/jquery',
      proj4: 'proj4/lib',
      vgl: 'vgl/vgl.js',
      d3: 'd3/d3.js',
      mousetrap: 'mousetrap/mousetrap.js'
    }
  },
  externals: {
    d3: 'd3'
  },
  plugins: [
    define_plugin,
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      comments: /@(license|copyright)/
    })
  ],
  module: {
    loaders: [{
      test: /vgl\.js$/,
      loader: 'expose?vgl!imports?mat4=gl-mat4,vec4=gl-vec4,vec3=gl-vec3,vec2=gl-vec2,$=jquery'
    }
    ].concat(loaders)
  },

  // These are plugins that we want to run in Karma as well
  exposed_plugins: [
    define_plugin
  ]
};
