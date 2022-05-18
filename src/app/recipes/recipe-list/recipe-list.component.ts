import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {map, Subscription} from 'rxjs';
import {Recipe} from "../recipe.model";
import * as fromApp from '../../store/app.reducer'
//import * as RecipesActions from "../recipes/store/recipe.actions";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];
  subscription: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<fromApp.AppState>) { }

  ngOnInit() {
 /*   this.subscription = this.recipeService.recipeChanged.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
      this.recipes = this.recipeService.getRecipes();
    })*/

    this.subscription = this.store.select('recipes')
      .pipe(map(recipesState => recipesState.recipes))
      .subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    })

  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.route});

  }

  onDestroy(){
    this.subscription.unsubscribe();
  }

}
