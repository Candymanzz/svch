import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "todos": {
        "title": "Todo List",
        "add": "Add Todo",
        "edit": "Edit Todo",
        "delete": "Delete",
        "complete": "Complete",
        "priority": "Priority",
        "status": "Status",
        "all": "All",
        "completed": "Completed",
        "active": "Active",
        "high": "High",
        "medium": "Medium",
        "low": "Low",
        "search": "Search todos..."
      },
      "users": {
        "title": "Users",
        "login": "Login",
        "logout": "Logout",
        "register": "Register",
        "email": "Email",
        "password": "Password",
        "name": "Name"
      }
    }
  },
  ru: {
    translation: {
      "todos": {
        "title": "Список задач",
        "add": "Добавить задачу",
        "edit": "Редактировать задачу",
        "delete": "Удалить",
        "complete": "Выполнить",
        "priority": "Приоритет",
        "status": "Статус",
        "all": "Все",
        "completed": "Выполненные",
        "active": "Активные",
        "high": "Высокий",
        "medium": "Средний",
        "low": "Низкий",
        "search": "Поиск задач..."
      },
      "users": {
        "title": "Пользователи",
        "login": "Войти",
        "logout": "Выйти",
        "register": "Регистрация",
        "email": "Email",
        "password": "Пароль",
        "name": "Имя"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 