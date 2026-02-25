import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Route, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [RouterModule,RouterModule,CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  readonly router = inject(Router);
    username: string | null = null;

  ngOnInit() {
    // Initial read
    this.username = localStorage.getItem('username');

    // Listen for login event
    window.addEventListener('userLoggedIn', () => {
      this.username = localStorage.getItem('username');
    });
  }
  logout() {
  localStorage.removeItem('token');
  localStorage.setItem("username","Guest");
  localStorage.removeItem('clientID');
          window.dispatchEvent(new Event('userLoggedIn'));
  this.router.navigate(['/connection']);
}
isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
  
}
}
