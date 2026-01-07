import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService, SendEmailRequest } from '../../../services/email.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-email-test',
  templateUrl: './email-test.component.html',
  styleUrls: ['./email-test.component.scss']
})
export class EmailTestComponent {
  emailForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private toastr: ToastrService
  ) {
    this.emailForm = this.fb.group({
      to: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.emailForm.invalid) {
      this.toastr.warning('Compila tutti i campi correttamente', 'Attenzione');
      return;
    }

    this.loading = true;

    const emailData: SendEmailRequest = this.emailForm.value;

    this.emailService.sendTestEmail(emailData).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.toastr.success('Email inviata con successo!', 'Successo');
          this.emailForm.reset();
        } else {
          this.toastr.error(response.message || 'Errore durante l\'invio', 'Errore');
        }
      },
      error: (err) => {
        this.loading = false;
        const errorMessage = err.error?.message || 'Errore durante l\'invio dell\'email';
        this.toastr.error(errorMessage, 'Errore');
      }
    });
  }

  get to() { return this.emailForm.get('to'); }
  get subject() { return this.emailForm.get('subject'); }
  get message() { return this.emailForm.get('message'); }
}
