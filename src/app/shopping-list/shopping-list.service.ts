import {Injectable} from '@angular/core';
import {Subject} from 'rxjs'

import {Ingredient} from "../shared/ingredients.model";

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  constructor() { }

  private ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 5),
    new Ingredient('Rice', 10)
  ];

  getIngredients() {
    return this.ingredients.slice();
  }

  getIngredient(index: number){
    return this.ingredients[index];
  }

  deleteIngredient(index: number){
      this.ingredients.splice(+index, 1);
      this.ingredientsChanged.next(this.ingredients.slice());
  }


  addIngredient(ingredient: Ingredient){
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }
  addIngredients(ingredients: Ingredient[]){
    // for(let ingredient in ingredients){
    //   this.addIngredient(ingredient);
    // }
    this.ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient(index: number, newIngredient:Ingredient){
    this.ingredients[index] = newIngredient;
    this.ingredientsChanged.next(this.ingredients.slice());
  }

}
