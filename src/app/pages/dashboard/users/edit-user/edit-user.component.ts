import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, User } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userForm!: FormGroup;
  userUuid!: string;
  isLoading = true;
  activeTab: 'info' | 'password' = 'info';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userUuid = this.route.snapshot.paramMap.get('uuid') || '';

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      newPassword: [''],
      confirmPassword: ['']
    }, { validators: this.passwordsMatchValidator });

    if (this.userUuid) {
      this.loadUser(this.userUuid);
    } else {
      this.isLoading = false;
    }
  }

  loadUser(uuid: string) {
    this.userService.getUserByUuid(uuid).subscribe(user => {
      this.userForm.patchValue({
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone
      });
      this.isLoading = false;
    });
  }

  passwordsMatchValidator(group: AbstractControl) {
    const pass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    if (pass && confirmPass && pass !== confirmPass) {
      return { passwordMismatch: true };
    }
    return null;
  }

  get passwordMismatch() {
    return this.userForm.errors?.['passwordMismatch'] && (this.userForm.get('newPassword')?.touched || this.userForm.get('confirmPassword')?.touched);
  }

  updatePassword() {
    if (this.userForm.invalid || !this.userUuid) return;

    const newPassword = this.userForm.get('newPassword')?.value;
    const confirmPassword = this.userForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.toast.error('Le password non corrispondono!', 'Errore');
      return;
    }

    this.userService.updatePassword(this.userUuid, { password: newPassword }).subscribe(() => {
      this.toast.success('Password aggiornata con successo!', 'Successo');
      this.router.navigate(['/users']);
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;

    const updatedUser: Partial<User> = {
      name: formValue.name,
      surname: formValue.surname,
      email: formValue.email,
      phone: formValue.phone,
    };

    // Se la password è stata modificata, la includo
    if (formValue.newPassword) {
      updatedUser['password'] = formValue.newPassword;
    }

    this.userService.updateUser(this.userUuid, updatedUser).subscribe({
      next: () => {
      this.toast.success('Utente aggiornato con successo!', 'Successo');
      this.router.navigate(['/users']);
      },
      error: () => {
      this.toast.error('Errore durante l\'aggiornamento dell\'utente!', 'Errore');
      }
    });
  }
}
