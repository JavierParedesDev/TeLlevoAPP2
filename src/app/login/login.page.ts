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
    if(this.urs.email == "javier@conductor.cl" &&  this.urs.contrasena == "123456"){
       this.alertas("Bienvenido Javier","Conductor")
       this.router.navigateByUrl("/conductor")
    }else if(this.urs.email == "javier@alumno.cl" &&  this.urs.contrasena == "123"){
      this.alertas("Bienvenido Javier","Alumno")
      this.router.navigateByUrl("/pasajero")
    }else{
      this.alertas("Error ","Datos de usuario son incorrectos")
    }
  }

  async alertas(mensaje: string,subtitulo:string){
    const alrt = await this.AlertCtr.create({
      header: mensaje,
      message: subtitulo,
      buttons: ["Ingresar"]
    })

    alrt.present()
  }

}
