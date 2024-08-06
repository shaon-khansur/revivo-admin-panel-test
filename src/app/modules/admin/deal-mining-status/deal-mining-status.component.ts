import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MiningStatusService } from './service/mining-status.service';

@Component({
    selector: 'app-deal-mining-status',
    standalone: true,
    imports: [CommonModule, NgApexchartsModule],
    templateUrl: './deal-mining-status.component.html',
    styleUrls: ['./deal-mining-status.component.scss'],
})
export class DealMiningStatusComponent implements OnInit {
    todayTotalSum: number;
    prevTotalSum: number;
    prev2TotalSum: number;
    chartOptions: any;
    chartOptionsPrev: any;
    chartOptionsPrev2: any;
    progressBarChartOptions: any;
    progressBarChartOptionsPrev: any;
    progressBarChartOptionsPrev2: any;
    miningdata: any[];
    isLoading: boolean = true;
    statusTiming: any[] = [];
    lastFullMiningTimes: { [key: number]: string } = {};

    constructor(
        private miningService: MiningStatusService,
        private cdr: ChangeDetectorRef
    ) {
        this.chartOptions = this.getInitialChartOptions();
        this.chartOptionsPrev = this.getInitialChartOptions();
        this.chartOptionsPrev2 = this.getInitialChartOptions();
        this.progressBarChartOptions = this.getInitialProgressBarOptions();
        this.progressBarChartOptionsPrev = this.getInitialProgressBarOptions();
        this.progressBarChartOptionsPrev2 = this.getInitialProgressBarOptions();
    }

   setLastFullMiningTimes(): void {
        this.lastFullMiningTimes = this.statusTiming.reduce((acc, entry) => {
            const date = new Date(entry.today).getDate();
            if (entry.today === new Date().toISOString().split('T')[0]) {
                acc[0] = entry.time;
            } else if (entry.today === new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split('T')[0]) {
                acc[1] = entry.time;
            } else if (entry.today === new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0]) {
                acc[2] = entry.time;
            }
            return acc;
        }, {} as { [key: number]: string });
    }

    ngOnInit(): void {
        this.loadMiningData();
        this.loadStatusTiming();
    }

    private loadMiningData(): void {
        this.miningService.getMiningStatus().subscribe({
            next: (response) => {
                this.isLoading = false;
                this.miningdata = response.sort((a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                );

                this.processDataForDate(0, this.chartOptions, this.progressBarChartOptions, 'Todays Deal Mining Report.');
                this.processDataForDate(1, this.chartOptionsPrev, this.progressBarChartOptionsPrev, 'Deal Mining Report from the Previous Day.');
                this.processDataForDate(2, this.chartOptionsPrev2, this.progressBarChartOptionsPrev2, 'Deal Mining Report from the Day Before Yesterday');

                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Failed to fetch mining data', err);
                this.isLoading = false;
                // Optionally, you could display a user-friendly error message here
            },
        });
    }

    private loadStatusTiming(): void {
        this.miningService.getStatusTiming().subscribe({
            next: (response) => {
                this.statusTiming = response;
                this.setLastFullMiningTimes();
            },
            error: (err) => {
                console.error('Failed to fetch status timing', err);
                this.isLoading = false;
                // Optionally, you could display a user-friendly error message here
            },
        });
    }

    private processDataForDate(daysAgo: number, chartOptions: any, progressBarOptions: any, titleText: string): void {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - daysAgo);
        const targetDateString = targetDate.toISOString().split('T')[0];

        const filteredData = this.miningdata.filter(item => item?.today === targetDateString);
        const counts = filteredData.map(item => item?.count || 0);
        const dates = filteredData.map(item => item?.date);

        const totalSum = counts.reduce((sum, count) => sum + count, 0);
        chartOptions.series[0].data = counts;
        chartOptions.xaxis.categories = dates;
        chartOptions.title.text = titleText;
        chartOptions.subtitle.text = `Total mining ${totalSum}`;

        // Find matching statusTiming entry
        const statusEntry = this.statusTiming.find(entry => entry.today === targetDateString);
        if (statusEntry) {
            progressBarOptions.series = [statusEntry.progress ?? 0];
            progressBarOptions.labels = [`${statusEntry.miningTimes} times`];
        } else {
            progressBarOptions.series = [0];
            progressBarOptions.labels = ['0 times'];
        }

        if (daysAgo === 0) this.todayTotalSum = totalSum;
        else if (daysAgo === 1) this.prevTotalSum = totalSum;
        else if (daysAgo === 2) this.prev2TotalSum = totalSum;
    }

    private getInitialChartOptions() {
        return {
            series: [{ name: 'mined', data: [] }],
            chart: {
                height: 350,
                type: 'bar',
                zoom: {
                    enabled: true,
                    type: 'x',
                    autoScaleYaxis: false,
                    zoomedArea: {
                        fill: {
                            color: '#90CAF9',
                            opacity: 0.4,
                        },
                        stroke: {
                            color: '#0D47A1',
                            opacity: 0.4,
                            width: 1,
                        },
                    },
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                },
            },
            xaxis: {
                categories: [],
            },
            fill: {
                colors: ['#0082FF'],
            },
            dataLabels: {
                enabled: false,
            },
            title: {
                text: '',
            },
            subtitle: {
                text: '',
            },
        };
    }

    private getInitialProgressBarOptions() {
        return {
            chart: {
                height: 220,
                type: 'radialBar',
            },
            series: [],
            plotOptions: {
                radialBar: {
                    hollow: {
                        margin: 0,
                        size: '60%',
                        background: '#293450',
                    },
                    track: {
                        dropShadow: {
                            enabled: true,
                            top: 2,
                            left: 0,
                            blur: 4,
                            opacity: 0.15,
                        },
                    },
                    dataLabels: {
                        name: {
                            offsetY: -10,
                            color: '#fff',
                            fontSize: '13px',
                        },
                        value: {
                            color: '#fff',
                            fontSize: '20px',
                            show: true,
                        },
                    },
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'vertical',
                    gradientToColors: ['#87D4F9'],
                    stops: [0, 100],
                },
            },
            stroke: {
                lineCap: 'round',
            },
            labels: ['Progress'],
        };
    }
}
