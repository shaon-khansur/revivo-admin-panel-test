import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-show-html',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './show-html.component.html',
    styleUrls: ['./show-html.component.scss'],
})
export class ShowHtmlComponent implements OnInit {
    rawHtml: string = `...`; // your HTML string here
    safeHtml: SafeHtml;
    constructor(
        @Inject(MAT_DIALOG_DATA) private dialogData: any,
        private sanitizer: DomSanitizer,
         private matDialogRef: MatDialogRef<ShowHtmlComponent>,
    ) {
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.dialogData.message.html);
    }

    ngOnInit(): void {
        console.log('OnInit', this.dialogData);
    }

    onClose(): void {
        this.matDialogRef.close();
    }
}
