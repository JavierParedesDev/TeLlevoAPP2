import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  usuarios: any[] = [];
  usuarioActual: any;

  constructor(
    private db: DatabaseService
  ) {}
  ngOnInit() {
    this.db.recuperarUsuarios().subscribe((data) => {
      this.usuarios = data;
      if (this.usuarios.length > 0) {
        this.usuarioActual = this.usuarios[0]; 
        console.log('Usuario actual:', this.usuarioActual);
      }
    });
  }

  

}
