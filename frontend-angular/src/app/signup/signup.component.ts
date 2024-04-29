import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: any = FormGroup;
  responseMessage: any;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private snackbarService: SnackbarService,
    private dialogRef: MatDialogRef<SignupComponent>,
    private ngxService: NgxUiLoaderService) { }
  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      employee_name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      employee_phone: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      salary: [null, [Validators.required, Validators.pattern(GlobalConstants.salaryRegex)]],
      join_year: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      password: [null, [Validators.required]],
    })
  }

  handleSubmit() {
    this.ngxService.start();
    var formData = this.signupForm.value;
    var data = {
      employee_name: formData.employee_name,
      employee_phone: formData.employee_phone,
      salary: formData.salary,
      join_year: formData.join_year,
      email: formData.email,
      password: formData.password
    }
    this.userService.signup(data).subscribe((Response: any) => {
      this.ngxService.stop();
      this.dialogRef.close();
      this.responseMessage = Response?.message;
      this.snackbarService.openSnackBar(this.responseMessage, "");
      this.router.navigate(['/']);
    }, (error) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      }
      else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    })
  }

}
