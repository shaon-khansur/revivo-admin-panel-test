import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
    FormBuilder,
    FormGroup,
    FormArray,
    ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OpenMemoryServiceService } from '../open-memory-service.service';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'app-edit-conversation',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatExpansionModule,
        MatDialogModule,
    ],
    templateUrl: './edit-conversation.component.html',
    styleUrls: ['./edit-conversation.component.scss'],
})
export class EditConversationComponent {
    form: FormGroup;
    fileString: string;
    memoryInfo: any; // Ideally, define a proper type for hotelIfo
    id: string;

    constructor(
        private fb: FormBuilder,
        private memoryService: OpenMemoryServiceService,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params) => {
            const id = params['id'];
            console.log(id);
            this.memoryService.getMemoryById(id).subscribe({
                next: (response) => {
                    this.memoryInfo = response;
                },
            });
        });
    }
    deleteMessage(index: number) {
        if (!this.memoryInfo?.messages) return;

        // Confirm before deleting

        const confirmation = this._fuseConfirmationService.open({
            title: 'Delete data',
            message:
                'Are you sure you want to delete? This action cannot be undone!',
            actions: {
                confirm: {
                    show: true,
                    label: 'Ok',
                    color: 'primary',
                },
            },
        });

        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                // Remove from local array
                this.memoryInfo.messages.splice(index, 1);

                // Call API to update the conversation
                this.memoryService
                    .updateMemory(
                        this.memoryInfo.conversation_id,
                        this.memoryInfo.messages
                    )
                    .subscribe({
                        next: () => console.log('Message deleted successfully'),
                        error: (err) =>
                            console.error('Error deleting message:', err),
                    });
            }
        });
    }
    close(): void {
        this.router.navigate(['supports/openMemory']);
    }
}
