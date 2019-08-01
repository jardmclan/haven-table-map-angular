import { Component, OnInit, ViewChildren } from '@angular/core';
import { chartColors, mapLayerColors } from '../../../../assets/plans/defaultColors';
import { MapMainComponent } from '../../map-main.component';
import { Subject } from 'rxjs';
import { MapLayer } from '@app/interfaces';
import { MapService } from '../../../services/map.service';
import { ArService } from '../../../services/ar.service';
import { CardStyleDirective } from '../card-style.directive';
import { _ } from 'underscore';
import { PlanService } from "../../../services/plan.service"

@Component({
  selector: 'app-add-remove-layers',
  templateUrl: './add-remove-layers.component.html',
  styleUrls: ['./add-remove-layers.component.css']
})

export class AddRemoveLayersComponent implements OnInit {

  // Elements with cardStyle directive
  @ViewChildren(CardStyleDirective) cardStyle;

  layers: MapLayer[]; // Array holding all layers
  nextLayer: MapLayer; // The next layer to be added or removed.
  private tracking: boolean;

  vis: {label: string, descriptor: string};
  scenario: {label: string, descriptor: string};



  visDescriptors = {
    lc: {
      label: "Land Cover",
      descriptor: "Land usage based on a set of 29 USGS defined categories."
    },
    rc: {
      label: "Groundwater Recharge",
      descriptor: "Groundwater-recharge rate estimates based on land usage and the USGS soil water-balance modeling software."
    }
  };

  scenarioDescriptors = [
    {
      label: "Baseline Land Cover",
      descriptor: "Baseline land usage for the island of O'ahu based on a 2010 survey."
    },
    {
      label: "Pearl Harbor Development Scenario 1",
      descriptor: "High intensity urban development within a one-mile radius of rail corridor. Current agricultural lands are protected as further development is confined to corridor. All existing native forest is protected.",
    },
    {
      label: "Pearl Harbor Development Scenario 2",
      descriptor: "High intensity urban development within a one-mile radius of rail corridor. Current agricultural lands are protected as further development is confined to corridor. All native forests within existing and planned fencing and management areas are protected.",
    },
    {
      label: "Pearl Harbor Development Scenario 3",
      descriptor: "High intensity urban development within a one-mile radius of rail corridor. Current agricultural lands are protected as further development is confined to corridor. Nearly all existing native forest is converted to non-native forest given a lack of protection.",
    },
    {
      label: "Pearl Harbor Development Scenario 4",
      descriptor: "Mid-intensity development sprawls across all agricultural lands (except those designated as Important Agricultural Lands). All native forest is protected.",
    },
    {
      label: "Pearl Harbor Development Scenario 5",
      descriptor: "Mid-intensity development sprawls across all agricultural lands (except those designated as Important Agricultural Lands). All native forests within existing and planned fencing and management areas are protected."
    },
    {
      label: "Pearl Harbor Development Scenario 6",
      descriptor: "Mid-intensity development sprawls across all agricultural lands (except those designated as Important Agricultural Lands). Nearly all existing native forest is converted to non-native forest given a lack of protection."
    }
    
  ];

  constructor(private planService: PlanService, private mapService: MapService, private arService: ArService) {
    this.scenario = this.scenarioDescriptors[0];
    this.vis = this.visDescriptors.lc;
  }

  ngOnInit() {
    this.planService.getScenarioObservable().subscribe((scenario: number) => {
      this.scenario = this.scenarioDescriptors[scenario];
    });
    this.planService.getVisObservable().subscribe((type: string) => {
      this.vis = this.visDescriptors[type];
    });
  }

  /** Changes the background color of a card when it is highlighted as the next
  * layer.  Checks to see if a layer is active.  If it is active, the color has
  * already been changed so no changes are done to that element.
  * @param layer => The layer that is highlighted
  */
  updateBackgroundColorActive(layer: MapLayer): void {
    this.cardStyle.forEach((e) => {
      const nameArray = e.element.nativeElement.id.split('-');
      const layerName = nameArray[2]; // Name of the layer associated with the element
      const color = (layerName === layer.name) ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,0.6)';
      const height = (layerName === layer.name) ? 100 + '%' : 80 + '%';
      e.setCardHeight(height);
      const singleLayer = _.filter(this.layers, layer => layerName === layer.name);
      if (!singleLayer[0].active) {
        e.changeBackgroundColor(color);
      }
    });
  }

}
