import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

const VALIDATORS_MESSAGE: any = {
  email: 'Email inválido!',
  required: 'Não pode estar vazio',
};

@Component({
  selector: 'input-validation',
  standalone: false,
  templateUrl: './input-validation.component.html',
  styleUrl: './input-validation.component.scss',
})
export class InputValidationComponent implements OnChanges, OnInit {
  // vai receber os controls do form do component login
  // aqui ele vai atuar como se fosse o próprio formcontrol do component pai
  // utilizei essa abordagem pra conseguir passar as informações do form e validar aqui
  @Input() controlForm!: AbstractControl;

  // vai receber o valor boolean do isSubmited do component login
  @Input() showErrorsWhen: boolean = true;

  errorMessages: string[] = [];

  checkValidation() {
    const formErrors = this.controlForm.errors;

    if (!formErrors) {
      this.errorMessages = [];
      return;
    } else {
      const errorKeys = Object.keys(formErrors);
      // debugger;
      this.errorMessages = errorKeys.map((key) => {
        return VALIDATORS_MESSAGE[key];
      });
    }
  }

  ngOnInit(): void {
    this.controlForm.statusChanges.subscribe(() => {
      this.checkValidation();
    });

    this.controlForm.valueChanges.subscribe(() => {
      this.checkValidation();
    });
  }

  ngOnChanges() {
    this.checkValidation();
  }
}
