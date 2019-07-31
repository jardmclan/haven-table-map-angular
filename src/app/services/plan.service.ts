import { Injectable } from '@angular/core';
import { _ } from 'underscore';

import { Plan } from '@app/interfaces/plan';

import { Plans } from '../../assets/plans/plans';
import { Scenario } from '@app/interfaces';
import { SoundsService } from './sounds.service';
import { Subject, Observable } from 'rxjs';

import * as d3 from 'd3/d3.min';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private static MAX_SCENARIOS = 7;

  private state: string;  // Current state of the machine

  private plans: Plan[];
  private currentPlan: Plan;
  public planSubject = new Subject<Plan>();

  private scenarios: Scenario[];
  private currentScenario: Scenario;
  public scenarioSubject = new Subject<Scenario>();

  private currentYear: number;
  public yearSubject = new Subject<number>();

  private capacityData = {};
  private generationData = {};

  private legendLayouts: string[] = [];
  private currentLegendLayout: number;
  public legendSubject = new Subject<string>();


  private scenario: number;
  private scenarioNumSubject: Subject<number>;

  private visState: {
    index: number,
    values: string[]
  }
  private visSubject: Subject<string>;

  constructor(private soundsService: SoundsService) {
    this.plans = Plans;
    this.state = 'landing';
    this.legendLayouts = ['grid', 'vertical'];
    this.currentLegendLayout = 0;
    this.scenarioNumSubject = new Subject<number>();
    this.visSubject = new Subject<string>();
  }

  public getScenarioObservable(): Observable<number> {
    return this.scenarioNumSubject.asObservable();
  }

  public getVisObservable(): Observable<string> {
    return this.visSubject.asObservable();
  }

  public setupSelectedPlan(plan: Plan) {
    this.currentPlan = plan;
    this.currentYear = this.currentPlan.minYear;
    this.scenarios = this.currentPlan.scenarios;
    this.currentScenario = this.scenarios[0];
    this.planSubject.next(this.currentPlan);
    this.yearSubject.next(this.currentYear);
    this.scenarioSubject.next(this.currentScenario);
    this.getCapacityData();
    this.getCapacityData();

    //just hard code here for now, can set upo config stuff later
    this.scenario = 0;
    this.visState = {
      index: 0,
      values: ["lc", "rc"]
    };
    this.visSubject.next(this.visState.values[this.visState.index]);
    this.scenarioSubject.next(this.currentScenario);
  }

  public getGenerationTotalForCurrentYear(technologies: string[]): number {
    let generationTotal = 0;
    // technologies.forEach(tech => {
    //   this.generationData[this.currentScenario.name][tech].forEach(el => {
    //     if (el.year === this.currentYear) {
    //       generationTotal += el.value;
    //     }
    //   });
    // });
    return generationTotal;
  }

  public getCapacityTotalForCurrentYear(technologies: string[]): number {
    let capacityTotal = 0;
    technologies.forEach(tech => {
      this.capacityData[this.currentScenario.name][tech].forEach(el => {
        if (el.year === this.currentYear) {
          capacityTotal += el.value;
        }
      });
    });
    return capacityTotal;
  }

  public getGenerationData(): Promise<any> {
    this.generationData = {};
    return new Promise((resolve, error) => {
      d3.csv(this.currentPlan.data.generationPath, (data) => {
        data.forEach(element => {
          const year = element.year;
          const technology = element.technology;
          const value = element.value;
          const scenario = element.scenario;
          if (!this.generationData.hasOwnProperty(scenario)) {
            this.generationData[scenario] = {};
          }
          if (!this.generationData[scenario].hasOwnProperty(technology)) {
            this.generationData[scenario][technology] = [];
          }
          this.generationData[scenario][technology].push({ year: Number(year), value: Number(value) });
        });
        return resolve(this.generationData);
      });

    });

  }

  public getCapacityData(): Promise<any> {
    return new Promise((resolve, error) => {
      this.capacityData = {};
      d3.csv(this.currentPlan.data.capacityPath, (data) => {
        console.log(data);
        data.forEach(element => {
          const year = element.year;
          const technology = element.technology;
          const value = element.value;
          const scenario = element.scenario;
          if (!this.capacityData.hasOwnProperty(scenario)) {
            this.capacityData[scenario] = {};
          }
          if (!this.capacityData[scenario].hasOwnProperty(technology)) {
            this.capacityData[scenario][technology] = [];
          }
          this.capacityData[scenario][technology].push({ year: Number(year), value: Number(value) });
        });
        return resolve(this.capacityData);

      });
    });
  }



  public getCurrentPlan(): Plan {
    return this.currentPlan;
  }

  public getPlans(): Plan[] {
    return this.plans;
  }

  public getCurrentYear(): number {
    return this.currentYear;
  }

  public incrementCurrentYear(): void {
    try {
      if (this.currentYear < this.currentPlan.maxYear) {
        this.currentYear++;
        this.soundsService.click();
      }
      this.yearSubject.next(this.currentYear);
    } catch (error) {
      // Catch error when setting up
    }
  }

  public decrementCurrentYear(): void {
    try {
      if (this.currentYear > this.currentPlan.minYear) {
        this.currentYear--;
        this.soundsService.click();
      }
      this.yearSubject.next(this.currentYear);
    } catch (error) {
      // catch error when setting up
    }

  }

  public setCurrentYear(year): void {
    if (year >= this.currentPlan.minYear && year <= this.currentPlan.maxYear) {
      this.currentYear = year;
    }
    this.yearSubject.next(this.currentYear);
  }

  public getCurrentScenario(): Scenario {
    return this.currentScenario;
  }

  public getScenarios(): Scenario[] {
    return this.scenarios;
  }

  public incrementScenario(): void {
    const index = this.scenarios.indexOf(this.currentScenario) + 1;
    this.currentScenario = this.scenarios[(index) % this.scenarios.length];
    this.scenarioSubject.next(this.currentScenario);
    this.soundsService.tick();
  }

  public decrementScenario(): void {
    let index = this.scenarios.indexOf(this.currentScenario) - 1;
    if (index === -1) {
      index = this.scenarios.length - 1;
    }
    this.currentScenario = this.scenarios[(index) % this.scenarios.length];
    this.scenarioSubject.next(this.currentScenario);
    this.soundsService.tick();
  }


  public changeScenario(delta: number) {
    this.scenario = this.positiveMod(this.scenario + delta, PlanService.MAX_SCENARIOS);
    this.scenarioNumSubject.next(this.scenario);
    this.soundsService.tick();
  }

  public changeVis(delta: number) {
    this.visState.index = this.positiveMod(this.visState.index + delta, this.visState.values.length);
    this.visSubject.next(this.visState.values[this.visState.index]);
    this.soundsService.tick();
  }

  public setData() {

  }

  private positiveMod(n, m) {
    let value;
    if(n < 0) {
      let p = -n;
      value = p % m;
      value = m - value;
    }
    else {
      value = n % m;
    }
    return value;
  }


  public setState(state): void {
    this.state = state;
    if (this.state === 'landing') {
      this.resetPlan();
    }
  }

  public getState(): string {
    return this.state;
  }

  public resetPlan() {
    this.currentPlan = null;
    this.currentYear = null;
    this.scenarios = null;
    this.currentScenario = null;
    this.planSubject.next(this.currentPlan);
    this.yearSubject.next(this.currentYear);
    this.scenarioSubject.next(this.currentScenario);
  }

  /** Gets the class name of the correct legend css to display.
   * @return the current legend classname
   */
  public getCurrentLegendLayout(): string {
    return this.legendLayouts[this.currentLegendLayout];
  }

  /** Cycles to the next legend css classname.
   * @return the current css class name.
   */
  public changeCurrentLegendLayout() {
    this.currentLegendLayout = (this.currentLegendLayout + 1) % this.legendLayouts.length;
    this.legendSubject.next(this.getCurrentLegendLayout());
  }

}
