import {
    ChangeDetectionStrategy,
    Component,
    ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-hotel',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './hotel.component.html',
    styleUrls: ['./hotel.component.scss'],
})
export class HotelComponent {}
