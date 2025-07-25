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

  passwordStrength = 0;
  passwordStrengthText = '';
  passwordStrengthColor = '#ccc';
  showPassword = false;


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

    switch (strength) {
      case 0:
      case 1:
        this.passwordStrength = 20;
        this.passwordStrengthText = 'Molto debole';
        this.passwordStrengthColor = '#e74c3c'; // rosso
        break;
      case 2:
        this.passwordStrength = 40;
        this.passwordStrengthText = 'Debole';
        this.passwordStrengthColor = '#e67e22'; // arancio
        break;
      case 3:
        this.passwordStrength = 60;
        this.passwordStrengthText = 'Media';
        this.passwordStrengthColor = '#f1c40f'; // giallo
        break;
      case 4:
        this.passwordStrength = 80;
        this.passwordStrengthText = 'Forte';
        this.passwordStrengthColor = '#2ecc71'; // verde chiaro
        break;
      case 5:
        this.passwordStrength = 100;
        this.passwordStrengthText = 'Molto forte';
        this.passwordStrengthColor = '#27ae60'; // verde scuro
        break;
    }
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
