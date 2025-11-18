# 📘 Dokumentasi Teknis: SSW Blockchain Dummy System

**Versi:** 1.0  
**Tanggal:** 18 November 2025  
**Untuk:** Presentasi Management  

---

## 🎯 Ringkasan Eksekutif

Sistem ini adalah **simulator alur perizinan Surabaya Single Window (SSW)** yang mengintegrasikan teknologi **blockchain** untuk mencatat setiap tahap proses perizinan secara **transparan**, **immutable** (tidak dapat diubah), dan **traceable** (dapat dilacak).

### **Nilai Bisnis:**
- ✅ **Transparansi Penuh**: Setiap tahap perizinan tercatat di blockchain
- ✅ **Anti-Manipulasi**: Data tidak bisa diubah setelah tercatat
- ✅ **Audit Trail**: Riwayat lengkap dari awal sampai akhir
- ✅ **Verifikasi Mudah**: QR Code untuk validasi cepat
- ✅ **Efisiensi**: Otomasi pencatatan mengurangi human error

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE (Browser)                  │
│  - Input ID Permohonan                                       │
│  - Wizard Progress (Step-by-step)                           │
│  - Real-time Status Updates                                  │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│              DUMMY SSW FRONTEND (dummy-ssw.html)            │
│  - HTML5 + Tailwind CSS (Styling)                           │
│  - JavaScript ES6 (Logic & Flow Control)                    │
│  - QRious Library (QR Code Generation)                      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                 GOVCHAIN BACKEND API                         │
│  - Authentication (JWT Token)                                │
│  - NFT Minting per Stage                                    │
│  - Master NFT Creation                                       │
│  - IPFS Metadata Storage                                     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│              BLOCKCHAIN LAYER (Hardhat/Ethereum)            │
│  - Smart Contract: GovChainPermit.sol                       │
│  - NFT Standard: ERC-721                                     │
│  - Immutable Transaction Records                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔑 Konsep Inti Teknologi

### **1. Blockchain & Smart Contract**

**Apa itu Blockchain?**
- Database terdistribusi yang **tidak bisa diubah** setelah data tercatat
- Setiap transaksi memiliki **hash unik** (seperti sidik jari digital)
- Contoh: Seperti buku catatan yang setiap halamannya di-cap dengan stempel permanent

**Apa itu Smart Contract?**
- Program komputer yang berjalan di blockchain
- Otomatis mengeksekusi aturan yang sudah ditetapkan
- Contoh: Seperti mesin ATM - kalau PIN benar, uang keluar otomatis tanpa perlu teller

**Mengapa Blockchain untuk Perizinan?**
- ✅ **Bukti Digital**: Setiap tahap memiliki bukti kriptografis
- ✅ **Transparansi**: Semua pihak bisa lihat prosesnya
- ✅ **Keamanan**: Tidak bisa dipalsukan atau dimanipulasi
- ✅ **Desentralisasi**: Tidak bergantung pada satu server pusat

---

### **2. NFT (Non-Fungible Token)**

**Apa itu NFT?**
- Token digital **unik** yang merepresentasikan aset tertentu
- Berbeda dengan cryptocurrency (Bitcoin/Ethereum) yang semua koin sama
- Contoh: Seperti sertifikat tanah - setiap sertifikat berbeda dan unik

**Mengapa Pakai NFT untuk Izin?**
- ✅ Setiap tahap perizinan = 1 NFT unik
- ✅ NFT bisa di-link (parent-child relationship)
- ✅ Metadata tersimpan di IPFS (permanent storage)
- ✅ Mudah diverifikasi keasliannya

**Struktur NFT dalam Sistem:**

```
Master NFT (Sertifikat Final)
    ├── Stage 1 NFT (A-B: Cek Berkas)
    ├── Stage 2 NFT (B-C: Verifikasi Kepala Seksi)
    ├── Stage 3 NFT (C-D: Verifikasi Kepala Bidang)
    ├── Stage 4 NFT (D-E: Verifikasi Sekretaris)
    └── Stage 5 NFT (E-F: Verifikasi Kepala Dinas)
```

---

### **3. Parent-Child Token Relationship**

**Konsep:**
Setiap stage NFT memiliki "parent token" dari stage sebelumnya, membentuk **chain of custody** (rantai bukti kepemilikan).

**Contoh:**
```
Stage A-B → Token ID #123 (parent: NULL)
Stage B-C → Token ID #456 (parent: #123)
Stage C-D → Token ID #789 (parent: #456)
... dst
```

**Manfaat:**
- ✅ Membuktikan urutan kronologis
- ✅ Tidak bisa skip tahap (harus sequential)
- ✅ Traceability lengkap dari awal sampai akhir

---

## 📂 Struktur Kode Penting

### **A. File Struktur**

```
dummy-ssw/
├── dummy-ssw.html      → Frontend utama (UI + Logic)
├── style.css           → Styling SSW Surabaya
├── ssw_sample_data.js  → Data sample dari API SSW
└── DOKUMENTASI_TEKNIS.md → Dokumen ini
```

---

### **B. Penjelasan Kode Penting**

#### **1. Authentication & Connection**

```javascript
async getAuthToken() {
    const response = await fetch(`${this.BASE_URL}/auth/generate-key`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
}
```

**Penjelasan:**
- Request token JWT ke backend untuk autentikasi
- Token ini dipakai untuk setiap transaksi berikutnya
- Seperti login sekali, lalu bisa akses semua fitur

---

#### **2. Minting Stage NFT**

```javascript
createMintPayload(tahap, parentTokenId) {
    const payload = {
        stageType: tahap.stageMapping,        // Contoh: "A-B"
        processData: {
            submissionId: `SSW-${tahap.id_t_permohonan_det}`,
            applicantData: { ... },           // Data pemohon
        },
        metadata: {
            department: tahap.nm_opd,         // Dinas terkait
            processDate: tahap.tgl_proses,    // Tanggal proses
            ...
        },
        parentTokenId: parentTokenId          // Link ke stage sebelumnya
    };
    return payload;
}
```

**Penjelasan:**
- Membuat payload (paket data) untuk minting NFT
- `parentTokenId` = link ke stage sebelumnya (chain of custody)
- Data pemohon + metadata proses dicatat semua
- Dikirim ke blockchain untuk jadi NFT permanent

---

#### **3. Wizard Flow Control**

```javascript
showStageCard(stageIndex) {
    // Render 1 card untuk stage saat ini
    const stage = this.sswStages[stageIndex];
    const parentTokenId = stageIndex === 0 ? null : this.processedTokens[stageIndex - 1];
    
    // Tampilkan card dengan 2 tombol:
    // 1. "Daftarkan ke Blockchain" → proses minting
    // 2. "Lanjut ke Tahap Berikutnya" → pindah stage (muncul setelah sukses)
}

handleNextStage() {
    if (this.currentStageIndex === this.sswStages.length - 1) {
        // Kalau stage terakhir → ke Master NFT
        sessionStorage.setItem('processed-tokens', JSON.stringify(this.processedTokens));
        uiController.showStep('langkah-4');
    } else {
        // Kalau belum selesai → next stage
        this.currentStageIndex++;
        this.updateWizardProgress();      // Update progress dots
        this.showStageCard(this.currentStageIndex);  // Tampilkan card baru
    }
}
```

**Penjelasan:**
- User hanya lihat 1 card (stage aktif)
- Setelah proses selesai, tombol "Next" muncul
- Flow sequential (tidak bisa skip stage)
- Progress dots update otomatis (visual feedback)

---

#### **4. Master NFT Creation**

```javascript
async createMasterNFT() {
    const processedTokens = JSON.parse(sessionStorage.getItem('processed-tokens') || '[]');
    
    const payload = {
        processId: `PROC-${sswData.metadata.sampleId}`,
        chainTokenIds: processedTokens,      // Array 5 token ID dari stage A-F
        processData: {
            permitTitle: sswData.metadata.permitType,
            businessName: sswData.sswData[0].businessData.businessName,
            ...
        }
    };
    
    const result = await apiClient.mintMasterNFT(payload);
    // Result = Master NFT yang mengikat 5 stage NFT jadi 1 sertifikat
}
```

**Penjelasan:**
- Mengumpulkan 5 token ID dari stage A-F
- Membuat 1 Master NFT yang "mengikat" semua stage
- Master NFT = **Sertifikat Final** yang verifiable
- QR Code di-generate dari Master Token ID

---

#### **5. QR Code Generation**

```javascript
generateQRCode(masterTokenId, txHash) {
    const qrData = {
        tokenId: masterTokenId.toString(),
        contract: "0x8464135c8F25Da09e49BC8782676a84730C318bC",
        chainId: "31337"
    };
    
    const qr = new QRious({
        element: canvas,
        value: JSON.stringify(qrData),
        size: 128
    });
}
```

**Penjelasan:**
- QR Code berisi: Token ID, Contract Address, Chain ID
- Bisa di-scan untuk verifikasi instan
- Link ke blockchain explorer untuk detail lengkap

---

## 🔄 Flow Diagram Lengkap

```
┌──────────────────────────────────────────────────────────────┐
│ STEP 1: Input ID Permohonan                                  │
│ User masukkan ID → Validasi → Kalau benar lanjut            │
└───────────────────────────┬──────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 2: Inisialisasi Sistem                                 │
│ - Request JWT token                                          │
│ - Load data SSW dari sample                                  │
│ - Tampilkan detail permohonan                                │
└───────────────────────────┬──────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 3: Wizard Progress (5 Stages)                          │
│                                                              │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ Progress: [●]──○──○──○──○  (1/5)                   │    │
│ └─────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ Tahap A-B: Cek Berkas → Verifikasi Kepala Seksi    │    │
│ │ [Daftarkan ke Blockchain]                           │    │
│ └─────────────────────────────────────────────────────┘    │
│            ↓ User klik "Daftarkan ke Blockchain"           │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ Processing... (API call ke backend)                 │    │
│ └─────────────────────────────────────────────────────┘    │
│            ↓                                                 │
│ ┌─────────────────────────────────────────────────────┐    │
│ │ ✅ Berhasil! Token ID: #123                         │    │
│ │ [Lanjut ke Tahap B-C →]                            │    │
│ └─────────────────────────────────────────────────────┘    │
│            ↓ User klik "Lanjut ke Tahap B-C"               │
│                                                              │
│ Progress update: [✓]──[●]──○──○──○  (2/5)                  │
│ Card berganti jadi Tahap B-C                                │
│ ... ulangi sampai stage E-F selesai ...                     │
└───────────────────────────┬──────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 4: Buat Master NFT                                      │
│ - Kumpulkan 5 token ID dari stage A-F                       │
│ - Mint Master NFT (mengikat semua stage)                    │
│ [Buat Master NFT Sertifikat]                                │
└───────────────────────────┬──────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│ STEP 5: Sertifikat Final                                     │
│ ✅ Sertifikat Berhasil Diterbitkan!                         │
│ - Master Token ID: #789                                      │
│ - Transaction Hash: 0xabc123...                              │
│ - QR Code untuk verifikasi                                   │
│ [Unduh QR]  [Mulai Baru]                                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎨 Fitur UI/UX yang Diimplementasikan

### **1. SSW Surabaya Theme**
- ✅ Color palette resmi SSW (merah brand, hijau tosca)
- ✅ Font Poppins untuk konsistensi
- ✅ Card dengan border merah (brand identity)
- ✅ Button hijau tosca uppercase (CTA jelas)

### **2. Responsive Design**
- ✅ Desktop: 2 kolom layout (ilustrasi + form)
- ✅ Mobile: 1 kolom, ilustrasi hidden
- ✅ Wizard progress: scrollable di mobile
- ✅ Button full-width di mobile

### **3. Wizard Progress Indicator**
```
Desktop: [1]──[2]──[3]──[4]──[5]
         A-B  B-C  C-D  D-E  E-F

States:
- Gray = Belum dikerjakan
- Red = Sedang aktif
- Green = Sudah selesai
```

### **4. Real-time Status Updates**
- ✅ Status koneksi: Menunggu → Terhubung
- ✅ Status autentikasi: Menunggu → Terautentikasi
- ✅ Progress counter: "1/5 selesai, saat ini tahap B-C"

---

## 🔐 Keamanan & Data Integrity

### **1. Authentication**
- JWT Token dari backend
- Token disimpan di `sessionStorage` (tidak persistent)
- Setiap API call butuh token valid

### **2. Data Validation**
- ID permohonan harus valid (match dengan sample data)
- Sequential stage processing (tidak bisa skip)
- Error handling untuk setiap API call

### **3. Blockchain Security**
- Transaction hash sebagai proof
- Immutable record (tidak bisa dihapus/diubah)
- Smart contract verified di blockchain explorer

---

## 📊 Data Flow Detail

### **Input Data (dari SSW API)**
```json
{
  "metadata": {
    "sampleId": 1140402,
    "permitType": "Sertifikat Baru Standar Toko Obat",
    "department": "Dinas Kesehatan"
  },
  "sswData": [
    {
      "stageMapping": "A-B",
      "dari_proses": "Proses Cek Berkas Petugas BO",
      "ke_proses": "Verifikasi Kepala Seksi",
      "tgl_proses": "2025-03-24 09:44:58",
      "businessData": {
        "businessName": "Apotek Sehat Sentosa",
        "ownerName": "Apt. Budi Santoso, S.Farm"
      }
    }
    // ... 4 stages lainnya
  ]
}
```

### **Output Data (di Blockchain)**
```json
{
  "masterTokenId": 789,
  "transactionHash": "0xabc123def456...",
  "chainTokenIds": [123, 456, 789, 101, 112],
  "ipfsUrl": "ipfs://QmXyz.../metadata.json",
  "timestamp": "2025-11-18T10:30:00Z"
}
```

---

## 🚀 Kelebihan Sistem Ini

| Aspek | Sebelum (Manual) | Sesudah (Blockchain) |
|-------|------------------|---------------------|
| **Pencatatan** | Excel/Database terpusat | Blockchain distributed |
| **Verifikasi** | Telepon/email ke dinas | QR Code scan instant |
| **Manipulasi** | Bisa diubah | Immutable (tidak bisa) |
| **Transparansi** | Terbatas | Publik (bisa diaudit) |
| **Audit Trail** | Manual | Otomatis di blockchain |
| **Keamanan** | Bergantung admin | Kriptografi blockchain |

---

## 📈 Metric & Analytics Potensial

Data yang bisa di-track:
- ✅ Rata-rata waktu per stage
- ✅ Bottleneck di stage mana
- ✅ Success rate per departemen
- ✅ Total perizinan per bulan/tahun
- ✅ Compliance rate (SLA)

---

## 🛠️ Teknologi Stack

| Layer | Teknologi | Fungsi |
|-------|-----------|--------|
| **Frontend** | HTML5, CSS3, JavaScript ES6 | UI & User Interaction |
| **Styling** | Tailwind CSS, Custom CSS | Responsive Design |
| **Libraries** | jQuery, QRious | DOM Manipulation & QR |
| **Backend** | Node.js, Express.js | API Server |
| **Blockchain** | Hardhat, Ethereum | Smart Contract Deployment |
| **Storage** | IPFS | Metadata Storage |
| **Standard** | ERC-721 | NFT Token Standard |

---

## 🎯 Roadmap & Pengembangan Lanjutan

### **Phase 1 (Current - Dummy)**
- ✅ Wizard flow step-by-step
- ✅ NFT minting per stage
- ✅ Master NFT creation
- ✅ QR Code generation

### **Phase 2 (Production Ready)**
- 🔲 Integrasi dengan SSW API real
- 🔲 Multi-user authentication
- 🔲 Role-based access (pemohon, petugas, kepala dinas)
- 🔲 Email notification per stage

### **Phase 3 (Advanced Features)**
- 🔲 Dashboard analytics
- 🔲 Mobile app (React Native)
- 🔲 E-signature integration
- 🔲 Automated SLA monitoring

---

## 📞 Support & Maintenance

### **Dokumentasi Kode**
- Komentar inline di setiap function penting
- Naming convention yang jelas (camelCase)
- Modular structure (mudah maintain)

### **Error Handling**
- Try-catch di setiap async function
- User-friendly error messages
- Logging untuk debugging

### **Testing**
- Manual testing di Chrome, Firefox, Safari
- Responsive testing di mobile devices
- API testing dengan Postman

---

## 📝 Glossary (Istilah Penting)

| Istilah | Penjelasan Sederhana |
|---------|----------------------|
| **Blockchain** | Database terdistribusi yang tidak bisa diubah |
| **Smart Contract** | Program otomatis yang jalan di blockchain |
| **NFT** | Token digital unik (seperti sertifikat digital) |
| **Token ID** | Nomor identitas unik untuk setiap NFT |
| **Transaction Hash** | Kode unik untuk setiap transaksi blockchain (seperti nomor resi) |
| **IPFS** | Storage terdesentralisasi untuk file (seperti Dropbox blockchain) |
| **JWT** | Token untuk autentikasi (seperti kartu akses) |
| **Minting** | Proses membuat NFT baru di blockchain |
| **Parent Token** | NFT stage sebelumnya (untuk chain of custody) |
| **Master NFT** | NFT final yang mengikat semua stage NFT |
| **Immutable** | Tidak bisa diubah setelah tercatat |
| **Wizard** | Flow step-by-step (seperti tutorial game) |

---

## 🎤 Talking Points untuk Presentasi

### **1. Problem Statement**
- Proses perizinan manual rawan manipulasi
- Sulit verifikasi keaslian sertifikat
- Tidak ada audit trail yang jelas
- Transparansi rendah

### **2. Solution**
- Blockchain untuk pencatatan immutable
- NFT sebagai digital certificate
- QR Code untuk verifikasi instan
- Wizard flow untuk UX yang jelas

### **3. Benefits**
- **Transparansi**: Semua pihak bisa lihat progress
- **Keamanan**: Data tidak bisa dipalsukan
- **Efisiensi**: Proses otomatis, human error minimal
- **Audit**: Riwayat lengkap tersimpan permanen

### **4. Technical Highlight**
- Modern web tech (HTML5, ES6, Tailwind)
- Integration-ready dengan SSW API
- Responsive design (desktop & mobile)
- Scalable architecture

### **5. Next Steps**
- Pilot project dengan 1 jenis izin
- Integration dengan SSW production
- Training untuk staff
- Full deployment

---

## 📊 Demo Scenario untuk Presentasi

**Scenario:** Proses perizinan Apotek Sehat Sentosa

1. **Input ID**: `1140402`
2. **Validasi**: ✅ ID valid, data muncul
3. **Stage A-B**: Cek berkas → Mint NFT #123
4. **Stage B-C**: Verifikasi Kepala Seksi → Mint NFT #456 (parent: #123)
5. **Stage C-D**: Verifikasi Kepala Bidang → Mint NFT #789 (parent: #456)
6. **Stage D-E**: Verifikasi Sekretaris → Mint NFT #101 (parent: #789)
7. **Stage E-F**: Verifikasi Kepala Dinas → Mint NFT #112 (parent: #101)
8. **Master NFT**: Buat Master #999 yang mengikat 5 NFT
9. **QR Code**: Generate untuk verifikasi instant
10. **Verifikasi**: Scan QR → Link ke blockchain explorer

**Durasi demo:** ~5 menit  
**Highlight:** Wizard flow yang smooth, real-time updates, QR verification

---

## 🏆 Kesimpulan

Sistem **SSW Blockchain Dummy** ini adalah **proof of concept** yang menunjukkan:

✅ **Feasibility** teknologi blockchain untuk perizinan  
✅ **User Experience** yang smooth dengan wizard flow  
✅ **Integration** potential dengan SSW existing  
✅ **Scalability** untuk pengembangan lanjutan  

**Next Action:** Approval untuk pilot project dengan data real dan user testing.

---

**Dokumen ini dibuat untuk memudahkan pemahaman teknis bagi stakeholder non-technical.**  
**Untuk pertanyaan teknis detail, silakan hubungi tim development.**

---

*End of Documentation*
