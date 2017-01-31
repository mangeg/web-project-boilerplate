import { log, root } from "./helpers";

import { hasProcessFlag, IEnvironment } from "./helpers";

const hotEnabled = hasProcessFlag( "hot" );
const isProd = process.env.NODE_ENV == "production";

const environment: IEnvironment = {
    HOT: hotEnabled,
    PROD: isProd,
    ENV: process.env.ENV = process.env.NODE_ENV = "development"
};

// log( { env: environment });

let funcToExport: ( env?: any ) => any;
switch ( process.env[ "NODE_ENV" ] ) {
    default:
        funcToExport = require( "./webpack.dev" ).default;
        break;
}

export default funcToExport( environment );