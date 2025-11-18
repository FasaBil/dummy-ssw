# 🏛️ SSW Blockchain Dummy System

Simulator alur perizinan **Surabaya Single Window (SSW)** dengan integrasi **blockchain** untuk transparansi dan immutability.

---

## 📁 Struktur Direktori

```
dummy-ssw/
├── dummy-ssw.html           # Frontend utama (UI + Logic)
├── style.css                # Styling SSW Surabaya theme
├── README.md                # Dokumentasi ini
│
├── assets/                  # Asset files
│   ├── images/              # Gambar dan ilustrasi
│   │   ├── laptop.jpg       # Hero illustration
│   │   └── laptop.jpg:Zone.Identifier
│   └── data/                # Data sample & raw response
│       ├── ssw_sample_data.js       # Data sample SSW processed
│       └── ssw_raw_response.json    # Raw API response
│
├── scripts/                 # JavaScript utilities
│   └── fetch_ssw_sample.js  # Script fetch data dari SSW API
│
└── docs/                    # Dokumentasi
    └── DOKUMENTASI_TEKNIS.md # Dokumentasi lengkap untuk presentasi
```

---

## 🚀 Quick Start

### 1. Buka aplikasi
```bash
# Langsung buka di browser
open dummy-ssw.html
```

### 2. Login dengan ID
- Masukkan ID: `1140402`
- Klik "Validasi & Lanjutkan"

### 3. Proses wizard
- Ikuti 5 tahap proses (A-B → B-C → C-D → D-E → E-F)
- Setiap tahap: Daftarkan ke Blockchain → Lanjut
- Terakhir: Buat Master NFT → QR Code

---

## 🔧 Teknologi

- **Frontend**: HTML5, CSS3, JavaScript ES6
- **Styling**: Tailwind CSS + Custom CSS
- **Libraries**: jQuery, QRious (QR Code)
- **Backend**: GovChain API (Node.js + Express)
- **Blockchain**: Hardhat + Ethereum (ERC-721 NFT)

---

## 📚 Dokumentasi

Lihat **[DOKUMENTASI_TEKNIS.md](docs/DOKUMENTASI_TEKNIS.md)** untuk:
- Arsitektur sistem lengkap
- Penjelasan kode penting
- Flow diagram detail
- Glossary istilah blockchain
- Talking points untuk presentasi

---

## 🎨 Fitur

✅ Wizard flow step-by-step (sequential)  
✅ Progress indicator visual (5 dots)  
✅ NFT minting per stage (blockchain)  
✅ Parent-child token relationship  
✅ Master NFT creation  
✅ QR Code generation untuk verifikasi  
✅ Responsive design (desktop & mobile)  
✅ SSW Surabaya official theme  

---

## 🔗 Links

- **Backend API**: `http://localhost:3000/api/v1`
- **Blockchain Explorer**: [Custom Block Explorer](https://custom-block-explorer.vercel.app)
- **SSW Surabaya**: [https://sswalfa.surabaya.go.id/](https://sswalfa.surabaya.go.id/)

---

## 📝 Notes

- File `laptop.jpg` untuk hero illustration (bisa diganti)
- Data sample di `assets/data/ssw_sample_data.js`
- Script fetch di `scripts/fetch_ssw_sample.js` (untuk development)

---

**Version:** 1.0  
**Last Updated:** 18 November 2025  
**Maintained by:** Development Team
