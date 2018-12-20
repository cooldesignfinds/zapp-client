const CopyWebpackPlugin = require('copy-webpack-plugin');
const HandlebarsWebpackPlugin = require('handlebars-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

const config = {
  development: {
    baseHref: '/',
    outputPath: 'tmp',
    app: [
      `webpack-dev-server/client?http://${host}:${port}`,
      'babel-polyfill',
      './App.jsx'
    ],
    api: {
      host: 'http://api.alpha.zappjs.com:3001'
    },
    auth: {
      host: 'http://gateway.alpha.zappjs.com:3005'
    },
    docs: {
      host: 'http://help.alpha.zappjs.com:3002'
    },
    editor: {
      host: 'http://editor.alpha.zappjs.com:3000'
    },
    github: {
      clientId: '69fa56009fef5b2cebce',
      redirectUri: 'http://github.alpha.zappjs.com:3000/',
      scope: 'user:email,public_repo'
    },
    web: {
      host: 'http://alpha.zappjs.com:3006'
    }
  },
  production: {
    baseHref: '/',
    outputPath: 'dist',
    app: [
      'babel-polyfill',
      './App.jsx'
    ],
    api: {
      host: 'https://api.zappjs.com'
    },
    auth: {
      host: 'https://gateway.zappjs.com'
    },
    docs: {
      host: 'https://help.zappjs.com'
    },
    editor: {
      host: 'https://editor.zappjs.com'
    },
    github: {
      clientId: '0934260a70e918762216',
      redirectUri: 'https://github.zappjs.com/',
      scope: 'user:email,public_repo'
    },
    web: {
      host: 'https://zappjs.com'
    }
  }
};
const { api, app, auth, baseHref, docs, editor, github, outputPath, web } = config[env];

const plugins = [
  new webpack.DefinePlugin({
    CONFIG: JSON.stringify({
      api,
      auth,
      baseHref,
      docs,
      editor,
      github,
      web
    })
  }),
  new CopyWebpackPlugin([
    { from: 'images', to: 'images' }
  ]),
  new HandlebarsWebpackPlugin({
    entry: path.join(process.cwd(), 'src', '*.hbs'),
    output: path.join(process.cwd(), outputPath, '[name].html'),
    data: {
      baseHref
    }
  })
];
const optimization = {};
if (env === 'production') {
  plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  );
  optimization.minimize = true;
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  );
}

module.exports = {
  mode: env,
  optimization,
  context: path.join(__dirname, 'src'),
  entry: {
    app
  },
  devServer: {
    host,
    port,
    contentBase: `./${outputPath}`,
    disableHostCheck: true,
    publicPath: baseHref,
    hot: true,
    historyApiFallback: {
      index: 'index.html',
      disableDotRule: true
    },
    stats: {
      colors: true
    }
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.(js|jsx|es6)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          query: {
            plugins: [
              'jsx-control-statements'
            ],
            presets: [
              'es2015',
              'react',
              'stage-0'
            ]
          }
        }
      },
      {
        test: /\.css/,
        use: {
          loader: 'style-loader'
        }
      },
      {
        test: /\.css/,
        use: {
          loader: 'css-loader'
        }
      },
      {
        test: /\.sass$/,
        use: {
          loader: 'style-loader'
        }
      },
      {
        test: /\.sass$/,
        use: {
          loader: 'css-loader',
          query: {
            modules: true,
            localIdentName: '[name]__[local]__[hash:base64:5]',
            url: false
          }
        }
      },
      {
        test: /\.sass$/,
        use: {
          loader: 'sass-loader'
        }
      }
    ]
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, outputPath)
  },
  node: {
    fs: 'empty',
    net: 'empty'
  },
  target: 'web',
  resolve: {
    extensions: [
      '.js',
      '.jsx'
    ]
  }
};
