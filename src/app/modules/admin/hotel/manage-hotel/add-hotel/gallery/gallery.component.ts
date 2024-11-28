import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  @Input() hotelForm: any;
  @Input() images: any;
  defaultImages = [
    {
        Url: 'assets/images/blank_image.jpg',
        ImageType: 'HOTEL',
    },
    {
        Url: 'assets/images/blank_image.jpg',
        ImageType: 'HOTEL',
    },
];
}
