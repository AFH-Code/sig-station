import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { UserService } from 'src/app/services/users/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });
  form: any = {};

  constructor(private formBuilder: FormBuilder, private userService: UserService, private tokenStorage: TokenStorageService, 
    private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.checkConnexion();
  }

  onSubmit(form: NgForm): void {
    console.log(this.form);

    this.userService.login(this.form).subscribe({
      next: (response) => {
        console.log(response);
        this.tokenStorage.saveToken(response.token);
        this.checkUserInfo(response.token);      
      },
      error: err => {
        this.toastr.error('Incorrect', 'Password ou username');
      },
      complete: () => console.log('complete')
    })
  }

  checkUserInfo(token: any): void{
    this.userService.checkUserInfo(token).subscribe({
      next: (response) => {
        console.log(response);
        this.tokenStorage.addUserLocalListe(response);
        this.toastr.success('Avec succès', 'Connexion effectuée');
        this.router.navigate(['/dashboard/map/station/country/0']);
      },
      error: err => {
        this.toastr.error('Echouée', 'Récupération des données');
      },
      complete: () => console.log('complete')
    })
  }

  checkConnexion()
  {
    let currentUser = this.tokenStorage.getCurrentUser();
    if(currentUser != null)
    {
      this.router.navigate(['/dashboard/map/station/country/0']);
    }
  }
}
