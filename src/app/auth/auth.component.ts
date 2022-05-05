import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {AuthResponseData} from "./auth.interface";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error:string = null;
  @ViewChild(PlaceholderDirective, { static: true}) alertHost!: PlaceholderDirective;
  private closeSub: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  noSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;

    if(this.isLoginMode){
      authObs = this.authService.login(form.value.email, form.value.password);
    } else {
      authObs = this.authService.signup(form.value.email, form.value.password);
    }

    authObs.subscribe({
      next:(resData) =>{
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error:(errMessage) =>{
        console.log(errMessage);
        this.error = errMessage;
        this.showErrorAlert(errMessage);
        this.isLoading = false;
      }
    });

    form.reset();
  }

  private showErrorAlert(message: string){

    //Method 1
    // const viewContainerRef = this.alertHost.viewContainerRef;
    // viewContainerRef.clear();
    // const componentRef = viewContainerRef.createComponent(AlertComponent);

    //Method 2 (Preferred - lean code
    const componentRef = this.alertHost.viewContainerRef.createComponent(AlertComponent);

    componentRef.instance.message = message;
    //Only exception to how you subscribe to an emitter inside a dynamically created component
    this.closeSub = componentRef.instance.close.subscribe(() =>{
      this.closeSub.unsubscribe();
      componentRef.destroy();
    });


  }

  onHandleError(){
    this.error = null;
  }

  ngOnDestroy() {
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }
  }

}
