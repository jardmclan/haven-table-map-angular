import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapService } from '../../services/map.service';
import { PlanService } from '../../services/plan.service';
import { MapDirective } from './map.directive';
import * as d3 from 'd3';
import { MapLayer, Parcel } from '@app/interfaces';

@Component({
  selector: 'app-map-element',
  templateUrl: './map-element.component.html',
  styleUrls: ['./map-element.component.css']
})

export class MapElementComponent implements OnInit {

  static NUM_SCENARIOS = 6;
  static VIS_TYPES = ["lc", "rc"];
  static BASE_PATH = "assets/plans/oahu/images/"

  scale: number;
  width: number;
  height: number;
  rasterBounds: any[];
  baseMapImagePath: string;

  projection: d3.geo.Projection;
  path: d3.geo.Path;
  map: d3.Selection<any>;

  imagePaths: {
    lc: string[],
    rc: string[]
  };

  scenarioState: {
    type: string,
    scenario: number
  }

  @ViewChild('mapDiv', { static: true }) mapDiv: ElementRef;

  @ViewChild(MapDirective, { static: true }) mapElement;

  constructor(private mapService: MapService, private planService: PlanService) {
    this.scale = mapService.getMapScale();
    this.width = mapService.getMapImageWidth() * this.scale;
    this.height = mapService.getMapImageHeight() * this.scale;
    this.rasterBounds = mapService.getMapBounds();
    this.baseMapImagePath = mapService.getBaseMapPath();

    this.imagePaths = {
      lc: [],
      rc: []
    };

    this.scenarioState = {
      type: "lc",
      scenario: 0
    };

    MapElementComponent.VIS_TYPES.forEach((type) => {
      let imagePathsBase = this.imagePaths[type];
      let pathBase = MapElementComponent.BASE_PATH + type + "_"
      imagePathsBase.push(pathBase + "base.png");
      for(let i = 1; i <= MapElementComponent.NUM_SCENARIOS; i++) {
        imagePathsBase.push(pathBase + "s" + i.toString() + ".png");
      }
    });
  }

  private getImagePath(): string {
    console.log("?");
    console.log(this.scenarioState);
    return this.imagePaths[this.scenarioState.type][this.scenarioState.scenario];
  }

  private setScenario(scenario: number): void {
    this.scenarioState.scenario = scenario;
  }

  private setVis(type: string): void {
    console.log(type);
    this.scenarioState.type = type;
  }

  private updateMapImage() {
    this.baseMapImagePath = this.getImagePath();
    this.map.select("image").attr('xlink:href', `${this.baseMapImagePath}`);
  }

  ngOnInit() {
    this.projection = d3.geo.mercator()
      .scale(1)
      .translate([0, 0]);

    this.path = d3.geo.path()
      .projection(this.projection);

    this.map = d3.select(this.mapDiv.nativeElement).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);

    this.map.append('image')
      .attr('xlink:href', `${this.baseMapImagePath}`)
      .attr('width', this.width)
      .attr('height', this.height);

    this.mapService.getLayers().forEach(layer => {
      if (layer.filePath === null) {
        return;
      }
      d3.json(`${layer.filePath}`, (error, geoData) => {
        const bounds = [this.projection(this.rasterBounds[0]), this.projection(this.rasterBounds[1])];
        const scale = 1 / Math.max((bounds[1][0] - bounds[0][0]) / this.width, (bounds[1][1] - bounds[0][1]) / this.height);
        const transform = [
          (this.width - scale * (bounds[1][0] + bounds[0][0])) / 2,
          (this.height - scale * (bounds[1][1] + bounds[0][1])) / 2
        ] as [number, number];

        const proj = d3.geo.mercator()
          .scale(scale)
          .translate(transform);

        const path = d3.geo.path()
          .projection(proj);

        this.map.selectAll(layer.name)
          .data(geoData.features)
          .enter().append('path')
          .attr('d', path)
          .attr('class', layer.name)
          .each(function (d) {
            layer.parcels.push({ path: this, properties: (d.hasOwnProperty(`properties`)) ? d[`properties`] : null } as Parcel);
          }).call(() => {
            if (layer.setupFunction !== null) {
              layer.setupFunction(this.planService);
            } else {
              this.defaultFill(layer);
            }
          });
      });
    });

    // // Subscribe to layer toggling
    // this.mapService.toggleLayerSubject.subscribe((layer) => {
    //   console.log("test");
    //   if (layer.updateFunction !== null) {
    //     layer.updateFunction(this.planService);
    //   } else {
    //     this.defaultFill(layer);
    //   }
    // });

    // this.mapService.updateLayerSubject.subscribe((layer) => {
    //   if (layer.updateFunction !== null) {
    //     layer.updateFunction(this.planService);
    //   } else {
    //     this.defaultFill(layer);
    //   }
    // });

    this.mapService.getScenarioObservable().subscribe((scenario: number) => {
      this.setScenario(scenario);
      this.updateMapImage();
    });

    this.mapService.getVisObservable().subscribe((type: string) => {
      this.setVis(type);
      this.updateMapImage();
    });
  }

  defaultFill(layer: MapLayer) {
    layer.parcels.forEach(el => {
      d3.select(el.path)
        .style('fill', layer.fillColor)
        .style('opacity', layer.active ? 0.85 : 0.0)
        .style('stroke', layer.borderColor)
        .style('stroke-width', layer.borderWidth + 'px');
    });
  }
}
