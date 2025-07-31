import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  userForm!: FormGroup;
  isLoading = false;

  passwordStrength = 0;
  passwordStrengthText = '';
  passwordStrengthColor = '#ccc';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      roleId: [3, Validators.required], // Imposta il ruolo di default a "monitoring"
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(group: AbstractControl) {
    const pass = group.get('newPassword')?.value;
    const confirmPass = group.get('confirmPassword')?.value;
    return pass && confirmPass && pass !== confirmPass ? { passwordMismatch: true } : null;
  }

  get passwordMismatch() {
    return this.userForm.errors?.['passwordMismatch'] &&
      (this.userForm.get('newPassword')?.touched || this.userForm.get('confirmPassword')?.touched);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  generatePassword() {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]';
    let password = '';
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }

    this.userForm.get('newPassword')?.setValue(password);
    this.userForm.get('confirmPassword')?.setValue(password);
    this.checkPasswordStrength();
    this.toast.success('Password generata automaticamente');
  }

  checkPasswordStrength() {
    const password = this.userForm.get('newPassword')?.value || '';
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[\W_]/.test(password)) strength += 1;

    const strengthData = [
      { percent: 20, text: 'Molto debole', color: '#e74c3c' },
      { percent: 40, text: 'Debole', color: '#e67e22' },
      { percent: 60, text: 'Media', color: '#f1c40f' },
      { percent: 80, text: 'Forte', color: '#2ecc71' },
      { percent: 100, text: 'Molto forte', color: '#27ae60' },
    ];

    const data = strengthData[strength - 1] || strengthData[0];
    this.passwordStrength = data.percent;
    this.passwordStrengthText = data.text;
    this.passwordStrengthColor = data.color;
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;

    const newUser = {
      name: formValue.name,
      surname: formValue.surname,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.newPassword,
      roleId: formValue.roleId
    };

    this.userService.createUser(newUser).subscribe({
      next: () => {
        this.toast.success('Utente creato con successo!', 'Successo');
        this.router.navigate(['/users/list-users']);
      },
      error: () => {
        this.toast.error('Errore durante la creazione dell\'utente!', 'Errore');
      }
    });
  }
}
