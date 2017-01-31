require( "ts-node" ).register({
    "project": "./configts/tsconfig2.json",
    "no-cache": true,
    "fast": true
});

let config = require( "./webpack.ts" );
module.exports = config;
