import type { Schema, Struct } from '@strapi/strapi';

export interface WebpagesImageBlock extends Struct.ComponentSchema {
  collectionName: 'components_webpages_image_blocks';
  info: {
    displayName: 'image-block';
    icon: 'cast';
  };
  attributes: {
    imageBlock: Schema.Attribute.Media<'images'>;
  };
}

export interface WebpagesTextBlock extends Struct.ComponentSchema {
  collectionName: 'components_webpages_text_blocks';
  info: {
    displayName: 'text-block';
    icon: 'underline';
  };
  attributes: {
    text: Schema.Attribute.Text;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'webpages.image-block': WebpagesImageBlock;
      'webpages.text-block': WebpagesTextBlock;
    }
  }
}
