#!/bin/bash

# Скрипт для заполнения базы данных тестовыми товарами

BASE_URL="http://localhost:3001"

echo "🌱 Заполнение базы данных тестовыми данными..."
echo ""

# Создание категорий
echo "📁 Создание категорий..."

categories=(
  '{"name":"Электроника","slug":"electronics","description":"Смартфоны, ноутбуки, планшеты и другая электроника"}'
  '{"name":"Одежда","slug":"clothing","description":"Мужская и женская одежда"}'
  '{"name":"Книги","slug":"books","description":"Художественная и техническая литература"}'
  '{"name":"Спорт","slug":"sports","description":"Спортивные товары и инвентарь"}'
)

for category in "${categories[@]}"; do
  name=$(echo $category | jq -r '.name')
  curl -s -X POST "$BASE_URL/categories" \
    -H "Content-Type: application/json" \
    -d "$category" > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    echo "  ✓ Создана категория: $name"
  else
    echo "  ⚠ Категория '$name' уже существует или ошибка создания"
  fi
done

sleep 1

# Получение всех категорий
echo ""
echo "📋 Получение списка категорий..."
categories_response=$(curl -s "$BASE_URL/categories")
echo "  ✓ Категории получены"

# Создание товаров
echo ""
echo "📦 Создание товаров..."

# Получаем ID категорий
electronics_id=$(echo $categories_response | jq -r '.[0].id')
clothing_id=$(echo $categories_response | jq -r '.[1].id')
books_id=$(echo $categories_response | jq -r '.[2].id')
sports_id=$(echo $categories_response | jq -r '.[3].id')

products=(
  "{\"name\":\"iPhone 15 Pro\",\"description\":\"Новейший смартфон от Apple с титановым корпусом\",\"price\":99999,\"stock\":15,\"categoryId\":$electronics_id,\"imageUrl\":\"https://images.unsplash.com/photo-1696446702183-cbd50c6e8e0f?w=400\"}"
  "{\"name\":\"MacBook Pro 16\",\"description\":\"Мощный ноутбук для профессионалов\",\"price\":249999,\"stock\":8,\"categoryId\":$electronics_id,\"imageUrl\":\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400\"}"
  "{\"name\":\"iPad Air\",\"description\":\"Легкий и производительный планшет\",\"price\":59999,\"stock\":20,\"categoryId\":$electronics_id,\"imageUrl\":\"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400\"}"
  "{\"name\":\"AirPods Pro\",\"description\":\"Беспроводные наушники с шумоподавлением\",\"price\":24999,\"stock\":30,\"categoryId\":$electronics_id,\"imageUrl\":\"https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400\"}"
  "{\"name\":\"Samsung Galaxy S24\",\"description\":\"Флагманский смартфон Samsung\",\"price\":79999,\"stock\":12,\"categoryId\":$electronics_id,\"imageUrl\":\"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400\"}"
  "{\"name\":\"Джинсы Levi's 501\",\"description\":\"Классические прямые джинсы\",\"price\":7999,\"stock\":25,\"categoryId\":$clothing_id,\"imageUrl\":\"https://images.unsplash.com/photo-1542272604-787c3835535d?w=400\"}"
  "{\"name\":\"Футболка Nike\",\"description\":\"Спортивная футболка из дышащей ткани\",\"price\":2999,\"stock\":50,\"categoryId\":$clothing_id,\"imageUrl\":\"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400\"}"
  "{\"name\":\"Куртка The North Face\",\"description\":\"Теплая зимняя куртка\",\"price\":19999,\"stock\":10,\"categoryId\":$clothing_id,\"imageUrl\":\"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400\"}"
  "{\"name\":\"Чистый код\",\"description\":\"Роберт Мартин - библия программиста\",\"price\":1999,\"stock\":40,\"categoryId\":$books_id,\"imageUrl\":\"https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400\"}"
  "{\"name\":\"JavaScript: Полное руководство\",\"description\":\"Дэвид Флэнаган\",\"price\":2499,\"stock\":35,\"categoryId\":$books_id,\"imageUrl\":\"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400\"}"
  "{\"name\":\"Мастер и Маргарита\",\"description\":\"Михаил Булгаков - классика\",\"price\":899,\"stock\":60,\"categoryId\":$books_id,\"imageUrl\":\"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400\"}"
  "{\"name\":\"Гантели 10кг\",\"description\":\"Пара разборных гантелей\",\"price\":3999,\"stock\":15,\"categoryId\":$sports_id,\"imageUrl\":\"https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400\"}"
  "{\"name\":\"Коврик для йоги\",\"description\":\"Нескользящий коврик\",\"price\":1499,\"stock\":45,\"categoryId\":$sports_id,\"imageUrl\":\"https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400\"}"
  "{\"name\":\"Велосипед горный\",\"description\":\"Горный велосипед с 21 скоростью\",\"price\":34999,\"stock\":5,\"categoryId\":$sports_id,\"imageUrl\":\"https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=400\"}"
  "{\"name\":\"Кроссовки Nike Air\",\"description\":\"Беговые кроссовки с амортизацией\",\"price\":8999,\"stock\":22,\"categoryId\":$sports_id,\"imageUrl\":\"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400\"}"
)

count=0
for product in "${products[@]}"; do
  name=$(echo $product | jq -r '.name')
  price=$(echo $product | jq -r '.price')
  
  curl -s -X POST "$BASE_URL/products" \
    -H "Content-Type: application/json" \
    -d "$product" > /dev/null 2>&1
  
  if [ $? -eq 0 ]; then
    echo "  ✓ Создан товар: $name - $price ₽"
    ((count++))
  else
    echo "  ⚠ Ошибка создания товара: $name"
  fi
done

# Итоги
echo ""
echo "✅ Заполнение завершено!"
echo ""
echo "📊 Статистика:"
echo "  Категорий: 4"
echo "  Товаров создано: $count"
echo ""
echo "🌐 Откройте фронтенд: http://localhost:3000"
echo ""
