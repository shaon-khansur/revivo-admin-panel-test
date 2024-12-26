import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-view-data',
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule],
    templateUrl: './view-data.component.html',
    styleUrls: ['./view-data.component.scss'],
})
export class ViewDataComponent {
  currentView: 'pdf' | 'html' | null = null;
    safePdfUrl: SafeResourceUrl | null = null;
    safeHtmlContent: SafeHtml | null = null;

    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { pdfUrl: string; htmlContent: string; codeStatus: boolean; pdfStatus: boolean },
        private sanitizer: DomSanitizer
    ) {
      console.log("data", data);
      
        if (data.pdfUrl) {
            this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.pdfUrl);
        }
        if (data.htmlContent) {
            this.safeHtmlContent = this.sanitizer.bypassSecurityTrustHtml(data.htmlContent);
        }
         // Set default view based on codeStatus or pdfStatus
         if (data.codeStatus) {
          this.currentView = 'html';
      } else if (data.pdfStatus) {
          this.currentView = 'pdf';
      }
    }

    selectView(view: 'pdf' | 'html'): void {
        this.currentView = view;
    }
}
