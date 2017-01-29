const helpers = require( "./helpers" );
const commonConfig = require( "./webpack.common.js" );

const webpack = require( "webpack" );
const webpackMerge = require( "webpack-merge" );
const webpackMergeDll = webpackMerge.strategy( { plugins: "replace" });

const AddAssetHtmlPlugin = require( "add-asset-html-webpack-plugin" );
const DllBundlesPlugin = require( "webpack-dll-bundles-plugin" ).DllBundlesPlugin;
const LoaderOptionsPlugin = webpack.LoaderOptionsPlugin;

const ENV = process.env.ENV = process.env.NODE_ENV = "development";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;
const HMR = helpers.hasProcessFlag( "hot" );
const METADATA = webpackMerge( commonConfig( { env: ENV }).metadata, {
    host: HOST,
    port: PORT,
    ENV: ENV,
    HMR: HMR,
});

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
            new webpack.DefinePlugin( {
                "ENV": JSON.stringify( METADATA.ENV ),
                "HMR": METADATA.HMR,
                "process.env": {
                    "ENV": JSON.stringify( METADATA.ENV ),
                    "NODE_ENV": JSON.stringify( METADATA.ENV ),
                    "HMR": METADATA.HMR,
                },
            }),
            new webpack.NamedModulesPlugin(),
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
                        "@angular/http",
                        "@angular/forms",
                        "@angular/router",
                        "@angularclass/hmr",
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
        devServer: {
            contentBase: helpers.root( "dist" ),
            port: METADATA.port,
            host: METADATA.host,
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000,
            },
        },
    });
    return ret;
};

module.exports = main;
