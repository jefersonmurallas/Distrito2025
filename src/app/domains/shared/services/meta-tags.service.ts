import { inject, Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

export interface PageMetaData{
  title: string;
  description:string;
  image:string;
  url:string;
}

const defaultMetaData: PageMetaData = {
  title:'DistritoRacer',
  description: 'the best bikes boutique',
  image:'',
  url:environment.dominio
}

@Injectable({
  providedIn: 'root'
})
export class MetaTagsService {
  
  titleService = inject(Title);
  metaService = inject(Meta);

  updateMetaTags(metaData: Partial<PageMetaData>){
    const metaDataToUpdate = {
      ...defaultMetaData,
      ...metaData
    }

    const tags = this.generateMetaDefinitions(metaDataToUpdate)

    tags.forEach(tag=>{
      this.metaService.updateTag(tag)
    })

    this.titleService.setTitle(metaDataToUpdate.title)
  }

  private generateMetaDefinitions(metaData: PageMetaData): MetaDefinition[] {
    return [
      {
        property: 'title',
        content: metaData.title
      },
      {
        property: 'description',
        content: metaData.description
      },
      {
        property: 'og:title',
        content: metaData.title
      },
      {
        property: 'og:description',
        content: metaData.description
      },
      {
        property: 'og:image',
        content: metaData.image
      },
      {
        property: 'og:url',
        content: metaData.url
      },
    ];
  }
}
