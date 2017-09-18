const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PLUGINS = [
    new HtmlWebpackPlugin({
        template: 'example/index.html',
    }),
];

const BABEL_INCLUDE = [/src/, /example/];

const RULES = [
    {
        test: /\.jsx?/,
        include: BABEL_INCLUDE,
        enforce: 'pre',
        loader: 'babel-loader',
    },
    {
        test: /\.(svg|png)$/,
        use: {
            loader: 'url-loader',
            options: { noquotes: true },
        },
    },
    { test: /\.less$/, loader: 'ignore-loader' },
];

const LOADERS = [
    {
        test: /\.jsx?$/,
        include: BABEL_INCLUDE,
        loader: 'babel-loader',
        query: {
            plugins: [
                'react-html-attrs',
                'transform-decorators-legacy',
                'transform-class-properties',
            ],
        },
    },
];

module.exports = function(env) {
    const dev = env && env.dev;
    return {
        context: __dirname,
        devtool: dev ? 'source-map' : false,
        entry: ['whatwg-fetch', './example/example.js'],
        module: {
            rules: RULES,
            loaders: LOADERS,
        },
        resolve: {
            alias: {
                '~config': path.resolve(__dirname, './example/config'),
            },
            extensions: ['.js', '.jsx', '.json'],
        },
        output: {
            path: path.resolve(__dirname, 'example/build'),
            filename: 'bundle.js',
            publicPath: '/aktivitetsplanfelles/',
        },
        devServer: {
            contentBase: path.resolve(__dirname, 'example'),
            historyApiFallback: {
                index: '/aktivitetsplanfelles/',
            },
        },
        plugins: PLUGINS,
    };
};
