import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordMatchValidator } from 'src/app/shared/validators/password-match-validator';

@Component({
  selector: 'app-register-page',
  standalone: false,
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss',
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitted: boolean = false;

  returnUrl: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', [Validators.required, Validators.minLength(5)]],
        email: [
          '',
          [Validators.required, Validators.email, Validators.minLength(5)],
        ],
        password: [
          '',
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(16),
        ],
        confirmPassword: ['', Validators.required],
        address: ['', Validators.required, Validators.minLength(5)],
      },
      {
        validators: PasswordMatchValidator('password', 'confirmPassword'),
      }
    );

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get fc() {
    return this.registerForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.registerForm.invalid) return;

    const formValues = this.registerForm.value;

    const user: IUserRegister = {
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword,
      address: formValues.address,
    };

    this.userService.register(user).subscribe((_) => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
