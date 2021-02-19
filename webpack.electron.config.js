const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './index.tsx',
    target: 'electron-renderer',
    output: {
        filename: 'bundle.js',
        publicPath: './',
        path: path.resolve(__dirname, 'dist'),
    },
    context: path.resolve(__dirname, 'src'),
    node: {
        __dirname: false,
        __filename: false,
    },
    resolve: {
        modules: [path.resolve('./node_modules'), path.resolve(__dirname)],
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },

    module: {
        rules: [
            { test: /\.tsx?$/, use: ['awesome-typescript-loader'] },
            { enforce: 'pre', test: /\.js$/, use: ['source-map-loader'] },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            mimetype: 'application/font-woff',
                        },
                    },
                ],
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: ['file-loader'],
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: 'index.html',
        }),
    ],
}
