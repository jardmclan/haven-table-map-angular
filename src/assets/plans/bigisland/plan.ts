import { Plan } from '@app/interfaces';
import { mapLayerColors, chartColors } from '../defaultColors';
import { PlanService } from '@app/services/plan.service';
import * as d3 from 'd3';

export const BigIslandPlan: Plan = {
  name: 'bigisland',
  displayName: 'Big Island',
  landingImagePath: 'assets/plans/bigisland/images/landing-image.jpg',
  secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/backgrounds/bigIsland.jpg',
  includeSecondScreen: false,
  selectedPlan: false,
  minYear: 2016,
  maxYear: 2045,
  scenarios: [
    {
      name: 'postapril',
      displayName: 'Post April',
    },
    {
      name: 'e3',
      displayName: 'E3'
    }
  ],
  data: {
    capacityPath: 'assets/plans/bigisland/data/capacity.csv',
    generationPath: 'assets/plans/bigisland/data/generation.csv',
    batteryPath: 'assets/plans/bigisland/data/battery.csv',
    colors: chartColors
  },
  css: {
    map: {
      left: '24.5vw',
      top: '5vh'
    },
    legend: {
      grid: {
        left: '27vw',
        top: '15vh',
        width: '21vw'
      },
      vertical: {
        left: '25vw',
        top: '11vh',
        width: '10vw'
      }
    },
    title: {
      left: '64vw',
      top: '82vh'
    },
    scenario: {
      left: '27vw',
      top: '6vh'
    },
    charts: {
      pie: {
        left: '27vw',
        top: '61vh'
      },
      line: {
        left: 'calc(100vw - 325px)',
        top: '0vh'
      }

    }
  },
  map: {
    scale: 0.26,
    width: 2179,
    height: 2479,
    bounds: [[-156.0618, 20.2696], [-154.8067, 18.9105]],
    baseMapPath: 'assets/plans/bigisland/images/base-map.png',
    mapLayers: [
      {
        name: 'transmission',
        displayName: 'Transmission Lines',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/transmission-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/transmission.jpg',
        secondScreenText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        fillColor: mapLayerColors.Transmission.fill,
        borderColor: mapLayerColors.Transmission.border,
        borderWidth: 0.04,
        legendColor: mapLayerColors.Transmission.border,
        filePath: 'assets/plans/bigisland/layers/transmission.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', this.fillColor)
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', (this.borderWidth * parcel.properties.Voltage_kV) + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('opacity', this.active ? 0.85 : 0.0);
          });
        },
      },
      {
        name: 'dod',
        displayName: 'Government Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/dod-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/dod.jpg',
        secondScreenText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        fillColor: mapLayerColors.Dod.fill,
        borderColor: mapLayerColors.Dod.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Dod.fill,
        filePath: 'assets/plans/bigisland/layers/government.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          const colors = {
            'Public-Federal': '#e60000',
            'Public-State': '#ff7f7f',
            'Public-State DHHL': '#895a44',
            'Public-County': '#00c5ff',
          }
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.type])
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', this.borderWidth + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('opacity', this.active ? 0.85 : 0.0);
          });
        },
      },
      {
        name: 'solar',
        displayName: 'Solar',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/solar-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/solar.jpg',
        secondScreenText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        fillColor: mapLayerColors.Solar.fill,
        borderColor: mapLayerColors.Solar.border,
        borderWidth: 0.5,
        legendColor: mapLayerColors.Solar.fill,
        filePath: 'assets/plans/bigisland/layers/solar.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          let solarTotal = planService.getGenerationTotalForCurrentYear(['PV']);
          this.parcels.sort((a, b) => parseFloat(b.properties.cf_1) - parseFloat(a.properties.cf_1));
          this.parcels.forEach(parcel => {
            if (solarTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
              solarTotal -= (parcel.properties.cf_1 * parcel.properties.capacity * 8760);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
            }
          });
        },
        updateFunction(planService: PlanService) {
          let solarTotal = planService.getGenerationTotalForCurrentYear(['PV']);
          console.log(solarTotal);
          this.parcels.forEach(parcel => {
            if (solarTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0);
              solarTotal -= (parcel.properties.cf_1 * parcel.properties.capacity * 8760);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0);
            }
          });
        },
      },
      {
        name: 'wind',
        displayName: 'Wind Energy',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/wind-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/wind.jpg',
        secondScreenText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        fillColor: mapLayerColors.Wind.fill,
        borderColor: mapLayerColors.Wind.border,
        borderWidth: .05,
        legendColor: mapLayerColors.Wind.fill,
        filePath: 'assets/plans/bigisland/layers/wind.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          let windTotal = planService.getCapacityTotalForCurrentYear(['Wind']);
          this.parcels.sort((a, b) => parseFloat(b.properties.MWac) - parseFloat(a.properties.MWac));
          this.parcels.forEach(parcel => {
            if (windTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
              windTotal -= (parcel.properties.MWac * 0.2283 * 8760);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0)
                .style('stroke', this.borderColor)
                .style('stroke-width', this.borderWidth + 'px');
            }
          });
        },
        updateFunction(planService: PlanService) {
          let windTotal = planService.getGenerationTotalForCurrentYear(['Wind']);
          this.parcels.forEach(parcel => {
            if (windTotal > 0) {
              d3.select(parcel.path)
                .style('fill', this.fillColor)
                .style('opacity', (this.active) ? 0.85 : 0.0);
              windTotal -= (parcel.properties.MWac * 0.2283 * 8760);
            } else {
              d3.select(parcel.path)
                .style('fill', 'transparent')
                .style('opacity', (this.active) ? 0.85 : 0.0);
            }
          });
        },
      },
      {
        name: 'agriculture',
        displayName: 'Ag Lands',
        active: false,
        included: true,
        iconPath: 'assets/plans/bigisland/images/icons/agriculture-icon.png',
        secondScreenImagePath: 'assets/plans/bigisland/images/second-screen-images/layer-images/agriculture.jpg',
        secondScreenText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        fillColor: mapLayerColors.Agriculture.fill,
        borderColor: mapLayerColors.Agriculture.border,
        borderWidth: 1,
        legendColor: mapLayerColors.Agriculture.fill,
        filePath: 'assets/plans/bigisland/layers/agriculture.json',
        parcels: [],
        setupFunction(planService: PlanService) {
          const colors = {
            A: '#267300' + 'aa',
            B: '#4ce600' + 'aa',
            C: '#ffaa00' + 'aa',
            D: '#a87000' + 'aa',
            E: '#895a44' + 'aa',
          }
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('fill', colors[parcel.properties.type])
              .style('opacity', this.active ? 0.85 : 0.0)
              .style('stroke', this.borderColor)
              .style('stroke-width', this.borderWidth + 'px');
          });
        },
        updateFunction(planService: PlanService) {
          this.parcels.forEach(parcel => {
            d3.select(parcel.path)
              .style('opacity', this.active ? 0.85 : 0.0);
          });
        },
      }
    ],
  }
}
