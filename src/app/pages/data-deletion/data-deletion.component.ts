import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-data-deletion',
  templateUrl: './data-deletion.component.html',
  styleUrls: ['./data-deletion.component.scss']
})
export class DataDeletionComponent {
  deletionForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService
  ) {
    this.deletionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      reason: [''],
      confirmDelete: [false, Validators.requiredTrue]
    });
  }

  onSubmit() {
    if (this.deletionForm.invalid) {
      this.toast.error('Compila tutti i campi obbligatori', 'Errore');
      return;
    }

    this.submitted = true;
    
    // In produzione, qui dovresti chiamare un endpoint del backend
    // che gestisce la richiesta di cancellazione dati
    
    this.toast.success(
      'Richiesta di cancellazione ricevuta. Ti contatteremo entro 30 giorni.',
      'Richiesta Inviata'
    );
    
    this.deletionForm.reset();
  }
}
