module.exports = () => ({
    output: {
        filename: 'index.js',
        hashDigestLength: 8,
        publicPath: ''
    },
    optimization: {
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    devtool: 'cheap-module-eval-source-map'
});
