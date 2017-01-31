require( "ts-node" ).register({
    "project": "./config/tsconfig.json",
    "no-cache": true,
    "fast": true
});

let config = require( "./config/webpack.ts" );
module.exports = config;
