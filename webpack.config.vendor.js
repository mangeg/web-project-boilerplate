let path = require( "path" );
let webpack = require( "webpack" );
let ExtractTextPlugin = require( "extract-text-webpack-plugin" );
let extractCSS = new ExtractTextPlugin( "vendor.css" );

let vendor = {
    resolve: {
        extensions: [ ".js" ]
    },
    module: {
        loaders: [
            { test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/, loader: "url-loader?limit=100000" },
            { test: /\.css(\?|$)/, loader: extractCSS.extract( [ "css" ] ) }
        ]
    },
    entry: {
        vendor: [
            "@angular/common",
            "@angular/core",
            "@angular/compiler",
            "@angular/platform-browser",
            "@angular/platform-browser-dynamic",
            "zone.js",
            "es6-shim",
            "es6-promise",
            "rxjs"
        ]
    },
    output: {
        path: path.join( __dirname, "dist" ),
        filename: "[name].js",
        library: "[name]_[hash]",
    },
    plugins: [
        extractCSS,
        new webpack.ProvidePlugin( { $: "jquery", jQuery: "jquery" }),
        new webpack.DllPlugin( {
            path: path.join( __dirname, "dist", "[name]-manifest.json" ),
            name: "[name]_[hash]"
        }),
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
            __dirname
        ),
    ]
}

module.exports = [ vendor ];