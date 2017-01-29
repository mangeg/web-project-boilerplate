const helpers = require( "./helpers" );
const commonConfig = require( "./webpack.common.js" );

const webpack = require( "webpack" );
const webpackMerge = require( "webpack-merge" );
const webpackMergeDll = webpackMerge.strategy( { plugins: "replace" });

const AddAssetHtmlPlugin = require( "add-asset-html-webpack-plugin" );
const DllBundlesPlugin = require( "webpack-dll-bundles-plugin" ).DllBundlesPlugin;
const LoaderOptionsPlugin = webpack.LoaderOptionsPlugin;

let isDevBuild = true;

const ENV = process.env.ENV = process.env.NODE_ENV = "development";

let main = function ( options ) {
    let ret = webpackMerge( commonConfig( { env: ENV }), {

        devtool: "source-map-inline",

        output: {
            path: helpers.root( "dist" ),
            filename: "[name].bundle.js",
            sourceMapFilename: "[file].map",
            chunkFilename: "[id].chunk.js",
            library: "ac_[name]",
            libraryTarget: "var",
        },
        module: {
            rules: [
                {
                    test: /\.(jpg|png|gif)$/,
                    use: "file-loader",
                },
                {
                    test: /\.css$/,
                    use: [ "style-loader", "css-loader" ],
                    include: [ helpers.root( "src", "styles" ) ],
                },
                {
                    test: /\.scss$/,
                    use: [ "style-loader", "css-loader", "sass-loader" ],
                    include: [ helpers.root( "src", "styles" ) ],
                },
            ],
        },
        plugins: [
            new DllBundlesPlugin( {
                bundles: {
                    polyfills: [
                        "core-js",
                        {
                            name: "zone.js",
                            path: "zone.js/dist/zone.js",
                        },
                        {
                            name: "zone.js",
                            path: "zone.js/dist/long-stack-trace-zone.js",
                        },
                    ],
                    vendor: [
                        "@angular/platform-browser",
                        "@angular/platform-browser-dynamic",
                        "@angular/core",
                        "@angular/common",
                        "rxjs",
                    ],
                },
                dllDir: helpers.root( "dll" ),
                webpackConfig: webpackMergeDll( commonConfig( { env: ENV }), {
                    devtool: "cheap-module-source-map",
                    plugins: [],
                }),
            }),
            new LoaderOptionsPlugin( {
                debug: true,
                options: {
                },
            }),
            new AddAssetHtmlPlugin( [
                { filepath: helpers.root( `dll/${DllBundlesPlugin.resolveFile( "polyfills" )}` ) },
                { filepath: helpers.root( `dll/${DllBundlesPlugin.resolveFile( "vendor" )}` ) },
            ] ),
        ],
    });
    return ret;
};


module.exports = main;
