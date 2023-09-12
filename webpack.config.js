const path = require("path");
const HtmlebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode : "production",
    entry :path.resolve(__dirname,"src/script.js"),
    output:{
        path: path.resolve(__dirname,"dist"),
        filename:"bundle.js"
    },
    module: {
        rules:[
            {
                test:/\.css$/,
                use:[
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ]
            }
        ]
    },
    plugins: [
        new HtmlebpackPlugin({
            title:"To Do List",
            filename:"index.html",
            template: "src/home.html",
        })
    ]
};