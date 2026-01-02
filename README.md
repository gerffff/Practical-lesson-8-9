# Практична робота 8,9

У роботі реалізовано веб-додаток для управління сільськогосподарськими даними з повним CRUD-функціоналом для трьох таблиц: полів, посівів та польових робіт. Реалізовано за допомогою React, TanStack Query, TanStack Router та React Hook Form з валідацією через Zod.

## Реалізований функціонал
Основні можливості: <br>
- Управління полями: перегляд, створення, редагування та видалення полів з інформацією про площу, тип ґрунту та локацію<br>
- Управління посівами: повний CRUD для посівів з відстеженням дат посіву, збору та урожайності<br>
- Управління польовими роботами: управління роботами з прив’язкою до посівів, працівників та техніки<br>
- Валідація форм: валідація з використанням Zod<br>
- Кешування даних: TanStack Query для кешування та синхронізації<br>
- Каскадне видалення: при видаленні поля автоматично видаляються пов’язані посіви та роботи<br><br>

## Приклади ключового коду
### 1. Конфігурація Axios<br>
Налаштування базового HTTP-клієнта з обробкою помилок:

<img width="645" height="351" alt="image" src="https://github.com/user-attachments/assets/5c571f05-6519-495b-972c-cec01eb94e3a" /><br><br>

### 2. Хуки для TanStack Query<br>
Приклад з файлу src/features/fields/api.ts <br>
<img width="685" height="540" alt="image" src="https://github.com/user-attachments/assets/e21857ce-6e68-496c-a34a-a8fc642539b7" />
<img width="606" height="493" alt="image" src="https://github.com/user-attachments/assets/3828d187-6e8d-4c72-89cc-2b76c512ea10" />
<img width="616" height="539" alt="image" src="https://github.com/user-attachments/assets/6f8ed1c6-5763-499c-bf77-98646ff0ffe3" /><br><br>

### 3. Схема Zod для валідації форм<br>
Валідація даних форми з використанням Zod та інтеграція з React Hook Form:<br>
Приклад з файлу src/routes/fields.new.tsx — схема для створення поля<br><br>
<img width="569" height="222" alt="image" src="https://github.com/user-attachments/assets/ee50fa6b-36b5-4871-bd8e-6d3c4bc4a7d5" /><br><br>


## Скріншоти
### 1. Сторінка зі списком сутностей<br><br>
<img width="1352" height="609" alt="image" src="https://github.com/user-attachments/assets/8ed14528-fc96-46c0-9909-a3018bb6b3fb" /><br><br>

Індикатор при завантаженні сторінки<br><br>
<img width="802" height="490" alt="image" src="https://github.com/user-attachments/assets/b94cc40d-1b30-487e-b4fe-8043027303ea" /><br><br>

### 2. Помилки валідації від Zod
На скріншоті при створенні нового запису в таблиці Поле не були вказані деякі поля, після чого при спробі створити нове поле з такими даними Zod видає помилки<br><br>
<img width="615" height="445" alt="image" src="https://github.com/user-attachments/assets/31299bdd-3a3d-47c0-b213-5c8daab22335" />

### 3. Вкладка Network у DevTools, що підтверджує реальні HTTP-запити
HTTP-запити при оновленні сторінки<br><br>
<img width="770" height="583" alt="image" src="https://github.com/user-attachments/assets/43cb7fd0-33c6-44fa-8045-5e6fb9fa81c9" /><br><br>

Розбір одного з запитів, який створився при оновленні сторінки<br><br>
<img width="770" height="402" alt="image" src="https://github.com/user-attachments/assets/abd098bc-549e-4609-b5e6-85336bc6f2e0" /><br>
<img width="378" height="317" alt="image" src="https://github.com/user-attachments/assets/e9416b3b-23eb-4bc1-a072-48915d9415bf" /><br>
<img width="354" height="337" alt="image" src="https://github.com/user-attachments/assets/0ae0ff8f-6e8d-42d2-b914-5a242f2e168c" /><br>

## Коментарі щодо особливостей реалізації
1. Обробка різноманітних форматів відповідей API<br>
Була проблема з тим, що API може повертати дані різними способами:<br>
Прямий масив: [{...}, {...}]<br>
Об'єкт з полем data: { data: [{...}, {...}] }<br>
Об'єкт з повідомленням: { message: "...", data: {...} } <br>
Це було вирішено шляхом додавання обробки усіх необхідних форматів у функціях отримання даних<br><br>
<img width="690" height="285" alt="image" src="https://github.com/user-attachments/assets/47825171-2ef8-473e-ae19-9ff7fb567ab5" /><br><br>

2. Заповнення форм редагування даними<br>
Поля форм редагування не заповнювались автоматично при завантаженні даних з API. Для вирішення values в useForm замість reset в useEffect. Це дозволяє реактивно оновлювати форму при зміні даних<br>

<img width="674" height="170" alt="image" src="https://github.com/user-attachments/assets/39d4e95b-4ade-44df-b17f-b6fd39084bcb" />
