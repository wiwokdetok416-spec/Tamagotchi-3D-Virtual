# 🐾 Tamagotchi 3D Virtual Pet

Game virtual pet 3D yang ringan, interaktif, dan penuh fitur ceria yang dibangun menggunakan **React 18**, **Three.js (WebGL)**, **Tailwind CSS**, dan **Express (Node.js)** dengan kecerdasan buatan **J0ssy bot** via Groq API.

---

## ✨ Fitur Utama

1. **4 Hewan Peliharaan Unik (3D Prosedural)**
   * 🐶 **Milo**: Anjing Golden Corgi ceria, penurut, suka makan biskuit tulang dan mengibas ekornya.
   * 🐟 **Fizzi**: Ikan Cupang Halfmoon anggun berenang di toples air dengan gelembung udara.
   * 🐱 **Ngkur**: Kucing Calico pemberani berselempang pahlawan yang suka salmon dan mendengkur (*purr*).
   * 🦀 **Patar**: Si kepiting karang kasar bertempurung merah membara dan bercapit perkasa (*klak-klak!*). Karakternya ketus dan judes khas preman pantai, namun setia dan bisa berjoget *Crab Rave*!

2. **🤖 J0ssy bot AI Companion**
   * Robot pendamping cerdas yang ditenagai model **GPT-OSS 20b** (via Groq API).
   * Bisa diajak mengobrol, memberikan tips nutrisi hewan, dan memantau kapasitas baterai.
   * Baterai di bawah 20% butuh diistirahatkan dan dicas manual.

3. **💃 Panggung Joget & Emotikon Tarian**
   * Emotikon gratis: *Joget Robot Kaku*.
   * Tarian koleksi di Toko: *Breakdance 360 Spin*, *Disco Party 80s*, *Moonwalk Bintang Pop*, dll.

4. **⚡ Fitur Rahasia: Admin Panel**
   * **Syarat Buka**: Salah satu hewan peliharaan harus mencapai **minimal Level 5** dan menjawab **5 Soal Matematika Acak** dengan benar semua (5/5).
   * **Fitur**: Mode kebal mini-game, belanja gratis (*Free Shopping*), atur bar status hewan, suntik koin tak terhingga (∞), buka semua aksesoris, dan tombol *Reset ke Semula*.

5. **🎮 2 Mini-Game Seru**
   * Penangkap Cemilan Hujan Bintang.
   * Tebak Kotak Hadiah Berhadiah Koin.

6. **📱 100% Kompatibel di HP & Komputer/Laptop**
   * Layar sentuh ergonomis di smartphone (gestur elus & dock adaptif).
   * Shortcut keyboard cepat di PC/Laptop (**1-6** untuk aksi, **Spasi** untuk elus).

7. **⚡ Sangat Ringan & Offline First**
   * Semua model 3D dan efek suara dibuat secara prosedural (tanpa file audio/grafis eksternal berat).
   * Ukuran transfer jaringan hanya **~362 KB**!

---

## 🚀 Cara Menjalankan Secara Lokal

### Prasyarat
* **Node.js** (versi 18 ke atas disarankan)
* **npm** atau **bun**

### Langkah Instalasi
1. Clone repositori ini:
   ```bash
   git clone https://github.com/USERNAME/REPO_NAME.git
   cd REPO_NAME
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

4. Buka browser di:
   ```
   http://localhost:3000
   ```

---

## 🛠️ Teknologi yang Digunakan
* **Framework**: React, JavaScript, Vite
* **3D Engine**: Three.js (Procedural geometries, ACESFilmic tone mapping, dynamic lighting & shadows)
* **Audio**: Procedural Web Audio API (Zero external MP3 files)
* **Styling**: Tailwind CSS
* **Icons**: Lucide React
* **Backend Proxy**: Express.js
* **AI Engine**: Groq API (GPT-OSS 20b)

---

Dibuat dengan ❤️ untuk pecinta hewan virtual pet!
