// プラグインを利用するためにwebpackを読み込んでおく
const webpack = require('webpack');

// optimization.minimizerを上書きするために必要なプラグイン
const TerserPlugin = require('terser-webpack-plugin');

// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');

module.exports = (env, argv) => {

  // argv.modeにはwebpackを実行したmodeが格納されている
  // 例えば webpack --mode development と実行すれば
  // argv.mode には 'development' が格納されている
  // そのためdevelopmentモードで実行したかどうかを判定できる
  const IS_DEVELOPMENT = argv.mode === 'development';

  return {
    // モード値を production に設定すると最適化された状態で、
    // development に設定するとソースマップ有効でJSファイルが出力される
    mode: argv.mode,

    // メインとなるJavaScriptファイル（エントリーポイント）
    entry: ['@babel/polyfill', './src/js/main.js'],

    // ファイルの出力設定
    output: {
      //  出力ファイルのディレクトリ名
      path: path.join(__dirname, 'public/js'),
      // 出力ファイル名
      filename: "bundle.js"
    },
    // ローダーの設定
    module: {
      rules: [
        {
          test: /\.css$/,
          loaders:['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          loaders: ['style-loader', 'css-loader', 'sass-loader']
        },
        {
          // ローダーの処理対象ファイル
          test: /\.js$/,
          // ローダーの処理対象から外すディレクトリ
          exclude: /node_modules/,
          use: [
            {
              // 利用するローダー
              loader: 'babel-loader',
              // ローダーのオプション
              // 今回はbabel-loaderを利用しているため
              // babelのオプションを指定しているという認識で問題ない
              options: {
                presets: [['@babel/preset-env', { modules: false }]]
              }
            }
          ]
        },
        {
          // enforce: 'pre'を指定することによって
          // enforce: 'pre'がついていないローダーより早く処理が実行される
          // 今回はbabel-loaderで変換する前にコードを検証したいため、指定が必要
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader'
        }
      ]
    },

    // developmentモードで有効になるdevtool: 'eval'を上書き
    // developmentモードでビルドした時だけソースマップを出力する
    devtool: IS_DEVELOPMENT ? 'source-map' : 'none',
    // productionモードで有効になるoptimization.minimizerを上書きする
    optimization: {
      // developmentモードでビルドした場合
      // minimizer: [] となるため、consoleは残されたファイルが出力される
      // puroductionモードでビルドした場合
      // minimizer: [ new TerserPlugin({... となるため、consoleを削除したファイルが出力される
      minimizer: IS_DEVELOPMENT
        ? []
        : [
            new TerserPlugin({
              terserOptions: {
                compress: { drop_console: true }
              }
            })
          ]
    }
  }

}