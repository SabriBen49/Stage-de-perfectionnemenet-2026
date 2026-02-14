import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { RouterModule } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.html',
  imports: [RouterModule,ReactiveFormsModule,CommonModule],
  styleUrl: './inscription.css',
})
export class Inscription {
  readonly authService: Auth = inject(Auth);
  msg: string = '';
  readonly fb : FormBuilder = inject(FormBuilder);

  signupForm = this.fb.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', [
      Validators.required,
      Validators.minLength(7),
      Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])/)
    ]]
  });

  get email(){
    return this.signupForm.get('email');
  }

  get password(){
    return this.signupForm.get('password');
  }

  togglePassword() {
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    const toggleButton = document.querySelector('.toggle');
    if (passwordInput && toggleButton) {
        if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '⌣';
      } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁';
      }
    }
  }
  signup() {
      if (this.signupForm.invalid) return;

  const { email, password } = this.signupForm.value;

  this.authService.signup(email!, password!).subscribe({
    next: (message: string) => {
      this.msg = message;

    },
    error: (err) => {
      console.error('Signup error:', err);
    }
  });
}

}
