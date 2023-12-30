import {Component, OnInit} from '@angular/core';
import {map, Observable} from "rxjs";
import {DbConnectionsService} from "../service/db-connections.service";
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit{
  colors: string[] = [  ];
  brakeKalipers: string[] = [  ];
  interior: string[]=["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg"];
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

  brakeKalipers$: Observable<string[]> = this.DbConnectionsService.list().pipe(
    map(items => items.filter(item => item.ModelloIDmongo.Nome === 'Quattroporte')),
    map(items => items.filter(item => item.CategoriaOptionalIDmongo.CategoriaOptionalID === '3')),
    map(items => items.map(item => item.FileImage)) // Assuming FileImage is the color
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
      //this.colors.push('#f3d252');
      this.colors.push('#02433f');
    });

    this.brakeKalipers$.subscribe(colors => {
      this.brakeKalipers = colors.map(colorName => {
        switch (colorName.toLowerCase()) {
          case 'pinze_argento.png':
            return '#c0c0c0';
          case 'pinze_blu_opaco_anodizzato.png':
            return '#3e5f8a';
          case 'pinze_blu.png':
            return '#0000ff';
          case 'pinze_gialle.png':
            return '#FFFF00';
          case 'pinze_nere.png':
            return '#1c1c1c';
          case 'pinze_rosse.png':
            return '#ff0000';
          case 'pinze_titanio.png':
            return '#6a696f';
          case 'pinze_rosso_opaco_anodizzato.png':
            return '#a12312';
          default:
            return '#000000';
        }
      });
    });
  }

  selectedColor = this.colors[0];
  selectedBrakeCaliper = this.brakeKalipers[0];
  selectedRim: string = '';
  selectedInterior: string = this.interior[0];


  onRimSelected(rimImage: string) {
    this.selectedRim = rimImage;
  }

}
