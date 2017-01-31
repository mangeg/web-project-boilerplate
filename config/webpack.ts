import { log, root } from "./helpers";

import { hasProcessFlag, IEnvironment } from "./helpers";

const hotEnabled = hasProcessFlag( "hot" );
const isProd = process.env.ENV = process.env.NODE_ENV === "production";

const environment: IEnvironment = {
    HOT: hotEnabled,
    PROD: isProd,
    ENV: process.env.ENV = process.env.NODE_ENV
};

log( { env: environment });

let funcToExport: ( env?: any ) => any;

switch ( process.env.NODE_ENV ) {
    case "production":
        funcToExport = require( "./webpack.prod" ).default;
        break;
    default:
        funcToExport = require( "./webpack.dev" ).default;
        break;
}

export default funcToExport( environment );
