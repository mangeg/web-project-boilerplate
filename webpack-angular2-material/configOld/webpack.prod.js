const helpers = require( "./helpers" );

const webpack = require( "webpack" );
const webpackMerge = require( "webpack-merge" );
const commonConfig = require( "./webpack.common.js" );

const ExtractTextPlugin = require( "extract-text-webpack-plugin" );
const OptimizeJsPlugin = require( "optimize-js-plugin" );

const ENV = process.env.NODE_ENV = process.env.ENV = "production";
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8080;
const METADATA = webpackMerge( commonConfig( {
    env: ENV,
}).metadata, {
        host: HOST,
        port: PORT,
        ENV: ENV,
        HMR: false,
    });

module.exports = function ( options ) {
    let ret = webpackMerge( commonConfig( options ), {
        devtool: "source-map",
        output: {
            path: helpers.root( "dist" ),
            filename: "[name].[chunkhash].bundle.js",
            sourceMapFilename: "[name].[chunkhash].bundle.map",
            chunkFilename: "[id].[chunkhash].chunk.js",
        },
        module: {

            rules: [
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract( {
                        fallbackLoader: "style-loader",
                        loader: "css-loader",
                    }),
                    include: [ helpers.root( "src", "styles" ) ],
                },
                {
                    test: /\.scss$/,
                    loader: ExtractTextPlugin.extract( {
                        fallbackLoader: "style-loader",
                        loader: "css-loader!sass-loader",
                    }),
                    include: [ helpers.root( "src", "styles" ) ],
                },

            ],

        },
        plugins: [
            new OptimizeJsPlugin( {
                sourceMap: false,
            }),
            new ExtractTextPlugin( "[name].[contenthash].css" ),
            new webpack.DefinePlugin( {
                "ENV": JSON.stringify( METADATA.ENV ),
                "HMR": METADATA.HMR,
                "process.env": {
                    "ENV": JSON.stringify( METADATA.ENV ),
                    "NODE_ENV": JSON.stringify( METADATA.ENV ),
                    "HMR": METADATA.HMR,
                },
            }),
            new webpack.optimize.UglifyJsPlugin( {
                // beautify: true, //debug
                // mangle: false, //debug
                // dead_code: false, //debug
                // unused: false, //debug
                // deadCode: false, //debug
                // compress: {
                //   screw_ie8: true,
                //   keep_fnames: true,
                //   drop_debugger: false,
                //   dead_code: false,
                //   unused: false
                // }, // debug
                // comments: true, //debug

                beautify: false, //prod
                output: {
                    comments: false,
                }, //prod
                mangle: {
                    screw_ie8: true,
                }, //prod
                compress: {
                    screw_ie8: true,
                    warnings: false,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                    negate_iife: false,
                },
            }),

            /**
             * Plugin: NormalModuleReplacementPlugin
             * Description: Replace resources that matches resourceRegExp with newResource
             *
             * See: http://webpack.github.io/docs/list-of-plugins.html#normalmodulereplacementplugin
             */

            new webpack.NormalModuleReplacementPlugin(
                /angular2-hmr/,
                helpers.root( "config/empty.js" )
            ),

            new webpack.NormalModuleReplacementPlugin(
                /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
                helpers.root( "config/empty.js" )
            ),

            new webpack.LoaderOptionsPlugin( {
                minimize: true,
                debug: false,
                options: {

                    /**
                     * Html loader advanced options
                     *
                     * See: https://github.com/webpack/html-loader#advanced-options
                     */
                    // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
                    htmlLoader: {
                        minimize: true,
                        removeAttributeQuotes: false,
                        caseSensitive: true,
                        customAttrSurround: [
                            [ /#/, /(?:)/ ],
                            [ /\*/, /(?:)/ ],
                            [ /\[?\(?/, /(?:)/ ],
                        ],
                        customAttrAssign: [ /\)?\]?=/ ],
                    },

                },
            }),
        ],
    });

    return ret;
};
