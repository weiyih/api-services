import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '@core/auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError = '';
  hidePassword = true;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    // TODO - Navigate if authenticated
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required],
    });
  }

  // Convenience getter to access form fields
  get form() {
    return this.loginForm.controls;
  }

  // Login
  // tslint:disable-next-line: typedef
  onSubmit() {
    // Validate form
    if (this.loginForm.invalid) {
      return;
    }

    const username = this.form.username.value;
    const password = this.form.password.value;
    this.submitted = true;

    // TODO - Authentication
        // this.authService.login(username, password)
    this.loading = true;
    if (username === 'admin@example.com' && password === 'password') {
      console.log('Logged in');
      this.router.navigate(['/']);
    }
  }
}
