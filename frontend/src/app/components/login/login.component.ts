import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private alertPopup: MatSnackBar
  ) {}

  ngOnInit() {}

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.apiService
      .login({
        username: this.loginForm.controls.username.value,
        password: this.loginForm.controls.password.value,
      })
      .then(
        (response) => {
          if (response) {
            localStorage.setItem('username', response.username);
          }

          this.router.navigate(['/home']);
        },
        () => {
          this.alertPopup.open('incorrect username or password', undefined, {
            duration: 1500,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'error-popup',
          });
        }
      );
  }
}
