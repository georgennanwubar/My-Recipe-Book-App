import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { RecipeService } from '../recipes/recipe.service';
import {exhaustMap, map, Observable, Subject, take, tap} from 'rxjs';
import { Recipe } from '../recipes/recipe.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private recipesUrl: string = 'https://recipebookapp-angular-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';
  dataServiceWorkerStatus: Subject<{status:boolean, type:string}> = new Subject();

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) { }

  storeRecipes() {
    const recipe = this.recipeService.getRecipes();
    this.http.put(this.recipesUrl, recipe).subscribe(response =>{
        console.log(response);
    });
  }

  fetchRecipes() {

      return this.http.get<Recipe[]>(this.recipesUrl).pipe(
        map(recipes =>{//pipe the response data to transform it. Map here is an rxjs operator
          return recipes.map( recipe => { //regular JS array map operator to further transfer object array
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : []
            };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }

}
