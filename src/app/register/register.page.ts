import { Component, OnInit } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { AlertController } from '@ionic/angular';
import { Vehiculo } from '../interfaces/vehiculo';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

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

  vcl:Vehiculo={
    id: Date.now(),
    marca: "",
    modelo:"",
    date:1994
  }
  tieneVehiculo: boolean = false;

  constructor(
    private alert: AlertController,
    private firestore: AngularFirestore,
    private router: Router
  ) { }

  ngOnInit() {
  }

  registro(){
    if(!this.usr.nombre || !this.usr.email || !this.usr.contrasena){
      this.alertas("Error!! Rellene los campos")
  
      return;
    }
    if(this.tieneVehiculo){
      console.log("disable check")
      if(!this.vcl.marca || !this.vcl.modelo || !this.vcl.date){
        this.alertas("Error!! Rellene los campos")
    
        return;
      }
    }else{
      console.log("no tiene vehiculo")
    }
    
    const usuaroRegistro ={
      idUser: this.usr.id,
      nombre: this.usr.nombre,
      email: this.usr.email,
      contrasena: this.usr.contrasena,
      vehiculo:this.tieneVehiculo ?{
        idVehiculo: this.vcl.id,
        marca: this.vcl.marca,
        modelo: this.vcl.modelo,
        año: this.vcl.date
      }
      :null
    }
  
    this.registrarUsuario(usuaroRegistro).then(()=>{
      this.alertas("usuario Registrado");
      this.router.navigateByUrl("/login")
    }).catch(error => {
      this.alertas("Error al registrar el usuario: " + error);
    });

    this.usr={
      id: Date.now(),
      nombre:"",
      email:"",
      contrasena:""
    }
    
    this.vcl={
      id:Date.now(),
      marca: "",
      modelo:"",
      date:1994
    }
  }

  async alertas(mensaje: string){
    const alert= await this.alert.create({
      header: mensaje,
      buttons: ["Aceptar"]
    });

    alert.present();
  }


  registrarUsuario(usuario: any) {
    return this.firestore.collection('usuarios').add(usuario);
  }

}
