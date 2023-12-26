import {Component, OnInit} from '@angular/core';
import {Mesh, Object3D} from "three";
import {NgtGLTFLoaderService} from "@angular-three/soba/loaders";
import {map, Observable} from "rxjs";
import {OptionalEntity} from "./interfaces/optionals";
import {DbConnectionsService} from "./service/db-connections.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

}
