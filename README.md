# Frontend Lembaga (React SPA)

Frontend publik terpisah untuk CMS Lembaga v2, dibangun dengan React + TypeScript + Vite.

## Tujuan

Aplikasi ini menampilkan website publik lembaga berbasis API (`/api/v1`) dari backend Laravel.

Fitur utama yang ditangani di SPA ini antara lain:

- Home (slider, quick links, berita, agenda, mitra, testimoni)
- Halaman konten publik (berita, agenda, FAQ, kontak, pencarian, dll)
- Halaman akademik (fakultas, prodi, dosen, prestasi)
- Halaman semua mitra/kolaborator
- Header portal akademik dari site settings
- Theme color dinamis dari site settings
- Popup banner terjadwal dari `popup_banners`

## Stack

- React 19
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS

## Menjalankan Lokal

Pastikan backend Laravel berjalan, lalu dari folder ini:

```bash
npm install
npm run dev
```

Dev server default akan tampil di port Vite (biasanya `5173`).

## Build Production

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

## Konfigurasi API

Client API ada di `src/api/client.ts`.

Jika butuh ubah base URL API (mis. beda domain backend), sesuaikan konfigurasi Axios di file tersebut atau melalui environment variable yang dipakai proyek.

## Struktur Folder Penting

- `src/api` - modul request API
- `src/components` - komponen UI/layout
- `src/pages` - halaman route publik
- `src/context` - context global (institusi, bahasa, dll)
- `src/types` - type interface respons API

## Catatan Integrasi

- Popup banner mengambil data dari endpoint home (`popup_banners`).
- Close behavior popup mengikuti `close_mode` (`session`, `1_day`, `7_days`, `until_updated`).
- Saat backend mengubah popup banner, cache home backend perlu invalid agar SPA mengambil data terbaru.
