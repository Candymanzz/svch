import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    en: {
        translation: {
            "users": "Users",
            "tasks": "Tasks",
            "home": "Home",
            "addUser": "Add User",
            "addTask": "Add Task",
            "name": "Name",
            "email": "Email",
            "title": "Title",
            "status": "Status",
            "completed": "Completed",
            "active": "Active",
            "edit": "Edit",
            "delete": "Delete",
            "save": "Save",
            "cancel": "Cancel",
            "all": "All",
            "sortBy": "Sort by",
            "loading": "Loading...",
            "error": "Error"
        }
    },
    ru: {
        translation: {
            "users": "Пользователи",
            "tasks": "Задачи",
            "home": "Главная",
            "addUser": "Добавить пользователя",
            "addTask": "Добавить задачу",
            "name": "Имя",
            "email": "Email",
            "title": "Название",
            "status": "Статус",
            "completed": "Завершено",
            "active": "Активно",
            "edit": "Редактировать",
            "delete": "Удалить",
            "save": "Сохранить",
            "cancel": "Отмена",
            "all": "Все",
            "sortBy": "Сортировать по",
            "loading": "Загрузка...",
            "error": "Ошибка"
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n; 