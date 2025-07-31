# getPath - генератор CSS-селекторов

## Описание

Функция `getPath()` генерирует уникальный CSS-селектор для любого элемента DOM. Полученный селектор точно идентифицирует элемент в документе.

## Cтарт

1. Установите live-server:
```bash
npm install -g live-server
```

2. Запустите демо:
```bash
live-server
```

3. Кликните на любой элемент в демо-интерфейсе - селектор появится внизу страницы.

## Использование

```javascript
import getPath from './getPath.js';

const element = document.querySelector('.my-element');
console.log(getPath(element));
// Пример: "body > div.container > button#submit"
```

## Особенности

- Поддержка всех HTML-элементов
- Учет ID, классов и позиции элемента
- Интерактивная демо-страница с подсветкой элементов
- Чистый JavaScript без зависимостей