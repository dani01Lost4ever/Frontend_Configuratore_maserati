import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgtGLTFLoaderService } from '@angular-three/soba/loaders';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import * as THREE from 'three';
import {
  DoubleSide,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
} from 'three';
import { preserveWhitespacesDefault } from '@angular/compiler';

@Component({
  selector: 'app-car-configurator',
  templateUrl: './car-configurator.component.html',
  styleUrls: ['./car-configurator.component.scss'],
})
export class CarConfiguratorComponent implements OnInit, OnChanges {
  // private originalWheelsFront!: Object3D | undefined
  // private originalWheelsRear!: Object3D | undefined;
  @Input()
  set color(value: string) {
    this.#color = value;
    this.applyColorToMaterial(value);
  }
  @Input() set brakeKaliper(value: string) {
    this.#caliper = value;
    this.applyColorToCaliper(value);
  }
  @Input() set interior(value: string) {
    this.#interior = value;
    this.applyColorToInterior(value);
  }
  @Input() rim: string = '';

  private carModel: Object3D | null = null; // This will store the car model scene
  #color = '';
  #caliper = '';
  #interior = '';
  cupMaterial: MeshPhysicalMaterial | undefined;

  constructor(private gltfLoaderService: NgtGLTFLoaderService) {}

  // alternateWheels$ = this.gltfLoaderService.load('assets/newRims.glb');
  // private alternateWheels: Object3D | undefined;
  car$ = this.gltfLoaderService.load('assets/maserati_quattroporte.glb');
  carLoaded(object: Object3D) {
    //logging*************************************
    const box = new THREE.Box3().setFromObject(object);
    console.log('Position:', object.position);
    console.log('Scale:', object.scale);
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log('Size of the car:', size);
    //logging*************************************
    const textureLoader = new THREE.TextureLoader();
    const texture= textureLoader.load(
      'https://maseraticonfigurator.azurewebsites.net/floor4.jpg',
      (texture) => {
        texture.encoding = THREE.sRGBEncoding ;
        texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.generateMipmaps = false; // Only use if necessary
        texture.needsUpdate = true;
        floorMaterial.emissiveMap = texture;
        floorMaterial.map = texture;
        floorMaterial.needsUpdate = true;
        console.log("Floor Texture loaded");
      }, undefined, (err) => {
        console.error('An error occurred loading the floor texture.');
        console.error(err);
      }
    );
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshStandardMaterial({  side: DoubleSide, metalness: 0.4, roughness: 0.0, normalMap: texture , fog: true});
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    //floorMaterial.map = texture;
    floorMesh.rotation.x = -Math.PI / 2; // Rotate the floor to be parallel to the x-z plane
    floorMesh.receiveShadow = true; // Enable the floor mesh to receive shadows
    object.add(floorMesh); // Add the floor mesh to the car scene
    this.carModel = object; // Store the main car model
    console.log('model loaded: ' + object);
    const traverseAndListMaterials = (obj: Object3D) => {
      if (obj instanceof Mesh && obj.material) {
        //console.log('Material found in:', obj.name, obj.material);
      }
      obj.children.forEach((child) => traverseAndListMaterials(child));
    };
    traverseAndListMaterials(object);

    object.traverse((node) => {
      if (node.name) {
        //console.log('Node found:', node.name, node);
      }
    });
    // this.originalWheelsFront = object.getObjectByName('GEO_rimLR_SUB0_EXT_rim3_0');
    // this.originalWheelsRear = object.getObjectByName('GEO_rimLF_SUB0_EXT_rim1_0');

    const carpaintMesh = object.getObjectByName(
      'GEO_body_carpaint_2_EXT_carpaint_0'
    );
    console.log('material: ' + carpaintMesh);
    if (carpaintMesh && carpaintMesh instanceof Mesh) {
      this.cupMaterial = carpaintMesh.material as MeshPhysicalMaterial;
      this.applyColorToMaterial(this.#color);
    } else {
      console.error('Carpaint mesh object not found or is not a Mesh.');
    }
    console.log(this.cupMaterial);
    this.applyColorToMaterial(this.#color);
  }

  ngOnInit() {
    // this.alternateWheels$.subscribe((gltf) => {
    //   this.alternateWheels = gltf.scene;
    // });
  }

  controlsReady(controls: NgtSobaOrbitControls) {
    const orbitControls = controls.controls;
    orbitControls.enableZoom = true;
    orbitControls.autoRotate = true;
    orbitControls.autoRotateSpeed = 2;
    orbitControls.maxZoom = 0.5;
    orbitControls.minZoom = 0.2;
    const camera = orbitControls.object as PerspectiveCamera;
    camera.fov = 100;
    camera.zoom = 3.0;
    camera.position.setY(2);
  }

  applyColorToMaterial(color: string) {
    console.log(color);
    if (this.cupMaterial) {
      console.log('setting color');
      const textureLoader = new THREE.TextureLoader();
      this.cupMaterial.map = textureLoader.load(`https://maseraticonfigurator.azurewebsites.net/${color.substring(1)}.png`);
      // Adjust the base color of the material
      this.cupMaterial.clearcoat = 1.0;
      this.cupMaterial.clearcoatRoughness = 0.1;
      this.cupMaterial.reflectivity = 1.0;
      this.cupMaterial.color.setHex(parseInt(color.substring(1), 16));
      // Optionally, you might want to adjust the emissive color to a low intensity or black (if you don't want any glow effect)
      this.cupMaterial.emissive.setHex(parseInt(color.substring(1), 16)); // or a very dark shade of the base color
      this.cupMaterial.emissiveIntensity = 0.1; // A small value to add depth, if necessary
      this.cupMaterial.metalness = 1.0; // values range from 0.0 (non-metallic) to 1.0 (metallic)
      this.cupMaterial.roughness = 0.1; // values range from 0.0 (smooth) to 1.0 (rough)
      this.cupMaterial.needsUpdate = true;
    }
  }

  applyColorToCaliper(color: string) {
    //create an array to store the objects
    var objects = [];
    //i need to retrieve the right object inside carModel
    const caliperMeshLF = this.carModel!.getObjectByName(
      'GEO_caliperLF_2_EXT_caliper_0'
    );
    objects.push(caliperMeshLF);
    const caliperMeshLR = this.carModel!.getObjectByName(
      'GEO_caliperLR_2_EXT_caliper.1_0'
    );
    objects.push(caliperMeshLR);
    const caliperMeshRF = this.carModel!.getObjectByName(
      'GEO_caliperRF_2_EXT_caliper.2_0'
    );
    objects.push(caliperMeshRF);
    const caliperMeshRR = this.carModel!.getObjectByName(
      'GEO_caliperRR_2_EXT_caliper.3_0'
    );
    objects.push(caliperMeshRR);
    console.log('material: ' + objects);
    objects.forEach((caliperMesh) => {
      if (caliperMesh instanceof Mesh) {
        const caliperMaterial = caliperMesh.material as MeshPhysicalMaterial;
        const textureLoader = new THREE.TextureLoader();
        caliperMaterial.map = textureLoader.load(`https://maseraticonfigurator.azurewebsites.net/${color.substring(1)}.png`);
        // Adjust the base color of the material
        caliperMaterial.color.setHex(parseInt(color.substring(1), 16));
        // Optionally, you might want to adjust the emissive color to a low intensity or black (if you don't want any glow effect)
        caliperMaterial.emissive.setHex(parseInt(color.substring(1), 16)); // or a very dark shade of the base color
        caliperMaterial.emissiveIntensity = 0.1; // A small value to add depth, if necessary
        caliperMaterial.metalness = 1.0; // values range from 0.0 (non-metallic) to 1.0 (metallic)
        caliperMaterial.roughness = 0.1; // values range from 0.0 (smooth) to 1.0 (rough)
        caliperMaterial.needsUpdate = true;
      }
    });
  }

  applyColorToInterior(color: string) {
    var hexcolor = '';
    switch (color) {
      case '1.jpg':
        hexcolor = '#c9ac90';
        break;
      case '2.jpg':
        hexcolor = '#21252d';
        break;
      case '3.jpg':
        hexcolor = '#264e8b';
        break;
      case '4.jpg':
        hexcolor = '#0b0c13';
        break;
      case '5.jpg':
        hexcolor = '#0989ac';
        break;
      case '6.jpg':
        hexcolor = '#93928d';
        break;
      default:
        hexcolor = '#000000';
    }
    const interiorMesh = this.carModel!.getObjectByName(
      'GEO_interiors_SUB0_INT_leather_color_0'
    );
    const interiorDetailsMesh = this.carModel!.getObjectByName(
      "GEO_interiors_SUB4_INT_plastic_color_0"
    );
    if (interiorMesh instanceof Mesh) {
      const interiorMaterial = interiorMesh.material as MeshPhysicalMaterial;
      // Adjust the base color of the material
      const textureLoader = new THREE.TextureLoader();
      interiorMaterial.map = textureLoader.load(`https://maseraticonfigurator.azurewebsites.net/${color.substring(1)}.png`);
      interiorMaterial.color.setHex(parseInt(hexcolor.substring(1), 16));
      interiorMaterial.emissive.setHex(parseInt(hexcolor.substring(1), 16));
      interiorMaterial.emissiveIntensity = 0.1;
      interiorMaterial.metalness = 0;
      interiorMaterial.roughness = 0.8;
      interiorMaterial.needsUpdate = true;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rim']) {
      this.loadAndSwapRims(changes['rim'].currentValue);
    }
  }
  private loadAndSwapRims(rimFileName: string) {
    var rimPath = '';
    if (rimFileName === 'cerchi_mercurio.png') rimPath = 'assets/3.glb';
    if (rimFileName === 'cerchi_plutone.png') rimPath = 'assets/1.glb';
    if (rimFileName === 'cerchi_urano.png') rimPath = 'assets/2.glb';
    // const rimPath = `assets/${rimFileName.replace('.png', '.glb')}`;
    console.log('Tipo di cerchi: ' + rimFileName + ' ' + rimPath);
    const result = this.gltfLoaderService.load(rimPath).subscribe((gltf) => {
      if (this.carModel) {
        const newRimMesh = this.extractSingleRimMesh(gltf.scene);
        console.log('new rim mesh: ' + newRimMesh.name);
        this.swapAllWheels(newRimMesh);
      }
    });
    console.log('Result of Loading Rim' + result);
  }
  private extractSingleRimMesh(gltfScene: Group): Mesh {
    let newRimMesh: Mesh | null = null;
    gltfScene.traverse((child) => {
      if ((child as Mesh).isMesh) {
        const mesh = child as Mesh;
        newRimMesh = mesh.clone(); // Clone the mesh if it's a Mesh
      }
    });

    if (newRimMesh === null) {
      throw new Error('No rim mesh found in the GLB file.');
    }

    return newRimMesh;
  }

  private swapAllWheels(newRimMesh: Mesh) {
    if (!this.carModel) {
      console.error('Car object is not defined');
      return;
    }

    const wheelNames = [
      'GEO_rimLR_SUB0_EXT_rim3_0',
      'GEO_rimLF_SUB0_EXT_rim1_0',
      'GEO_rimRF_SUB0_EXT_rim5_0',
      'GEO_rimRR_SUB0_EXT_rim7_0',
      'Object_24',
      'Object_22',
      'Object_26',
      'Object_24',
      'Object_22',
      'Object_26',
      'Object_24',
      'Object_22',
      'Object_26',
      'Object_24',
      'Object_22',
      'Object_26',
    ];

    wheelNames.forEach((wheelName) => {
      const oldWheel = this.carModel!.getObjectByName(wheelName);
      if (oldWheel && oldWheel.parent) {
        const newWheel = newRimMesh.clone(); // Clone the new rim mesh for each wheel
        newWheel.traverse((child) => {
          if (child instanceof Mesh) {
            // Apply the existing material or change material properties accordingly
            child.material = this.createWheelMaterial(child.material);
            // Ensure mesh normals are recalculated for correct lighting
            child.geometry.computeVertexNormals();
          }
        });
        newWheel.position.copy(oldWheel.position);

        if (oldWheel.name.endsWith('1_0')) {
          newWheel.position.x += -14;
        } else if (!oldWheel.name.startsWith('Object')) {
          newWheel.position.x += -13;
        }

        newWheel.rotation.copy(oldWheel.rotation);

        if (!oldWheel.name.startsWith('Object')) newWheel.rotateZ(-Math.PI / 2);
        // Rotate by 90 degrees (PI / 2 radians)
        newWheel.scale.copy(oldWheel.scale);

        if (oldWheel.name.endsWith('5_0') || oldWheel.name.endsWith('7_0')) {
          newWheel.rotateZ(Math.PI);
          if (oldWheel.name.endsWith('5_0')) newWheel.position.x += +25;
          else newWheel.position.x += 26;
        }

        newWheel.updateMatrix(); // Ensure the new wheel's transformation matrix is updated
        newWheel.geometry.computeVertexNormals();
        oldWheel.parent.add(newWheel);
        oldWheel.parent.remove(oldWheel);
        // Dispose of the old geometry and material to prevent memory leaks
        if (oldWheel instanceof Mesh) {
          oldWheel.geometry.dispose();
          if (Array.isArray(oldWheel.material)) {
            oldWheel.material.forEach((material) => material.dispose());
          } else {
            oldWheel.material.dispose();
          }
        }
      }
    });
  }
  private createWheelMaterial(originalMaterial: {
    color: any;
    metalness: any;
    roughness: any;
    emissive: any;
  }): MeshStandardMaterial {
    // Create a new material with adjusted properties based on the original material
    return new MeshStandardMaterial({
      color: originalMaterial.color,
      metalness: originalMaterial.metalness || 0.5,
      roughness: originalMaterial.roughness || 0.3,
      emissive: originalMaterial.emissive || new THREE.Color(0xc0c0c0),
    });
  }

  protected readonly DoubleSide = DoubleSide;
  protected readonly Math = Math;
  protected readonly THREE = THREE;
  protected readonly preserveWhitespacesDefault = preserveWhitespacesDefault;
}
