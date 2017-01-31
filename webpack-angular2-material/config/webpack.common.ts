import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as webpack from "webpack";
import { Configuration, NewLoader, NewModule } from "webpack";
// tslint:disable-next-line:no-var-requires
const CheckerPlugin = require( "awesome-typescript-loader" ).CheckerPlugin;

import { IEnvironment, log, root } from "./helpers";

export function exportFunc( env: IEnvironment ) {

    const cssExtract = new ExtractTextPlugin( {
        filename: env.PROD ? "[name].[chunkhash].css" : "[name].css",
        disable: false
    });

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
        });
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
        "?sourceMap" : "?sourceMap";

    let configLocal: Configuration = {
        // main entry
        entry: {
            main: "./src/main.ts",
            polyfills: "./src/polyfills.ts",
            vendor: [
                "@angular/material/core/theming/prebuilt/deeppurple-amber.scss"
            ]
        },

        // output
        output: {
            filename: "[name].bundle.js",
            path: root( "dist" )
        },

        resolve: {
            extensions: [ ".ts", ".js" ],
        },

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: TSLOADERS
                },
                /*
                    {
                        test: /\.css$/,
                        use: [
                            "style-loader",
                            "css-loader" + cssLoadersExtra
                        ]
                    },
                */
                /*
                {
                    test: /\.scss$/,
                    use: [
                        "style-loader",
                        "css-loader" + cssLoadersExtra,
                        "sass-loader" + cssLoadersExtra
                    ]
                },
                */
                {
                    test: /\.html$/,
                    use: "raw-loader",
                    exclude: [ root( "src/index.html" ) ],
                },
                {
                    test: /\.css$/,
                    loader: cssExtract.extract( {
                        fallbackLoader: "style-loader",
                        loader: "css-loader" + cssLoadersExtra
                    }),
                },
                {
                    test: /\.scss$/,
                    loader: cssExtract.extract( {
                        fallbackLoader: "style-loader",
                        loader: "css-loader" + cssLoadersExtra + "!sass-loader" + cssLoadersExtra
                    }),
                }
            ]
        },

        plugins: [
            cssExtract,
            new CheckerPlugin(),
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/, __dirname ),
            new webpack.NamedModulesPlugin(),
            new webpack.DefinePlugin( {
                "ENV": JSON.stringify( env.ENV ),
                "HMR": env.HOT,
                "process.env": {
                    ENV: JSON.stringify( process.env.ENV = process.env.NODE_ENV = env.ENV ),
                    NODE_ENV: JSON.stringify( process.env.ENV = process.env.NODE_ENV = env.ENV ),
                    HMR: env.HOT,
                },
            }),
            new HtmlWebpackPlugin( {
                template: "src/index.html",
                title: "some title",
                chunksSortMode: "dependency",
                inject: "head",
                metadata: {
                    baseUrl: "/"
                }
            }),
            new webpack.optimize.CommonsChunkPlugin( {
                name: "polyfills",
                chunks: [ "polyfills" ],
            }),
            new webpack.optimize.CommonsChunkPlugin( {
                name: "vendor",
                chunks: [ "main" ],
                minChunks: ( module: any ) => {
                    return /node_modules/.test( module.resource );
                },
            }),
            new webpack.optimize.CommonsChunkPlugin( {
                name: [ "polyfills", "vendor" ].reverse(),
            })
        ],

        profile: true
    };

    return configLocal;
}
