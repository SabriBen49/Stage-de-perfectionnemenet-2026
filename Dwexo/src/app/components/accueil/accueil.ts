import { Component } from '@angular/core';
import { supabase } from '@supabase/supabase.client';

@Component({
  selector: 'app-accueil',
  imports: [],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil {
async ngOnInit() {
    const { error } = await supabase.auth.exchangeCodeForSession(
      window.location.href
    );

    if (error) {
      console.error('Auth callback error:', error.message);
    }
  }
}
