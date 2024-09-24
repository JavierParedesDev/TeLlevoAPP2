import { Component, OnInit } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  usr:Usuario={
    id: Date.now(),
    nombre:"",
    email:"",
    contrasena:""
  }

  constructor(
    private alert: AlertController
  ) { }

  ngOnInit() {
  }

  registro(){
    if(!this.usr.nombre || !this.usr.email || !this.usr.contrasena){
      this.alertas("Error!! Rellene los campos")
    }
  }

  async alertas(mensaje: string){
    this.alert.create({
      header: mensaje,
      buttons: ["Aceptar"]
    })
  }

}
