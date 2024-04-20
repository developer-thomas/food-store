import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  public get fc() {
    return this.loginForm.controls;
  }

  public submit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;

    alert(`email: ${this.fc.email.value} ,
      password: ${this.fc.password.value}`);
  }
}
