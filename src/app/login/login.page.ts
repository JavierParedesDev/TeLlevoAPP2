import { Component, OnInit } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

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
    private router : Router
  ) { }

  ngOnInit() {
  }

  login(){
    if (!this.urs.email || !this.urs.contrasena) {
      this.alertas("Error", "Rellene los campos");
      return; 
    }
    const usuarios = JSON.parse(localStorage.getItem('usuarios')?? '[]')

    if(!Array.isArray(usuarios)){
      
    }

  }

  async alertas(mensaje: string,subtitulo:string){
    const alrt = await this.AlertCtr.create({
      header: mensaje,
      message: subtitulo,
      buttons: ["Aceptar"]
    })

    alrt.present()
  }

}
