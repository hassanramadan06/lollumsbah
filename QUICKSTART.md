# Quick Start (5 minutes)

## 1. Start MySQL
```bash
docker run -d --name kids_mysql \
  -e MYSQL_ROOT_PASSWORD=rootpw \
  -e MYSQL_DATABASE=kids_clothing_store \
  -p 3306:3306 mysql:8.0
```

## 2. Install & seed
```bash
cd backend
cp .env.example .env
# If using the Docker command above, set DB_PASSWORD=rootpw in .env
sed -i 's/your_mysql_password/rootpw/' .env
npm install
npm run seed
```

## 3. Start
```bash
npm start
```

## 4. Open
- Shop: http://localhost:5000
- Admin: http://localhost:5000/admin/login.html (`admin@kidsstore.com` / `Admin@12345`)

---
**Demo customer:** `customer@kidsstore.com` / `Customer@123`
**Demo coupons:** `WELCOME10` (10%), `SAVE20` (20%, min $100), `FLAT5` ($5 off, min $30)
