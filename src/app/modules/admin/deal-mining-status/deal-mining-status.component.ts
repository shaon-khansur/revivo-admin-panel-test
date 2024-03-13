import { Component, OnInit } from '@angular/core';
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
    chartOptions: any = {
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
            text: 'Deal Mining Today Report',
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
            text: 'Deal Mining Previous Day Report',
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
            text: 'Deal Mining Previous 2 Days ago Report',
        },
    };
    miningdata: any;
    isLoading: boolean = true;

    constructor(private miningService: MiningStatusService) {}

    ngOnInit(): void {
        this.miningService.getMiningStatus().subscribe({
            next: (response) => {
                this.isLoading = false;
                this.miningdata = response[0]?.miningStatus;

                const targetDate = new Date().toISOString().split('T')[0];
                const filteredData = this.miningdata.filter(
                    (item: any) => item?.today === targetDate
                );

                const counts = filteredData.map((item: any) => item?.count);
                const dates = filteredData.map((item: any) => item?.date);

                counts.forEach((count) => {
                    this.chartOptions.series[0].data.push(count);
                });
                dates.forEach((date) => {
                    this.chartOptions.xaxis.categories.push(date);
                });

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

                countsPrev.forEach((count) => {
                    this.chartOptionsPrev.series[0].data.push(count);
                });
                datesPrev.forEach((date) => {
                    this.chartOptionsPrev.xaxis.categories.push(date);
                });

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

                countsPrev2.forEach((count) => {
                    this.chartOptionsPrev2.series[0].data.push(count);
                });
                datesPrev2.forEach((date) => {
                    this.chartOptionsPrev2.xaxis.categories.push(date);
                });
            },
        });
    }
}
