import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-subscriber-drawer',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatTooltipModule],
    providers: [DatePipe],
    templateUrl: './subscriber-drawer.component.html',
    styleUrls: ['./subscriber-drawer.component.scss'],
})
export class SubscriberDrawerComponent {
    @Input() subscriber: any;
    @Output() close = new EventEmitter<void>();
    @Output() delete = new EventEmitter<any>();

    constructor( private datePipe: DatePipe){}

    closeDrawer(): void {
        this.close.emit();
    }
    deleteSubscriber(){
      this.delete.emit(this.subscriber)
    }
}
