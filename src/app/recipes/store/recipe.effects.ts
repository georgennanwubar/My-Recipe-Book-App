import {Actions, createEffect, ofType} from '@ngrx/effects';
import {HttpClient} from "@angular/common/http";
import { map, switchMap, withLatestFrom} from "rxjs";
import {Injectable} from "@angular/core";
import { Store } from '@ngrx/store';

import * as RecipesActions from './recipe.actions'
import {Recipe} from "../recipe.model";
import {environment} from "../../../environments/environment";
import * as fromApp from '../../store/app.reducer';



@Injectable()
export class RecipeEffects{
  private recipesUrl: string = environment.firebaseRecipesURL;

  fetchRecipes = createEffect(() =>
    this.actions$.pipe( //don't call subscribe here ngrx will auto-subscribe for you
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(this.recipesUrl);
      }),
      map(recipes =>{//pipe the response data to transform it. Map here is an rxjs operator
        return recipes.map( recipe => { //regular JS array map operator to further transfer object array
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      map(recipes => {
        return new RecipesActions.SetRecipes(recipes);
      })
    )
  );

  storeRecipes = createEffect(() =>
    this.actions$.pipe( //don't call subscribe here ngrx will auto-subscribe for you
      ofType(RecipesActions.STORE_RECIPES),
      withLatestFrom(this.store.select('recipes')),
      switchMap(([actionData, recipesState]) => {
        return this.http.put(this.recipesUrl, recipesState.recipes);
      })
    ),{ dispatch: false }
  );


  constructor( private actions$: Actions,
               private http: HttpClient,
               private store: Store<fromApp.AppState>){}
}
