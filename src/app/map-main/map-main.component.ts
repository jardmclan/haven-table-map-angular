import { Component, OnInit, HostListener } from '@angular/core';
import { MapDataService } from '../services/map-data.service';
import { ArService } from '../services/ar.service';
import { WindowRefService } from '../services/window-ref.service';
import { Island } from '../interfaces/island';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map-main',
  templateUrl: './map-main.component.html',
  styleUrls: ['./map-main.component.css']
})

/** Represents the main display of the table.  Contains the interaction components
* And the display components of the table. */
export class MapMainComponent implements OnInit {

  island: Island;

  constructor(
    private _arservice: ArService,
    private _mapdataservice: MapDataService,
    private router: Router,
    private _windowrefservice: WindowRefService) {

    this.island = this._mapdataservice.getSelectedIsland();
  }

  ngOnInit() {
  }

  /**
  * This function gets the css class name to apply to the legend based
  * on the map that is selected.
  * @return the name of the css class
  */
  getIslandName(): string {
    return this.island.islandName;
  }

  /** KEYBOARD CONTROLS **/
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this._mapdataservice.incrementCurrentYear();
    } else if (event.key === 'ArrowLeft') {
      this._mapdataservice.decrementCurrentYear();
    } else if (event.key === 'ArrowUp') {
      this._mapdataservice.incrementNextLayer();
    } else if (event.key === 'ArrowDown') {
      this._mapdataservice.decrementNextLayer();
    } else if (event.key === 'Enter') {
      this._mapdataservice.addRemoveLayer();
    } else if (event.key === 'p') {
      this.router.navigateByUrl('');
      this._mapdataservice.setState('landing');
      this._windowrefservice.closeSecondScreen();
    } else if (event.key === 'r') {
      this._mapdataservice.resetMap();
    } else if (event.key === 'a') {
      this._mapdataservice.incrementChart();
    } else if (event.key === 's') {
      this._mapdataservice.decrementChart();
    } else if (event.key === 'q') {
      this._mapdataservice.incrementScenario();
    } else if (event.key === 'w') {
      this._mapdataservice.decrementScenario();
    } 
  }

  /** Handles the mouse down over elements on the screen.  These elements can be
   * dragged and dropped to different locations on the screen (at this point).
   */
  private handleMouseDown(target: any) {
    console.log(target);
  }
}
