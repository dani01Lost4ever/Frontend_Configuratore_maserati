import { NgtColorPipeModule, NgtCoreModule } from '@angular-three/core';
import { NgtAmbientLightModule, NgtPointLightModule } from '@angular-three/core/lights';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtSobaLoaderModule } from '@angular-three/soba/loaders';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CarConfiguratorComponent } from './car-configurator/car-configurator.component';
import { WheelPreviewComponent } from './wheel-preview/wheel-preview.component';
import {HttpClientModule} from "@angular/common/http";
import { CardComponent } from './card/card.component';
import {NgtPlaneGeometryModule} from "@angular-three/core/geometries";
import {NgtMeshStandardMaterialModule, NgtShadowMaterialModule} from "@angular-three/core/materials";

@NgModule({
  declarations: [
    AppComponent,
    CarConfiguratorComponent,
    WheelPreviewComponent,
    CardComponent,

  ],
  imports: [
    BrowserModule,
    NgtCoreModule,
    NgtSobaLoaderModule,
    NgtPrimitiveModule,
    NgtSobaOrbitControlsModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
    NgtColorPipeModule,
    HttpClientModule,
    NgtPlaneGeometryModule,
    NgtMeshStandardMaterialModule,
    NgtShadowMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
