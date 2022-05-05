import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import { RecipeService } from '../recipes/recipe.service';
import { map, tap} from 'rxjs';
import { Recipe } from '../recipes/recipe.model';

@Injectable({
  providedIn: 'root'
})

export class DataStorageService {
  private recipesUrl: string = 'https://recipebookapp-angular-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

  constructor(private http: HttpClient,
              private recipeService: RecipeService) { }

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
