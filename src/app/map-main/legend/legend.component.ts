import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { MapLayer } from '@app/interfaces';
import { LegendDirective } from './legend.directive';
import { chartColors, mapLayerColors } from '../../../assets/plans/defaultColors';
import { _ } from 'underscore';
import { PlanService } from '@app/services/plan.service';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements AfterViewInit {

  layers: MapLayer[];
  width: number;
  private legendClass: string;

  @ViewChild("colors", null) colors;

  constructor(private mapdataservice: MapService, private planService: PlanService) {
    this.layers = this.mapdataservice.getLayers();
    this.legendClass = this.planService.getCurrentLegendLayout();
  }

  ngAfterViewInit() {
    this.planService.legendSubject.subscribe({
      next: value => {
        this.legendClass = value;
      }
    });

    let palette = this.USGSStyleRechargePalette();

    let html = "<div style='border-radius: 10px; color: white; background-color: black; width: 70px; padding: 10px;'>"
      + "<div>"
      + "Recharge"
      + "</div>";

      html += "<div style='align-items: center; display: flex; font-size: 12px;'>"
      + "<div style='padding-right: 5px; padding-top: 5px; padding-bottom: 7px;'>"
      + "<div style='height: 15px; width: 20px; background-color: "
      + palette.colors[palette.colors.length - 1]
      + "'></div>"
      + "</div>"
      + "<div style='align-items: center; display: flex; font-size: 12px;'>";
      html += "450";
      html += "+"
      + "</div>"
      + "</div>";

      html += "<div style='align-items: center; display: flex; font-size: 12px;'>"
      + "<div style='padding-right: 5px;'>"
      + "<div style='background-image: linear-gradient(to top, ";
      for(let i = palette.primaryRange[0]; i < palette.primaryRange[1]; i++) {
        html += palette.colors[i];
        if(i < palette.primaryRange[1] - 1) {
          html += ", ";
        }
      }
      html += "); height: 100px; width: 20px;'></div>"
      + "</div>"
      + "<div style='height: 120px; display: flex; flex-direction: column;'>"
      + "<div style='height: 100%;'>"
      + "180"
      + "</div>"
      + "<div>"
      + "0"
      + "</div>"
      + "</div>"
      + "</div>"
      + "<div style='font-size: 10px;'>"
      + "Inches per Year"
      + "</div>"
      + "</div>";

      this.colors.nativeElement.innerHTML = html;
  }

  private USGSStyleRechargePalette() {
    let colors = [[0.758,0.32,0.234],[0.887,0.539,0.117],[0.938,0.691,0.066],
    [0.965,0.828,0.039],[0.984,0.984,0],[0.578,0.938,0],
    [0.27,0.898,0],[0.043,0.855,0],[0.031,0.809,0.148],
    [0.063,0.766,0.273],[0.078,0.719,0.367],[0.098,0.688,0.43],
    [0.105,0.668,0.473],[0.109,0.648,0.496],[0.121,0.629,0.516],
    [0.121,0.609,0.535],[0.125,0.586,0.551],[0.125,0.586,0.57],
    [0.117,0.563,0.578],[0.109,0.523,0.566],[0.102,0.48,0.559],
    [0.094,0.449,0.547],[0.086,0.418,0.539],[0.078,0.395,0.527],
    [0.078,0.379,0.527],[0.074,0.348,0.52],[0.074,0.332,0.52],
    [0.066,0.309,0.508],[0.066,0.293,0.508],[0.059,0.273,0.5],
    [0.059,0.258,0.5],[0.055,0.234,0.488],[0.055,0.227,0.488],
    [0.047,0.207,0.477],[0.047,0.199,0.477],[0.047,0.191,0.477],
    [0.047,0.184,0.477]];

    let purple: [number, number, number] = [0.48,0.188,0.566];
    let hexColors = [];

    for(let i = 0; i < colors.length; i++) {
      hexColors.push("#ffffff");
    }
    let range = [0, 0];
    //this.rechargePaletteHeadLength = hexColors.length;
    range[0] = hexColors.length;

    colors.forEach((color: [number, number, number]) => {
      hexColors.push(this.rgbToHex(...color));
    });
    range[1] = hexColors.length
    //console.log(hexColors)

    let purpleTailScale = Math.floor((450 / 180 - 1) * colors.length);

    for(let i = 0; i < purpleTailScale; i++) {
      hexColors.push(hexColors[hexColors.length - 1]);
    }
    hexColors.push(this.rgbToHex(...purple));
    //this.rechargePaletteTailLength = purpleTailScale + 1;

    // console.log(hexColors.length);
    // console.log(colors.length);
    // console.log(hexColors.length / (450 + 180) * 180);

    //console.log(hexColors);
    return {
      colors: hexColors,
      primaryRange: range
    };
  }

  private rgbToHex(r: number, g: number, b: number) {
    let hexString = "#";
    let singleToHex = (value: number): string => {
      let adjustedValue = Math.round(value * 255);
      let hex = adjustedValue.toString(16);
      if(hex.length < 2) {
        hex = "0" + hex;
      }
      return hex;
    }
    hexString += singleToHex(r);
    hexString += singleToHex(g);
    hexString += singleToHex(b);

    return hexString;
  };



  /** Changes the background of a mini-card when that layer is either added or
   * removed from the map.
   * @param layer => The layer that was added or removed.
   */
  private getBackgroundColor(layer: MapLayer): string {
    return layer.legendColor;
  }

  /** Gets the correct width of the colored background.  Changes depending
   * on whether the legend is vertical or grid.
   * @param active => Is the layer card active or not
   */
  private getStyle(active: boolean): object {
    if (this.legendClass === 'vertical') {
      return active ? {
        width: '70px',
        height: '70px',
        left: '9px',
        marginTop: '0px'
      } : { width: '0px', height: '0px', left: '35px', marginTop: '35px' };
    } else if (this.legendClass === 'grid') {
      return active ? { width: '50%', height: '100%', left: '0px' } : { width: '0%', height: '0%', left: '0px' };
    }
  }
}
