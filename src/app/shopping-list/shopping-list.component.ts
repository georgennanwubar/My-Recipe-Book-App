import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs'
import {Ingredient} from "../shared/ingredients.model";
//import { ShoppingListService } from './shopping-list.service';
import {AppState} from "../store/app.reducer";
import * as ShoppingListActions from './store/shopping-list.actions'


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  //private subscription: Subscription;

  constructor(//private slService: ShoppingListService,
              private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    // this.ingredients = this.slService.getIngredients();
    // this.subscription = this.slService.ingredientsChanged.subscribe(
    //   (ingredients: Ingredient[]) => {
    //     this.ingredients = ingredients;
    //   }
    // );
  }

  ngOnDestroy(): void {
    //this.subscription.unsubscribe();
  }

  onEditItem(index: number){
    //this.slService.startedEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
