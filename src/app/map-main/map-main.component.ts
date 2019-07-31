import { Component, AfterViewInit, HostListener, ViewChild } from '@angular/core';
import { MapService } from '../services/map.service';
import { WindowRefService } from '../services/window-ref.service';
import { ArService } from '../services/ar.service';
import { Router } from '@angular/router';
import { Plan } from '@app/interfaces';
import { PlanService } from '@app/services/plan.service';
import { AddRemoveLayersComponent } from './interaction-element/add-remove-layers/add-remove-layers.component';
import { ProjectableMarker } from '@app/classes/projectableMarker';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css']
})

/** Represents the main display of the table.  Contains the interaction components
 * And the display components of the table.
 */
export class MapMainComponent implements AfterViewInit {

  @ViewChild('trackingDotYear', { static: false }) trackingDotYear;
  @ViewChild('trackingDotLayer', { static: false }) trackingDotLayer;
  @ViewChild('trackingDotScenario', { static: false }) trackingDotScenario;

  plan: Plan;
  private top: string;
  private left: string;
  private width: string;
  private legendClass: string;
  private currentYear: number;
  private nextLayer: string;
  trackingDots: any[] = [];
  private currentScenario: string;

  private hideRechargeLegend: boolean;

  constructor(
    private planService: PlanService,
    private mapService: MapService,
    private arService: ArService,
    private router: Router,
    private windowRefService: WindowRefService) {
    this.plan = this.planService.getCurrentPlan();
    this.legendClass = this.planService.getCurrentLegendLayout();
    this.currentYear = 2016;
    this.currentScenario = this.planService.getCurrentScenario().displayName;

    // If no plan has been selected, route back to setup
    if (this.plan == null) {
      this.router.navigateByUrl('');
      this.planService.setState('landing');
      console.log('No Plan Found --> Route to setup');
    }

    this.top = this.plan.css.legend[this.legendClass].top;
    this.left = this.plan.css.legend[this.legendClass].left;
    this.width = this.plan.css.legend[this.legendClass].width;

  }

  ngAfterViewInit() {
    this.trackingDots = [this.trackingDotYear, this.trackingDotLayer, this.trackingDotScenario];
    console.log(this.trackingDots);
    this.planService.legendSubject.subscribe({
      next: value => {
        this.top = this.plan.css.legend[value].top;
        this.left = this.plan.css.legend[value].left;
        this.width = this.plan.css.legend[value].width;
      }
    });
    this.hideRechargeLegend = true;
    this.planService.getVisObservable().subscribe((type: string) => {
      this.hideRechargeLegend = type != "rc";
    });

    // Push Year Data to Second Screen
    this.planService.yearSubject.subscribe({
      next: value => {
        this.windowRefService.notifySecondScreen(JSON.stringify(
          {
            type: 'year',
            year: value
          }));
        this.currentYear = value;
      }
    });

    // Push Year Data to Second Screen
    this.mapService.selectedLayerSubject.subscribe({
      next: value => {
        this.windowRefService.notifySecondScreen(JSON.stringify(
          {
            type: 'layer',
            name: value.name
          }));
          this.nextLayer = value.displayName;
      }
    });

    this.arService.trackingSubject.subscribe({
      next: value => {
        this.trackingDots.forEach(dot => dot.nativeElement.style.opacity = 0);
        value.forEach(marker => this.track(marker));
      }
    });

    this.planService.scenarioSubject.subscribe(scenario => this.currentScenario = scenario.displayName);
  }

  private track(marker: ProjectableMarker) {
    try {
      const dataPoint = this.arService.track(marker.getCenterX(), marker.getCenterY());

      switch (marker.getJob()) {
        case 'year':
          this.trackingDotYear.nativeElement.style.opacity = 1;
          this.trackingDotYear.nativeElement.style.left = dataPoint.x + 25 + 'px';
          this.trackingDotYear.nativeElement.style.top = dataPoint.y + 25 + 'px';
          break;
        case 'layer':
          this.trackingDotLayer.nativeElement.style.opacity = 1;
          this.trackingDotLayer.nativeElement.style.left = dataPoint.x + 25 + 'px';
          this.trackingDotLayer.nativeElement.style.top = dataPoint.y + 25 + 'px';
          break;
          case 'scenario':
          this.trackingDotScenario.nativeElement.style.opacity = 1;
          this.trackingDotScenario.nativeElement.style.left = dataPoint.x + 25 + 'px';
          this.trackingDotScenario.nativeElement.style.top = dataPoint.y + 25 + 'px';
          break;

      }

    } catch (error) {
      //undefined marker
    }
  }
  /**
   * This function gets the css class name to apply to the legend based
   * on the map that is selected.
   * @return the name of the css class
   */
  private getIslandName(): string {
    return this.plan.name;
  }

  /* KEYBOARD CONTROLS */
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.planService.changeScenario(1);
    }
    else if (event.key === 'ArrowLeft') {
      this.planService.changeScenario(-1);
    }
    else if (event.key === 'ArrowUp') {
      this.planService.changeVis(1);
    }
    else if (event.key === 'ArrowDown') {
      this.planService.changeVis(-1);
    }

    //mapservice
    



    // else if (event.key === 'Enter') {
    //   this.mapService.addRemoveLayer();
    // } else if (event.key === 'p') {
    //   this.router.navigateByUrl('');
    //   this.planService.setState('landing');
    //   this.windowRefService.closeSecondScreen();
    // } else if (event.key === 'r') {
    //   this.mapService.resetMap();
    // } else if (event.key === 'a') {
    //   // this.chartService.incrementChart();
    // } else if (event.key === 's') {
    //   // this.chartService.decrementChart();
    // } else if (event.key === 'q') {
    //   this.planService.incrementScenario();
    // } else if (event.key === 'w') {
    //   this.planService.decrementScenario();
    // } else if (event.key === 'l') {
    //   this.planService.changeCurrentLegendLayout();
    // } else if (event.key === 'f') {
    //   console.log('second => ' + this.windowRefService.secondScreenExists());
    // }
  }
}
