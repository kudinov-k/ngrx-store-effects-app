import { Injectable } from '@angular/core';
import * as fromStore from '../store';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, switchMap, take, tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Pizza } from '../models/pizza.model';

@Injectable()
export class PizzaExistsGuard implements CanActivate {
  constructor(private store: Store<fromStore.ProductsState>) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = parseInt(route.params.pizzaId, 10);
        return this.hasPizza(id);
      })
    )
  }

  hasPizza(id: number): Observable<boolean> {
    return this.store.select(fromStore.getPizzasEntities).pipe(
      map((entities: {[key:number]: Pizza}) => !!entities[id]),
      take(1)
    )
  }

  checkStore(): Observable<boolean> {
    return this.store.select(fromStore.getPizzasLoaded).pipe(
      tap(loaded => {
        if (!loaded) {
          this.store.dispatch(new fromStore.LoadPizzas())
        }
      }),
      filter(loaded => loaded),
      take(1)
    )
  }
}
