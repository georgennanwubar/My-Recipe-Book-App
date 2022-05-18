import {Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {map, Subscription} from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions'
import * as RecipesActions from "../recipes/store/recipe.actions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  collapsed = true;
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(
              private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
   //this.userSub = this.authService.user.subscribe(user =>{
    this.userSub = this.store.select('auth')
      .pipe(map(authState => authState.user)).subscribe(user =>{
     this.isAuthenticated = !!user;
   });
  }

  onSaveData(){
    //this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }

  onFetchData(){
    this.store.dispatch(new RecipesActions.FetchRecipes());
    //this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout(){
    this.store.dispatch(new AuthActions.Logout());
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

}
