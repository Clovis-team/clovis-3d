const webpack = require('webpack');

module.exports = {
    // mode: 'development',
    // entry: 'src/index.js',
    output: {
        path: `${__dirname}/dist`,
        // filename: '[name].[chunkhash:8].js',
        filename: '[name].js',
    },
    plugins: [
        new webpack.ProvidePlugin({
            THREE: 'three/build/three.js',
        }),
    ],
};
