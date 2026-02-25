import { Injectable } from '@angular/core';
import { Contacti } from '../interfaces/contact';
import { supabase } from '@supabase/supabase.client';
import { Observable, from } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Contactservices {

  getContact(): Observable<Contacti[]> {
    return from(this.fetchFromSupabase()).pipe(
      tap(data => {
        from(this.saveDB(data)).subscribe({
          next: () => console.log('Saved to IndexedDB'),
          error: err => console.error('IndexedDB save error', err)
        });
      }),
      catchError(err => {
        console.warn('Fetch failed, reading from IndexedDB', err);
        return from(this.readDB());
      })
    );
  }


  private async fetchFromSupabase(): Promise<Contacti[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*');
    console.log(data)
    if (error) throw error;
    return data as Contacti[];
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('contactsDB', 1);

      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains('contacts')) {
          request.result.createObjectStore('contacts', {
            keyPath: 'localId'
          });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async saveDB(data: Contacti[]) {
    const db = await this.openDB();
    const tx = db.transaction('contacts', 'readwrite');
    const store = tx.objectStore('contacts');
    data.forEach(contact => {
      contact.localId = contact.linkedinUrl + contact.id;
      store.put(contact);
    });

    return tx.oncomplete;
  }

  deleteContact(linkedinUrl: string): Promise<void> {
  const clientId = localStorage.getItem('clientID') || '';
  console.log('Deleting contact with linkedinUrl:', linkedinUrl, 'and clientId:', clientId);
  return new Promise(async (resolve, reject) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('linkedinUrl', linkedinUrl)
        .eq('id', clientId);

      if (error) {
        reject(error.message);
        return;
      }

      resolve();
    } catch (err) {
      reject(err);
    }
  });
}


  private async readDB(): Promise<Contacti[]> {
    const db = await this.openDB();
    const clientId =localStorage.getItem('clientID')||'';
    return new Promise(resolve => {
      const request = db
        .transaction('contacts', 'readonly')
        .objectStore('contacts')
        .getAll();

      request.onsuccess = () => {
        const allContacts = request.result as Contacti[];
        const filtered = allContacts.filter(c => c.localId.includes(clientId));
        resolve(filtered);
      };

      request.onerror = () => resolve([]);
    });
  }
}
