# Management Task School

Management Task School adalah aplikasi manajemen tugas sekolah yang dibangun menggunakan React.js untuk frontend dan Laravel untuk backend.

## Fitur Utama
- Manajemen tugas sekolah
- Dashboard pengguna
- CRUD tugas
- Notifikasi tugas
- Autentikasi pengguna

## Teknologi yang Digunakan
### Frontend
- React.js
- Tailwind CSS
- Axios (untuk komunikasi dengan backend)

### Backend
- Laravel 11
- MySQL (atau database lain yang digunakan)

## Cara Install

### 1. Clone Repository
```bash
git clone https://github.com/MuhammadZaki07/Management-Task.git
```

### 2. Install Backend (Laravel)
```bash
cd management-task
composer install
cp .env.example .env
php artisan key:generate
```

Jalankan server Laravel:
```bash
php artisan serve
```

### 3. Install Frontend (React.js)
```bash
cd front-end
npm install
```

Jalankan aplikasi React:
```bash
npm run dev
```

## Konfigurasi
Pastikan backend berjalan di `http://127.0.0.1:8000` dan frontend berjalan di `http://localhost:5173` (atau port yang digunakan). Jika berbeda, update konfigurasi API di React.

## Menjalankan Project
1. Jalankan backend terlebih dahulu dengan `php artisan serve`
2. Jalankan frontend dengan `npm run dev`

## Lisensi
Project ini menggunakan lisensi MIT.

---
Dibuat oleh Muahamad Zaki Ulumuddin

