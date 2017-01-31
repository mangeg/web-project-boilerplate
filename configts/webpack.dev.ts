import * as webpack from "webpack";
import { Configuration } from "webpack";
import * as webpackMerge from "webpack-merge";


const webpackMergeDll = webpackMerge.strategy( { plugins: "replace" });
import { DllBundlesPlugin } from "webpack-dll-bundles-plugin";
const AddAssetHtmlPlugin = require( "add-asset-html-webpack-plugin" );

import { log, root, IEnvironment } from "./helpers";
import { exportFunc } from "./webpack.common";

export default function createConfig( env: IEnvironment ) {
    // Create common configuration
    let commonConfig = exportFunc( env );
    let commonConfigDll = exportFunc( env );

    // Create dev specific config    
    let localConfig: Configuration = {
        devtool: "source-map",
        output: {
            path: root( "dist" ),
            filename: "[name].bundle.js",
            sourceMapFilename: "[file].map",
            chunkFilename: "[id].chunk.js",
            library: "ac_[name]",
            libraryTarget: "var",
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
                        "@angular/http",
                        "@angular/forms",
                        "@angular/router",
                        "@angular/material",
                        "@angularclass/hmr",
                        "hammerjs",
                        "rxjs",
                    ],
                },
                dllDir: root( "dll" ),
                webpackConfig: webpackMergeDll( commonConfigDll, {
                    devtool: "cheap-module-source-map",
                    plugins: [],
                }),
            }),

            new AddAssetHtmlPlugin( [
                { filepath: root( `dll/${DllBundlesPlugin.resolveFile( "polyfills" )}` ) },
                { filepath: root( `dll/${DllBundlesPlugin.resolveFile( "vendor" )}` ) },
            ] ),
        ],

        devServer: {
            contentBase: root( "dist" ),
            port: 3000,
            host: "localhost",
            historyApiFallback: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000,
            },
        },
    };

    // Merge the configs    
    let mergedConfig = webpackMerge( commonConfig, localConfig );

    // log( mergedConfig, false, 3 );

    return mergedConfig;
};