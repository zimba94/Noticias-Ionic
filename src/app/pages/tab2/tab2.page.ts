import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSegment,IonInfiniteScroll, IonContent } from '@ionic/angular';
import { Article } from 'src/app/interfaces/interfaces';
import { NoticiasService } from '../../services/noticias.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  @ViewChild(IonSegment, {static:true}) segment: IonSegment;
  @ViewChild(IonInfiniteScroll, {static:false}) infinityScroll: IonInfiniteScroll;
  @ViewChild(IonContent, {static:true}) content: IonContent;


  categorias = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
  noticias: Article[]=[];

  constructor(private noticiasService: NoticiasService){

  }

  ngOnInit(){
    this.segment.value = this.categorias[0];
    this.cargarNoticias(this.categorias[0]);
  }

  cambioCategoria(event){
    this.infinityScroll.disabled = false;
    this.content.scrollToTop();
    this.noticias = [];
    this.cargarNoticias(event.detail.value);
  }

  loadData(event){
    this.cargarNoticias(this.segment.value, event);
  }
  cargarNoticias(categoria: string, event?){
    
    this.noticiasService.getTopHeadlinesCategoria(categoria)
                        .subscribe(resp => {                          

                          this.noticias.push(...resp.articles);

                          if (resp.articles.length === 0) {
                            event.target.disabled = true;
                            return;
                          }
                          
                          if (event) {
                            event.target.complete();
                          }
                        });
  }
 
}
