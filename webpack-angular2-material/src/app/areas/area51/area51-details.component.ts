import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import "rxjs/add/operator/take";
import "rxjs/add/operator/toPromise";

@Component( {
    selector: "wp-area51-detail",
    template: require( "./area51-details.component.html" )
})
export class Area51DetailsComponent implements OnInit {
    public areaId: string;

    constructor( private route: ActivatedRoute ) { }

    public async ngOnInit() {
        let param = await this.route.params.take( 1 ).toPromise();
        this.areaId = param[ "id" ];
    }

}