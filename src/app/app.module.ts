import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";

import "../styles/headings.css";
import "../styles/styles.scss";

import { testExp2 } from "./other";

@NgModule( {
    bootstrap: [ AppComponent ],
    declarations: [ AppComponent ],
    imports: [ BrowserModule ],
})
export class AppModule { }

console.log( testExp2( 24, 52 ) );