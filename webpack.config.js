require( "ts-node" ).register({
    "project": "./configts/tsconfig.json",
    "no-cache": true,
    "fast": true
});

let config = require( "./configts/webpack.ts" );
module.exports = config;
