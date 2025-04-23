import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            'items.title': 'Items List',
            'items.add': 'Add Item',
            'items.edit': 'Edit Item',
            'items.delete': 'Delete',
            'items.search': 'Search',
            'items.sort': 'Sort by',
            'items.name': 'Name',
            'items.description': 'Description',
            'items.price': 'Price',
            'items.actions': 'Actions',
            'items.noItems': 'No items found',
            'items.loading': 'Loading...',
            'items.error': 'Error loading items',
            'form.save': 'Save',
            'form.cancel': 'Cancel',
            'form.name': 'Name',
            'form.description': 'Description',
            'form.price': 'Price',
            'form.required': 'This field is required'
        }
    },
    ru: {
        translation: {
            'items.title': 'Список элементов',
            'items.add': 'Добавить элемент',
            'items.edit': 'Редактировать элемент',
            'items.delete': 'Удалить',
            'items.search': 'Поиск',
            'items.sort': 'Сортировать по',
            'items.name': 'Название',
            'items.description': 'Описание',
            'items.price': 'Цена',
            'items.actions': 'Действия',
            'items.noItems': 'Элементы не найдены',
            'items.loading': 'Загрузка...',
            'items.error': 'Ошибка загрузки элементов',
            'form.save': 'Сохранить',
            'form.cancel': 'Отмена',
            'form.name': 'Название',
            'form.description': 'Описание',
            'form.price': 'Цена',
            'form.required': 'Это поле обязательно'
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n; 