import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Mesh, MeshPhysicalMaterial, Object3D, PerspectiveCamera, WebGLRenderer} from "three";
import {NgtGLTFLoaderService} from "@angular-three/soba/loaders";
import {NgtSobaOrbitControls} from "@angular-three/soba/controls";
import {SceneUtils} from "three/examples/jsm/utils/SceneUtils";
import createMeshesFromInstancedMesh = SceneUtils.createMeshesFromInstancedMesh;
import {map, Observable} from "rxjs";
import {OptionalEntity} from "../interfaces/optionals";
import {DbConnectionsService} from "../service/db-connections.service";

@Component({
  selector: 'app-wheel-preview',
  templateUrl: './wheel-preview.component.html',
  styleUrls: ['./wheel-preview.component.scss']
})
export class WheelPreviewComponent  implements OnInit{
  constructor(private DbConnectionsService: DbConnectionsService) {  }
  rims$: Observable<OptionalEntity[]> = this.DbConnectionsService.list().pipe(
    map(items => items.filter(item => item.ModelloIDmongo.Nome === 'Quattroporte')),
    map(items => items.filter(item => item.CategoriaOptionalIDmongo.CategoriaOptionalID === '2')),
  )
  selectedRim: string = '';
  rims: OptionalEntity[] = [  ];
  ngOnInit() {
    this.rims$.subscribe(rims => {
      this.rims = rims;
    });
  }

  @Output() rimSelected = new EventEmitter<string>();

  selectRim(rimImage: string) {
    this.rimSelected.emit(rimImage);
    this.selectedRim = rimImage;
  }
}
