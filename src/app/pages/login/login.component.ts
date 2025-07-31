import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { AuthStoreService } from '@services/auth-store.service';
import { LoginResponse } from '@services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ExperienceService } from '@services/experience.service';
import { ExperienceStateService } from '@services/experience-state.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  submitted = false;
  loading = false;
  errorMessage = '';

  icons = [
    { delay: 0, duration: 4 },
    { delay: 1, duration: 5 },
    { delay: 2, duration: 6 },
    { delay: 3, duration: 7 },
    { delay: 4, duration: 8 },
    { delay: 5, duration: 9 },
    { delay: 6, duration: 10 },
    { delay: 7, duration: 11 },
    { delay: 8, duration: 12 },
    { delay: 9, duration: 13 },
    { delay: 10, duration: 14 },
  ];
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private experienceService: ExperienceService,
    private experienceStateService: ExperienceStateService,
    private authStore: AuthStoreService
  ) {
    // 👉 Se l'utente è già autenticato, reindirizza


    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    if (savedEmail && savedPassword) {
      this.loginForm.patchValue({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true
      });
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) return;

    const { email, password, rememberMe } = this.loginForm.value;

    if (rememberMe) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }

    this.loading = true;

    this.authService.login({ email, password }).subscribe({
      next: ({ token, user }: LoginResponse) => {
        this.authStore.setAuth(user, token);
        this.experienceService.getExperienceByUserUuid(user.uuid).subscribe(response => {
          this.experienceStateService.setExperience({ ...response }); // forza l'aggiornamento
        });
        this.router.navigate(['/']);
      },
      error: (err: { error?: { message?: string } }) => {
        this.errorMessage = err?.error?.message || 'Login fallito. Controlla le credenziali.';
        // Show error toastr
        this.toastr.error(this.errorMessage, 'Errore');
        this.loading = false;
      }
    });
  }
}
