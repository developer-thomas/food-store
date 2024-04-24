import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/User';

@Component({
  selector: 'app-login-page',
  standalone: false,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitted: boolean = false;
  returnUrl: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  public get fc() {
    return this.loginForm.controls;
  }

  public submit() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;

    this.userService
      .login({ email: this.fc.email.value, password: this.fc.password.value })
      .subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });
  }
}
