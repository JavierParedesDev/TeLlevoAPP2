import { Component, OnInit } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  urs:Usuario={
    id: Date.now(),
    nombre: "",
    email: "",
    contrasena: ""
  }
  constructor(
    private AlertCtr : AlertController,
    private router : Router,
    private firestore: AngularFirestore, 
    private auth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

 
  login(){
    if (!this.urs.email || !this.urs.contrasena) {
      this.alertas("Error", "Rellene los campos");
      return; 
    }
    this.firestore.collection('usuarios', ref => ref.where('email', '==', this.urs.email).where('contrasena', '==', this.urs.contrasena))
      .get().subscribe(snapshot => {
        if (snapshot.empty) {
          this.alertas("Error", "Usuario no encontrado");
        } else {
          this.router.navigateByUrl("/tabs/home");
        }
      }, error => {
        console.error("Error al obtener los usuarios: ", error);
        this.alertas("Error", "No se pudo iniciar sesión");
      });



  }

  async alertas(mensaje: string,subtitulo:string){
    const alrt = await this.AlertCtr.create({
      header: mensaje,
      message: subtitulo,
      buttons: ["Aceptar"]
    })

    alrt.present()
  }

}import { AngularFireAuth } from '@angular/fire/compat/auth';

