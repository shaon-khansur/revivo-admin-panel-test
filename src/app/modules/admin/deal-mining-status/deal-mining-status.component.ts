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
    chartOptions: any = {
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
    chartOptionsPrev: any = {
        series: [{ name: 'mined', data: [] }],
        chart: {
            height: 350,
            type: 'bar',
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
    chartOptionsPrev2: any = {
        series: [{ name: 'mined', data: [] }],
        chart: {
            height: 350,
            type: 'bar',
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

    progressBarChartOptions = {
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
    progressBarChartOptionsPrev = {
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
    progressBarChartOptionsPrev2 = {
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
    miningdata: any;
    isLoading: boolean = true;

    constructor(
        private miningService: MiningStatusService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.miningService.getMiningStatus().subscribe({
            next: (response) => {
                this.isLoading = false;
                this.miningdata = response.sort((a, b) => {
                    // Assuming response contains a date field named "date"
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return dateA - dateB;
                })

                // today's total sum and data

                const targetDate = new Date().toISOString().split('T')[0];
                const filteredData = this.miningdata.filter(
                    (item: any) => item?.today === targetDate
                );

                const counts = filteredData.map((item: any) => item?.count);
                const dates = filteredData.map((item: any) => item?.date);

                const totalTodaySum = counts.reduce(
                    (sum, count) => sum + (count || 0),
                    0
                );
                this.todayTotalSum = totalTodaySum;

                counts.forEach((count) => {
                    this.chartOptions.series[0].data.push(count);
                });
                dates.forEach((date) => {
                    this.chartOptions.xaxis.categories.push(date);
                });


                // yesterday total sum and data

                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() - 1);
                const targetDatePrev = currentDate.toISOString().split('T')[0];

                const filteredDataPrev = this.miningdata.filter(
                    (item: any) => item?.today === targetDatePrev
                );
                const countsPrev = filteredDataPrev.map(
                    (item: any) => item?.count
                );
                const datesPrev = filteredDataPrev.map(
                    (item: any) => item?.date
                );

                const totalPrevSum = countsPrev.reduce(
                    (sum, count) => sum + (count || 0),
                    0
                );
                this.prevTotalSum = totalPrevSum;

                countsPrev.forEach((count) => {
                    this.chartOptionsPrev.series[0].data.push(count);
                });
                datesPrev.forEach((date) => {
                    this.chartOptionsPrev.xaxis.categories.push(date);
                });


                // the day before yesterday total sum and data

                const currentDate2 = new Date();
                currentDate2.setDate(currentDate2.getDate() - 2);
                const targetDatePrev2 = currentDate2
                    .toISOString()
                    .split('T')[0];

                const filteredDataPrev2 = this.miningdata.filter(
                    (item: any) => item?.today === targetDatePrev2
                );
                const countsPrev2 = filteredDataPrev2.map(
                    (item: any) => item?.count
                );
                const datesPrev2 = filteredDataPrev2.map(
                    (item: any) => item?.date
                );

                const totalPrev2Sum = countsPrev2.reduce(
                    (sum, count) => sum + (count || 0),
                    0
                );
                this.prev2TotalSum = totalPrev2Sum;

                countsPrev2.forEach((count) => {
                    this.chartOptionsPrev2.series[0].data.push(count);
                });
                datesPrev2.forEach((date) => {
                    this.chartOptionsPrev2.xaxis.categories.push(date);
                });

                // chart title ans subtitle

                this.chartOptions.title.text = 'Todays Deal Mining Report.';
                this.chartOptions.subtitle.text = `Total mining ${this.todayTotalSum}`;

                this.chartOptionsPrev.title.text =
                    'Deal Mining Report from the Previous Day.';
                this.chartOptionsPrev.subtitle.text = `Total mining ${this.prevTotalSum}`;

                this.chartOptionsPrev2.title.text =
                    'Deal Mining Report from the Day Before Yesterday';
                this.chartOptionsPrev2.subtitle.text = `Total mining ${this.prev2TotalSum}`;

                // Today's progress

                const todayTotalDeals = this.miningdata.filter(
                    (item: any) =>
                        item?.today === targetDate
                ).length;
                
                const todaySuccessfulDeals = this.miningdata.filter(
                    (item: any) =>
                        item?.today === targetDate && item?.status === true 
                ).length;
                const todaySuccessPercentage = todayTotalDeals > 0 ? (todaySuccessfulDeals / todayTotalDeals) * 100 : 0;
                this.progressBarChartOptions.series = [todaySuccessPercentage.toFixed(2)];

                

                // yesterday progress
                const currentDateProgPrev = new Date();
                currentDateProgPrev.setDate(currentDateProgPrev.getDate() - 1);
                const targetDatePrevProg = currentDateProgPrev
                    .toISOString()
                    .split('T')[0];
                    

                const previousDayTotalDeals = this.miningdata.filter(
                    (item: any) =>
                        item?.today === targetDatePrevProg
                ).length;
                console.log(previousDayTotalDeals);

                const previousDaySuccessfulDeals = this.miningdata.filter(
                    (item: any) =>
                        item?.today === targetDatePrevProg && item?.status === true
                ).length;
                console.log(previousDaySuccessfulDeals);


                const previousSuccessPercentage = previousDayTotalDeals > 0 ? (previousDaySuccessfulDeals / previousDayTotalDeals) * 100 : 0;
                
                
                this.progressBarChartOptionsPrev.series = [previousSuccessPercentage.toFixed(2)];

                // the day before yesterday progress
                const currentDateProgPrev2 = new Date();
                currentDateProgPrev2.setDate(currentDateProgPrev2.getDate() - 2);
                const targetDatePrevProg2 = currentDateProgPrev2
                    .toISOString()
                    .split('T')[0];
                    

                const previousDayTotalDeals2 = this.miningdata.filter(
                    (item: any) =>
                        item?.today === targetDatePrevProg2
                ).length;
                console.log(previousDayTotalDeals2);

                const previousDaySuccessfulDeals2 = this.miningdata.filter(
                    (item: any) =>
                        item?.today === targetDatePrevProg2 && item?.status === true
                ).length;
                console.log(previousDaySuccessfulDeals2);


                const previousSuccessPercentage2 = previousDayTotalDeals2 > 0 ? (previousDaySuccessfulDeals2 / previousDayTotalDeals2) * 100 : 0;
                
                
                this.progressBarChartOptionsPrev2.series = [previousSuccessPercentage2.toFixed(2)];

                // Trigger change detection manually
                this.cdr.detectChanges();
            },
        });
    }
}
