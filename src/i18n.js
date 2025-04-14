// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  es: {
    translation: {
      media: 'Media',
      entera: 'Entera',
      precio: 'Precio',
      'De la Huerta': 'De la Huerta',
      'Para Picar': 'Para Picar',
      'A la Brasa': 'A la Brasa',
      'Especialidad en Pollo Asado': 'Especialidad en Pollo Asado',
      'De la Mar': 'De la Mar',
      'Nuestro Burguer': 'Nuestro Burguer',
      'Sabor Italiano': 'Sabor Italiano',
      Bebidas: 'Bebidas',
    },
  },
  en: {
    translation: {
      media: 'Half',
      entera: 'Full',
      precio: 'Price',
      'De la Huerta': 'From the Garden',
      'Para Picar': 'To Share',
      'A la Brasa': 'Grilled',
      'Especialidad en Pollo Asado': 'Roasted Chicken Special',
      'De la Mar': 'From the Sea',
      'Nuestro Burguer': 'Our Burgers',
      'Sabor Italiano': 'Italian Flavor',
      Bebidas: 'Drinks',
    },
  },
  fr: {
    translation: {
      media: 'Demi',
      entera: 'Entier',
      precio: 'Prix',
      'De la Huerta': 'Du potager',
      'Para Picar': 'À partager',
      'A la Brasa': 'Grillé',
      'Especialidad en Pollo Asado': 'Spécialité de poulet rôti',
      'De la Mar': 'De la mer',
      'Nuestro Burguer': 'Nos Burgers',
      'Sabor Italiano': 'Saveur italienne',
      Bebidas: 'Boissons',
    },
  },
  de: {
    translation: {
      media: 'Halb',
      entera: 'Ganz',
      precio: 'Preis',
      'De la Huerta': 'Aus dem Garten',
      'Para Picar': 'Zum Teilen',
      'A la Brasa': 'Gegrillt',
      'Especialidad en Pollo Asado': 'Spezialität: Brathähnchen',
      'De la Mar': 'Aus dem Meer',
      'Nuestro Burguer': 'Unsere Burger',
      'Sabor Italiano': 'Italienischer Geschmack',
      Bebidas: 'Getränke',
    },
  },
  pt: {
    translation: {
      media: 'Meia',
      entera: 'Inteira',
      precio: 'Preço',
      'De la Huerta': 'Da Horta',
      'Para Picar': 'Para Partilhar',
      'A la Brasa': 'Grelhado',
      'Especialidad en Pollo Asado': 'Especialidade em Frango Assado',
      'De la Mar': 'Do Mar',
      'Nuestro Burguer': 'Os Nossos Hambúrgueres',
      'Sabor Italiano': 'Sabor Italiano',
      Bebidas: 'Bebidas',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: navigator.language.split('-')[0],
  fallbackLng: 'es',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
