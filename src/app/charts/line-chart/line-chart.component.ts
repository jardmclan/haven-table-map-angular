import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { PlanService } from '@app/services/plan.service';

import { Scenario } from '@app/interfaces';

import { chartColors } from '../../../assets/plans/defaultColors';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {

  @ViewChild('lineDiv', { static: true }) chartDiv: ElementRef;
  ctx: any;
  myChart: any;

  capacityData: any;
  scenario: number;
  year: number;

  data: any;
  labels: any;
  chartMax: number;

  ikeData: BarData;

 

  constructor(private planService: PlanService) { }

  ngOnInit() {

    this.scenario = 0;
    // this.year = this.planService.getCurrentYear();
    // this.fetchData();

    this.planService.getScenarioObservable().subscribe((scenario: number) => {
      this.updateScenario(scenario);
    });

    // this.planService.yearSubject.subscribe(year => {
    //   if (year) {
    //     this.updateYear(year);
    //   }
    // });

    this.ikeData = {
      baseline: 659.28,
      current: [659.28, 656.11, 649.19, 646.60, 654.15, 647.29, 644.70]
    }
    this.createChart();
  }

  // fetchData() {
  //   this.planService.getCapacityData().then(capData => {
  //     this.capacityData = capData;
  //     this.data = {};
  //     this.data.capacity = {};
  //     const valueArray = [];
  //     Object.keys(this.capacityData).forEach(scenario => {
  //       this.data.capacity[scenario] = {};
  //       this.data.capacity[scenario].labels = [];
  //       this.data.capacity[scenario].datasets = [];

  //       Object.keys(this.capacityData[scenario]).forEach(tech => {
  //         const dataset = {
  //           label: tech,
  //           backgroundColor: chartColors[tech],
  //           borderColor: chartColors[tech],
  //           pointRadius: 0,
  //           fill: false,
  //           data: [],
  //         };
  //         Object.keys(this.capacityData[scenario][tech]).forEach(el => {
  //           const year = this.capacityData[scenario][tech][el].year;
  //           const value = this.capacityData[scenario][tech][el].value;
  //           this.data.capacity[scenario].labels.push(year);
  //           dataset.data.push(value);
  //           valueArray.push(value);
  //         });
  //         this.data.capacity[scenario].datasets.push(dataset);
  //       });
  //       this.data.capacity[scenario].labels = [...new Set(this.data.capacity[scenario].labels)];
  //     });
  //     this.chartMax = Math.ceil(Math.max(...valueArray) / 100) * 100;
  //     this.createChart();
  //   });

  // }

  createChart() {
    const labels = ["Baseline", "This Scenario"];
    const data = [this.ikeData.baseline, this.ikeData.current[this.scenario]];
    this.createBarChart(labels, data);
  }

  createBarChart(labels: any[], data: any[]) {
    this.ctx = this.chartDiv.nativeElement.getContext('2d');
    this.myChart = new Chart(this.ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [{
          label: "Million Gallons Per Day",
          backgroundColor: ["#fc8d62", "#66c2a5"],
          data: data
        }]
      },
      options: {
        legend: {
          display: false
        },
        // title: {
        //   display: true,
        //   text: 'Groundwater Recharge (Million Gallons Per Day)'
        // },
        // scales: {
        //   yAxes: [{
        //     ticks: {
        //       suggestedMin: 600,
        //       suggestedMax: 700
        //     }
        //   }]
        // }
        scales: {
          xAxes: [{
            display: true,
            gridLines: {
              display: false,
              color: '#FFFFFF',
            },
            ticks: {
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: 'white',
            }
          }],
          yAxes: [{
            display: true,
            gridLines: {
              display: false,
              color: '#FFFFFF',
            },
            ticks: {
              fontSize: 12,
              fontStyle: 'bold',
              fontColor: 'white',
              min: 600,
              max: 700
            },
            scaleLabel: {
              display: true,
              fontSize: 14,
              fontStyle: 'bold',
              fontColor: '#FFFFFF',
              labelString: 'Recharge (Million Gallons Per Day)'
            }
          }]
        }
      }
    });

    // this.ctx.textAlign = 'center';
    // this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
    // this.ctx.textBaseline = 'bottom';

    // this.data.datasets.forEach(function (dataset, i) {
    //     var meta = this.myChart.controller.getDatasetMeta(i);
    //     meta.data.forEach(function (bar, index) {
    //         var data = dataset.data[index];
    //         this.ctx.fillText(data, bar._model.x, bar._model.y - 5);
    //     });
    // });
    console.log(this.myChart);
  }



  updateScenario(scenario: number) {
    //console.log(this.myChart.data);
    this.scenario = scenario;
    this.myChart.data.datasets[0].data = [this.ikeData.baseline, this.ikeData.current[this.scenario]];
    this.myChart.update();
  }

}

interface BarData {
  baseline: number,
  current: number[]
}

