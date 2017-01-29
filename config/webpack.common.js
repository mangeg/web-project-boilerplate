const webpack = require( "webpack" );
const helpers = require( "./helpers" );

const AssetsPlugin = require( "assets-webpack-plugin" );
const CheckerPlugin = require( "awesome-typescript-loader" ).CheckerPlugin;
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const ScriptExtHtmlWebpackPlugin = require( "script-ext-html-webpack-plugin" );

const METADATA = {
    title: "Angular 2 webpack boilerplate",
    baseUrl: "/",
    isDevServer: helpers.isWebpackDevServer(),
};

module.exports = function ( options ) {
    return {
        entry: {
            "main": "./src/main.ts",
            "polyfills": "./src/polyfills.ts",
        },
        resolve: {
            extensions: [ ".ts", ".js" ],
            modules: [ helpers.root( "src" ), helpers.root( "node_modules" ) ]
        },
        module: {
            rules: [
                {
                    test: /\.(ts)$/,
                    use: [
                        {
                            loader: "awesome-typescript-loader",
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: [ "to-string-loader", "css-loader" ],
                    exclude: [ helpers.root( "src", "styles" ) ]
                },
                {
                    test: /\.scss$/,
                    use: [ "to-string-loader", "css-loader", "sass-loader" ],
                    exclude: [ helpers.root( "src", "styles" ) ],
                },
                {
                    test: /\.html$/,
                    use: "raw-loader",
                    exclude: [ helpers.root( "src/index.html" ) ]
                },
            ],
        },
        plugins: [
            new AssetsPlugin( {
                path: helpers.root( "dist" ),
                filename: "webpack-assets.json",
                prettyPrint: true,
            }),
            new webpack.ContextReplacementPlugin(
                /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/, __dirname ),
            new CheckerPlugin(),
            new HtmlWebpackPlugin( {
                template: "src/index.html",
                title: METADATA.title,
                chunksSortMode: "dependency",
                metadata: METADATA,
                inject: "head",
            }),

            new webpack.optimize.CommonsChunkPlugin( {
                name: "polyfills",
                chunks: [ "polyfills" ],
            }),
            new webpack.optimize.CommonsChunkPlugin( {
                name: "vendor",
                chunks: [ "main" ],
                minChunks: module => {
                    return /node_modules/.test( module.resource );
                },
            }),
            new webpack.optimize.CommonsChunkPlugin( {
                name: [ "polyfills", "vendor" ].reverse(),
            }),
        ],
        node: {
            global: true,
            crypto: "empty",
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false,
        },
    };
};