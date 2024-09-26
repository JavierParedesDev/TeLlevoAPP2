import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(
    private firestorage: AngularFirestore,
  ) { }

  recuperarUsuarios(): Observable<any[]> {
    return this.firestorage.collection('usuarios').valueChanges();
  }
}
