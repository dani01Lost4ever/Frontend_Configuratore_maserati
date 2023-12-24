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
export class AppComponent implements OnInit{
  colors: string[] = [  ];
  prezzo: number = 0;
  constructor(private DbConnectionsService: DbConnectionsService) {  }
  paints$: Observable<string[]> = this.DbConnectionsService.list().pipe(
    map(items => items.filter(item => item.ModelloIDmongo.Nome === 'Quattroporte')),
    map(items => items.filter(item => item.CategoriaOptionalIDmongo.CategoriaOptionalID === '1')),
    map(items => items.map(item => item.FileImage)) // Assuming FileImage is the color
  );
  price$: Observable<number[]> = this.DbConnectionsService.listModelli().pipe(
    map(items => items.filter(item => item.Nome === 'Quattroporte')),
    map(items => items.map(item => item.PrezzoBase))
  );

  ngOnInit() {
    this.price$.subscribe(prices => {
      this.prezzo = prices[0];
    });
    this.paints$.subscribe(colors => {
      this.colors = colors.map(colorName => {
        switch (colorName.toLowerCase()) {
          case 'carrozzeria_blu_passione.png':
            return '#1c1e3a';
          case 'carrozzeria_nero_ribelle.png':
            return '#0f0f0f';
          case 'carrozzeria_rosso_folgore.png':
            return '#86252b';
          default:
            return '#000000';
        }
      });
    });
  }

  selectedColor = this.colors[0];
  selectedRim: string = '';

  onRimSelected(rimImage: string) {
    this.selectedRim = rimImage;
  }

}
