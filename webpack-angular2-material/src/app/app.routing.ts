import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./home";

const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "", pathMatch: "full", component: HomeComponent },
    { path: "**", redirectTo: "/home" }
];

@NgModule( {
    declarations: [ HomeComponent ],
    exports: [ RouterModule ],
    imports: [ RouterModule.forRoot( routes ) ]
})
export class AppRoutingModule { }
