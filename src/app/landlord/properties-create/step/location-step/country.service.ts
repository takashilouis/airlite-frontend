import { computed,inject,Injectable, signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Country } from './country.model';
import { State } from "../../../../core/model/state.model";
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  http = inject(HttpClient);

  private countries$: WritableSignal<State<Array<Country>>> =
    signal(State.Builder<Array<Country>>().forInit());
    countries = computed(() => this.countries$());
    private fetchCountry$ = new Observable<Array<Country>>();
    constructor() {
      this.initFetchGetAllCountries();
      this.fetchCountry$.subscribe();
    }

  initFetchGetAllCountries(): void {
    this.fetchCountry$ = this.http.get<Array<Country>>("/assets/countries.json")
      .pipe(
        tap(countries => {
          console.log('Countries loaded:', countries.length);
          this.countries$.set(State.Builder<Array<Country>>().forSuccess(countries));
        }),
        catchError(err => {
          console.error('Error loading countries:', err);
          this.countries$.set(State.Builder<Array<Country>>().forError(err));
          return of([]);
        }),
        shareReplay(1)
      );
    
    // Subscribe to trigger the HTTP request
    this.fetchCountry$.subscribe();
  }
  public getCountryByCode(code: string): Observable<Country> {
    return this.fetchCountry$.pipe(
      map(countries => countries.filter(country => country.cca3 === code)),
      map(countries => countries[0])
    );
  }
}
