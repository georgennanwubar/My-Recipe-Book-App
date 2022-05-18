import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import { AlertComponent } from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder.directive";
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from "./store/auth.actions";

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
  private storeSub: Subscription;

  constructor(private authService: AuthService,
              private router: Router,
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe(authState => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error){
        this.showErrorAlert(this.error);
      }
    });

  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  noSubmit(form: NgForm){
    if(!form.valid){
      return;
    }

    //this.isLoading = true;
    //let authObs: Observable<AuthResponseData>;

    if(this.isLoginMode){
      //authObs = this.authService.login(form.value.email, form.value.password);
      this.store.dispatch(new AuthActions.LoginStart({
          email: form.value.email,
          password: form.value.password
        })
      );
    } else {
      //authObs = this.authService.signup(form.value.email, form.value.password);
      this.store.dispatch(new AuthActions.SignupStart({
          email: form.value.email,
          password: form.value.password
        })
      );
    }


    // authObs.subscribe({
    //   next:(resData) =>{
    //     console.log(resData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   },
    //   error:(errMessage) =>{
    //     console.log(errMessage);
    //     this.error = errMessage;
    //     this.showErrorAlert(errMessage);
    //     this.isLoading = false;
    //   }
    // });

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
    //this.error = null;
    this.store.dispatch(new AuthActions.ClearError());
  }

  ngOnDestroy() {
    if(this.closeSub){
      this.closeSub.unsubscribe();
    }

    if(this.storeSub){
      this.storeSub.unsubscribe();
    }
  }

}
