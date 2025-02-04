import { Map } from './map';
import { Scenario } from './scenario';

export interface Plan {
  name: string;
  displayName: string;
  landingImagePath: string;
  secondScreenImagePath: string;
  includeSecondScreen: boolean;
  selectedPlan: boolean;
  minYear: number;
  maxYear: number;
  scenarios: Scenario[];
  css: {
    map: {
      top: string;
      left: string;
    }
    legend: {
      grid: {
        top: string;
        left: string;
        width: string;
      },
      vertical: {
        top: string;
        left: string;
        width: string;
      }
    }
    title: {
      top: string;
      left: string;
    }
    scenario: {
      top: string;
      left: string;
    }
    charts: {
      pie: {
        top: string;
        left: string;
      }
      line: {
        top: string;
        left: string;
      }
    }
  }
  data: {
    capacityPath: string;
    generationPath: string;
    batteryPath: string;
    colors: object;
  };
  map: Map;
}
