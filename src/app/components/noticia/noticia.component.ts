import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/interfaces';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ActionSheetController, Platform } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LocalDataService } from '../../services/local-data.service';


@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.scss'],
})
export class NoticiaComponent implements OnInit {

  @Input() noticia: Article;
  @Input() indice: number;
  @Input() enFavoritos; 

  constructor(private iab : InAppBrowser, 
              private actionSheetController: ActionSheetController,
              private socialSharing: SocialSharing,
              private localData: LocalDataService,
              private platform: Platform) { }

  ngOnInit() {}

  abrirNoticia(){
    this.iab.create(this.noticia.url, '_system');
  }

  async lanzarMenu(){

    let btnGuardarBorrar;

    if (this.enFavoritos) {
      btnGuardarBorrar = {
        text: 'Borrar favorito',
        icon: 'trash',
        cssClass: 'action-dark',
        handler: () => {
          this.localData.borrarFavorito(this.noticia);
        }
      }
    } else {
      btnGuardarBorrar = {
        text: 'Favorito',
        icon: 'heart',
        cssClass: 'action-dark',
        handler: () => {
          this.localData.guardarNoticia(this.noticia);
        }
      }
    }
    const actionSheet = await this.actionSheetController.create({
      buttons: [{
        text: 'Compartir',
        icon: 'share',
        cssClass: 'action-dark',
        handler: () => {
          this.compartirNoticia();
        }
      },
      
      btnGuardarBorrar,

      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        cssClass: 'action-dark',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  
  }

  compartirNoticia(){

    if (this.platform.is('cordova')) {
      this.socialSharing.share(
        this.noticia.title,
        this.noticia.source.name,
        '',
        this.noticia.url
      );  
    }else{
      if (navigator.share) {
        navigator.share({
          title: this.noticia.title,
          text: this.noticia.description,
          url: this.noticia.url,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      }else{
        console.log("No se pudo compartir porque no es compatible la función share");
      }
    }
    
  }

}
