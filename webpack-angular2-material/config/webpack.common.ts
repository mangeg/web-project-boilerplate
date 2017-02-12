import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as webpack from "webpack";
import { Configuration, NewLoader, NewModule } from "webpack";

const CheckerPlugin = require( "awesome-typescript-loader" ).CheckerPlugin;
const ScriptExtHtmlWebpackPlugin = require( "script-ext-html-webpack-plugin" );

import { IEnvironment, log, root } from "./helpers";

const libToSkip: string[] = [
    "css-loader",
    "sass-loader"
];

export function exportFunc( env: IEnvironment ) {

    const cssExtract = new ExtractTextPlugin( {
        filename: env.PROD ? "[name].[chunkhash].css" : "[name].bundle.css",
        disable: false
    } );

    let TSLOADERS: NewLoader[] = [
        {
            loader: "awesome-typescript-loader",
        },
        {
            loader: "angular2-template-loader",
        },
    ];
    if ( env.HOT ) {
        TSLOADERS.unshift( {
            loader: "@angularclass/hmr-loader",
            options: {
                pretty: !env.PROD,
                prod: env.PROD,
            },
        } );
    }

    if ( env.PROD ) {
        TSLOADERS.unshift(
            {
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "es2015",
                            {
                                modules: false
                            }
                        ],
                        "stage-0"
                    ]
                }
            }
        );
    }
    const cssLoadersExtra = env.PROD ?
        "" : "?sourceMap";

    let configLocal: Configuration = {
        // main entry
        entry: {
            main: "./src/main.ts",
            polyfills: "./src/polyfills.ts"
        },

        // output
        output: {
            filename: "[name].bundle.js",
            path: root( "dist" )
        },

        resolve: {
            extensions: [ ".ts", ".js" ],
            modules: [ root( "src" ), root( "node_modules" ) ],
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: TSLOADERS,
                    exclude: root( "config" )
                },
                {
                    test: /\.html$/,
                    use: "raw-loader",
                    exclude: [ root( "src/index.html" ) ],
                },
                {
                    test: /\.css$/,
                    loader: cssExtract.extract( {
                        fallback: "style-loader",
                        use: "css-loader" + cssLoadersExtra
                    } ),
                    include: [ /styles/, /node_modules/ ]
                },
                {
                    test: /\.scss$/,
                    loader: cssExtract.extract( {
                        fallback: "style-loader",
                        use: "css-loader" + cssLoadersExtra + "!sass-loader" + cssLoadersExtra
                    } ),
                    include: [ /styles/ ]
                },
                {
                    test: /\.scss$/,
                    use: [ "to-string-loader", "css-loader", "sass-loader" ],
                    exclude: [ /styles/ ]
                },
            ]
        },

        plugins: [
            cssExtract,

            new webpack.WatchIgnorePlugin( [ /config/ ] ),

            new CheckerPlugin(),

            new webpack.NamedModulesPlugin(),

            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/, __dirname ),

            new webpack.DefinePlugin( {
                "ENV": JSON.stringify( env.ENV ),
                "HMR": env.HOT,
                "process.env": {
                    ENV: JSON.stringify( process.env.ENV = process.env.NODE_ENV = env.ENV ),
                    NODE_ENV: JSON.stringify( process.env.ENV = process.env.NODE_ENV = env.ENV ),
                    HMR: env.HOT,
                }
            } ),

            new HtmlWebpackPlugin( {
                template: "src/index.html",
                title: "some title",
                chunksSortMode: "dependency",
                inject: "head"
            } ),
            new webpack.optimize.CommonsChunkPlugin( {
                name: "polyfills",
                chunks: [ "polyfills" ]
            } ),
            new webpack.optimize.CommonsChunkPlugin( {
                name: "vendor",
                chunks: [ "main" ],
                minChunks: ( module: any ) => {
                    if ( !module.resource ) {
                        return false;
                    }
                    let skipMatches = libToSkip.filter(( l: string ) => {
                        if ( ( new RegExp( l, "i" ) ).test( module.resource ) ) {
                            return true;
                        }
                    } );

                    if ( skipMatches.length > 0 ) {
                        return false;
                    }

                    return /node_modules/.test( module.resource );
                }
            } ),

            new webpack.optimize.CommonsChunkPlugin( {
                name: [ "polyfills", "vendor" ].reverse(),
            } ),

            new webpack.optimize.CommonsChunkPlugin( {
                name: "bootstrap",
            } ),

            new ScriptExtHtmlWebpackPlugin( {
                defaultAttribute: "defer"
            } ),

            // Fix Angular 2
            new webpack.NormalModuleReplacementPlugin(
                /facade(\\|\/)async/,
                root( "node_modules/@angular/core/src/facade/async.js" )
            ),
            new webpack.NormalModuleReplacementPlugin(
                /facade(\\|\/)collection/,
                root( "node_modules/@angular/core/src/facade/collection.js" )
            ),
            new webpack.NormalModuleReplacementPlugin(
                /facade(\\|\/)errors/,
                root( "node_modules/@angular/core/src/facade/errors.js" )
            ),
            new webpack.NormalModuleReplacementPlugin(
                /facade(\\|\/)lang/,
                root( "node_modules/@angular/core/src/facade/lang.js" )
            ),
            new webpack.NormalModuleReplacementPlugin(
                /facade(\\|\/)math/,
                root( "node_modules/@angular/core/src/facade/math.js" )
            ),
        ],

        profile: false
    };

    return configLocal;
}
