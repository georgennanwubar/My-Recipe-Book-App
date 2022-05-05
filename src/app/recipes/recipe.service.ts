import {Injectable} from '@angular/core';

import { Ingredient } from '../shared/ingredients.model';
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import {Recipe} from "./recipe.model";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipeChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Tasty Pizza',
  //     'Debonairs Pizza special',
  //     'https://www.collinsdictionary.com/images/full/pizza_337771808.jpg',
  //     [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('French Fries', 20)
  //     ]),
  //   new Recipe(
  //     'Big Fat Burger',
  //     'A tasty delicious burger from Burger King',
  //     'https://media.istockphoto.com/photos/juicy-hamburger-on-white-background-picture-id1206323282',
  //     [
  //       new Ingredient('Buns', 2),
  //       new Ingredient('Meat', 1)
  //     ])
  // ];

  private recipes: Recipe[] = [];

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes;
    this.recipeChanged.next(this.recipes.slice());
  }

  getRecipes(){
    // Adding slice returns a new copy of this array
    return this.recipes.slice();
  }

  getRecipe(id: number){
    return this.recipes[id];
  }
  addIngredientsToShoppingList( ingredients: Ingredient[]){
  this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe);
    this.recipeChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, updatedRecipe: Recipe){
    this.recipes[index] = updatedRecipe;
    this.recipeChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1);
    this.recipeChanged.next(this.recipes.slice());
  }

    constructor(private slService: ShoppingListService) { }
}
