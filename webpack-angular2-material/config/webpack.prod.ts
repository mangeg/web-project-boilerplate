import * as webpack from "webpack";
import { Configuration } from "webpack";
import * as webpackMerge from "webpack-merge";

import * as OptimizeJsPlugin from "optimize-js-plugin";

import { IEnvironment, log, root } from "./helpers";
import { exportFunc } from "./webpack.common";

export default function createConfig( env: IEnvironment ) {
    // Create common configuration
    let commonConfig = exportFunc( env );

    // Create dev specific config
    let localConfig: Configuration = {
        devtool: false,

        output: {
            path: root( "dist" ),
            filename: "[name].[chunkhash].bundle.js",
            sourceMapFilename: "[name].[chunkhash].bundle.map",
            chunkFilename: "[id].[chunkhash].chunk.js",
        },

        module: {

            rules: [
                /*{
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
                },*/

            ],

        },

        plugins: [
            new OptimizeJsPlugin( {
                sourceMap: false,
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
                comments: true,
                beautify: true, // prod
                // prod
                mangle: false, // prod
                compress: false,
            }),

            new webpack.NormalModuleReplacementPlugin(
                /angular2-hmr/,
                root( "config/empty.js" )
            ),

            new webpack.NormalModuleReplacementPlugin(
                /zone\.js(\\|\/)dist(\\|\/)long-stack-trace-zone/,
                root( "config/empty.js" )
            ),

            new webpack.LoaderOptionsPlugin( {
                debug: false,
                minimize: true,
                options: {
                    context: __dirname,
                    output: { path: "./" },

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
                }
            }),
        ]
    };

    // Merge the configs
    let mergedConfig = webpackMerge( commonConfig, localConfig );

    // log( mergedConfig, false, 3 );

    return mergedConfig;
}
