import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart-campaign',
  templateUrl: './chart-campaign.component.html',
  styleUrls: ['./chart-campaign.component.scss']
})
export class ChartCampaignComponent implements OnChanges {
  Highcharts: typeof Highcharts = Highcharts;

  @Input() categories: string[] = [];
  @Input() openRate: number[] = [];
  @Input() ctr: number[] = [];
  @Input() bounceRate: number[] = [];

  chartOptions: Highcharts.Options = {};

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChart();
  }

  updateChart(): void {
    this.chartOptions = {
      chart: {
        type: 'column',
        backgroundColor: '#fff',
      },
      title: {
        text: '',
        style: { color: '#ccc' }
      },
      xAxis: {
        categories: this.categories,
        labels: {
          style: {
            color: '#ccc'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Emails mandate',
          style: { color: '#ccc' }
        },
        labels: {
          style: {
            color: '#ccc'
          }
        }
      },
      legend: {
        itemStyle: {
          color: '#ccc'
        }
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: [
        {
          name: 'Bounce rate',
          type: 'column',
          data: this.bounceRate,
          color: '#EAECF0'
        },
        {
          name: 'CTR',
          type: 'column',
          data: this.ctr,
          color: 'rgb(70, 193, 113)'
        },
        {
          name: 'Open rate',
          type: 'column',
          data: this.openRate,
          color: 'rgb(72, 102, 252)'
        }
      ]
    };
  }
}
