import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
    ReactiveFormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { SubscriberService } from '../subscriber.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-send-mail',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        CommonModule,
        MatButtonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './send-mail.component.html',
    styleUrls: ['./send-mail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendMailComponent implements OnDestroy {
    readonly dialogRef = inject(MatDialogRef<SendMailComponent>);
    readonly fb = inject(FormBuilder);

    sendMailForm: FormGroup;
    private subscription: Subscription | null = null;

    constructor(private emailService: SubscriberService) {
        this.sendMailForm = this.fb.group({
            userType: ['', Validators.required],
            message: ['', Validators.required],
        });
    }

    onSubmit() {
        if (this.sendMailForm.valid) {
            const { userType, message } = this.sendMailForm.value;

            this.subscription = this.emailService
                .getSelectedChannel(userType)
                .subscribe(
                    (response) => {
                        const emails = response.emails;
                        const payload = {
                            emails: emails,
                            message: message,
                        };

                        // Call the sendEmails method and handle the response
                        this.emailService.sendEmails(payload).subscribe({
                            next: (response) => {
                                this.dialogRef.close();
                            },
                            error: (error) => {
                                console.error('Error sending email:', error);
                            },
                        });
                    },
                    (error) => {
                        console.error('Error fetching emails:', error);
                    }
                );
        }
    }
    onClose(): void {
        this.dialogRef.close();
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
