import { Component } from '@angular/core';
import { AuthService } from './core/auth/authentication.service';
import { Router } from '@angular/router';

@Component({
  styleUrls: ['./app.component.css'],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  // currentUser
  // user: User;

  constructor(private authService: AuthService) {
    // this.authService.
  }
}
