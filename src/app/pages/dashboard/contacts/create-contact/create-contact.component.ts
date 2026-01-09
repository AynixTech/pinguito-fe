import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactService } from '@services/contact.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss']
})
export class CreateContactComponent implements OnInit {
  contactForm!: FormGroup;
  isLoading = false;
  submitted = false;

  countries = ['Italia', 'Francia', 'Germania', 'Spagna', 'Regno Unito', 'USA', 'Altri'];
  phonePrefixes = ['+39', '+33', '+49', '+34', '+44', '+1'];
  genders = ['Maschio', 'Femmina', 'Altro', 'Preferisco non specificare'];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phonePrefix: ['+39', Validators.required],
      phoneNumber: ['', Validators.required],
      city: ['', Validators.required],
      country: ['Italia', Validators.required],
      address: [''],
      zipCode: [''],
      company: [''],
      jobTitle: [''],
      dateOfBirth: [''],
      gender: [''],
      interests: [''],
      notes: [''],
      subscribed: [true],
      tags: [[]]
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.contactForm.invalid) {
      this.toast.warning('Compila tutti i campi obbligatori', 'Attenzione');
      return;
    }

    this.isLoading = true;
    const contactData = this.contactForm.value;

    this.contactService.createContact(contactData).subscribe({
      next: () => {
        this.toast.success('Contatto creato con successo', 'Successo');
        this.router.navigate(['/dashboard/contacts/list-contacts']);
      },
      error: (error) => {
        console.error('Errore creazione contatto:', error);
        this.toast.error('Errore durante la creazione del contatto', 'Errore');
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard/contacts/list-contacts']);
  }
}
