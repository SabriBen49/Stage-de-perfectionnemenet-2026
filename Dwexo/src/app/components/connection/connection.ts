import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-connection',
  imports: [RouterModule, CommonModule, RouterModule],
  templateUrl: './connection.html',
  styleUrl: './connection.css',
})
export class Connection {
  msg = ""
  readonly Router: Router = inject(Router);
  readonly authService: Auth = inject(Auth);



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
  login() {
    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    const passwordInput = document.getElementById('password') as HTMLInputElement | null;
    if (!emailInput || !passwordInput) {
      console.log('Inputs not found');
      return;
    }
    const email = emailInput.value;
    const password = passwordInput.value;
    this.authService.login(email, password).subscribe(success => {
      if (success) {
        window.localStorage.setItem('token', 'true');
        const username = email.split('@')[0];
        localStorage.setItem('username', username);
        window.dispatchEvent(new Event('userLoggedIn'));
        
        this.Router.navigate(['/contact']);
      } else {
        this.msg = "Identifiants incorrects."
      }
    });

  }

}
