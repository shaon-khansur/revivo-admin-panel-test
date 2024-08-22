import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-support-tickets-details',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule],
    providers: [DatePipe],
    templateUrl: './support-tickets-details.component.html',
    styleUrls: ['./support-tickets-details.component.scss'],
})
export class SupportTicketsDetailsComponent {
    @Input() supportTicket: any;
    @Output() close = new EventEmitter<void>();
    @Output() delete = new EventEmitter<any>();

    constructor(private datePipe: DatePipe) {}

    closeDrawer(): void {
        this.close.emit();
    }
    deleteSubscriber() {
        this.delete.emit(this.supportTicket);
    }
}
