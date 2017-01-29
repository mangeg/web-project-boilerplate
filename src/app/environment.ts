// Angular 2
import { ApplicationRef, enableProdMode, } from "@angular/core";
import { disableDebugTools, enableDebugTools, } from "@angular/platform-browser";

// Environment Providers
let PROVIDERS: any[] = [
    // common env directives
];

// Angular debug tools in the dev console
// https://github.com/angular/angular/blob/86405345b781a9dc2438c0fbe3e9409245647019/TOOLS_JS.md
let localDecorateModuleRef = <T>( value: T ): T => { return value; };
if ( "production" === ENV ) {
    enableProdMode();

    // Production
    localDecorateModuleRef = ( modRef: any ) => {
        disableDebugTools();

        return modRef;
    };

    PROVIDERS = [
        ...PROVIDERS,
        // custom providers in production
    ];

} else {

    localDecorateModuleRef = ( modRef: any ) => {
        const appRef = modRef.injector.get( ApplicationRef );
        const cmpRef = appRef.components[ 0 ];

        let ng = ( <any> window ).ng;
        enableDebugTools( cmpRef );
        ( <any> window ).ng.probe = ng.probe;
        ( <any> window ).ng.coreTokens = ng.coreTokens;
        return modRef;
    };

    // Development
    PROVIDERS = [
        ...PROVIDERS,
        // custom providers in development
    ];

}

export const decorateModuleRef = localDecorateModuleRef;

export const ENV_PROVIDERS = [
    ...PROVIDERS,
];
