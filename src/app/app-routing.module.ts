import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";


const appRoutes: Routes = [
  { path:'', redirectTo: '/recipes', pathMatch: 'full' },
  //When lazy-loading, do not declare imported module here in the app module
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then( m => m.RecipesModule ) },
  { path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules, initialNavigation: 'enabledBlocking' }),
    CommonModule

  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
