import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

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


  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    // Check if credentials exist in localStorage and populate form fields
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

  ngOnInit(): void {
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    const { email, password, rememberMe } = this.loginForm.value;

    if (rememberMe) {
      localStorage.setItem('email', email);
      localStorage.setItem('password', password);
    } else {
      localStorage.removeItem('email');
      localStorage.removeItem('password');
    }

    console.log('Login Data:', this.loginForm.value);

    this.router.navigate(['/']);

    // TODO: Call login API
  }

}
