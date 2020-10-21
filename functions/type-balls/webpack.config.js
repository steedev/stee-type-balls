const path = require("path")

module.exports = {
    entry: {
        game: './src/App.ts'
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "[name].bundle.js"
    },
    watch: true,
    mode: "development",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
}