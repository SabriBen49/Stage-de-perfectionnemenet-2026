import { Injectable } from '@angular/core';
import { from, Observable, map, catchError, of } from 'rxjs';
import { supabase } from '../supabase.client';

@Injectable({
  providedIn: 'root',
})
export class Auth {
isLoggedIn(): boolean {
  return !!localStorage.getItem('token');
}

signup(email: string, password: string): Observable<string> {
  return from(supabase.auth.signUp({ email, password })).pipe(
    map(({ data, error }) => {
      if (error) return 'Error: ' + error.message;

      if (!data.session) {
        return 'E-mail de confirmation envoyé. Veuillez vérifier votre boîte de réception.';
      }

      return 'Signed up successfully!';
    }),
    catchError(err => {
      console.warn('Supabase sign-up error', err);
      return of('Inscription échouée. Veuillez réessayer.');
    })
  );
}


  login(email: string, password: string): Observable<boolean> {
    return from(supabase.auth.signInWithPassword({ email, password })).pipe(
      map(({ data, error }) => {
        if (error) return false;
        localStorage.setItem('clientID', data.user?.id);
        return !!data.user?.confirmed_at;
      }),
      catchError(err => {
        console.warn('Supabase login error', err);
        return of(false);
      })
    );
  }
}
