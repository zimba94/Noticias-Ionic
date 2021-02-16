import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Article } from '../interfaces/interfaces';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LocalDataService {

  noticias: Article[] = [];

  constructor(private storage: Storage, 
              public toastController: ToastController) { 
    this.cargarFavoritos();
  }

  guardarNoticia(noticia:Article){

    const existe = this.noticias.find(noti => noti.title === noticia.title);

    if (!existe) {
      
      this.noticias.unshift(noticia);
      this.storage.set('favoritos', this.noticias);
      this.presentToast("Guardado en favoritos");
      
    }

  }

  async cargarFavoritos(){

    const favoritos = await this.storage.get('favoritos');
    
    if (favoritos) {
      
      this.noticias = favoritos;
      
    }

  }

  borrarFavorito(noticia: Article){
    this.noticias = this.noticias.filter(noti=> noti.title !== noticia.title);
    this.storage.set('favoritos', this.noticias);
    this.presentToast('Borrado de favoritos');

  }

  async presentToast(msj: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 2000
    });
    toast.present();
  }


}
