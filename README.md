# Проект хакатона

[Ссылка на сайт (если он ещё работает)](http://fentpp.ru/auth?redirect=/account)

Платформа для рекрутеров, соискателей и заказчиков 
Сервис позволяет заказчикам размещать заявки на подбор, рекрутеры могут вешать эти заявки на себя, 
после чего происходит автоматически сбор активных резюме с сервиса SuperJob по названию заявки, 
которые сохраняются в базе и потом отображаются на странице. Рекрутеры могут менять этапы заявки, 
это отображается и у заказчика. Соискатели могут добавлять резюме, которые также попадают в базу 
и отображаются в списке. Реализовано также мобильное приложение


### Функциональность:
```
- Ролевая модель (Администратор, Заказчик, Рекрутер, Соискатель). Разделение интерфейса в зависимости от типа аккаунта
- Проверка авторизации через роутинг
- Подача / Редактирование резюме / заявки
- Уведомления
- Смена темы

```

### Стек и технологии:
```
- Vue 3 (Options API),
- Vue Router,
- Vuex
- axios
- Bootstrap
- Scss
Для мобильного приложения подключён CapacitorJS 5 версии

```


## Setup

Make sure to install the dependencies:

```
# npm
npm install
```
```
# npm
npm run serve
```

## Production

Build the application for production:

```
# npm
npm run build
```

