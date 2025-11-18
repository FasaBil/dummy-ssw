// fetch_ssw_sample.js - Script untuk fetch SSW sample data
const https = require('https');
const fs = require('fs');

// ========================================
// 🔐 INPUT USERNAME & PASSWORD DI SINI:
// ========================================
const SSW_CREDENTIALS = {
  username: "its_sby",    // ← GANTI INI
  password: "D@Fvjk95#fz1"     // ← GANTI INI
};

// SSW API Configuration (sudah sesuai dengan PDF)
const SSW_CONFIG = {
  baseURL: "https://api.surabaya.go.id",
  loginEndpoint: "/integrasi/api/login",
  dataEndpoint: "/integrasi/api/ssw/non-retribusi/detail",
  targetId: 1140402  // Sample ID untuk fetch
};

console.log('🔄 Starting SSW sample data fetch...');
console.log('📋 Target ID:', SSW_CONFIG.targetId);

// Script akan berjalan setelah Anda input username/password
fetchSSWSample();

async function fetchSSWSample() {
  try {
    console.log('🔐 Step 1: Getting authentication token...');
    const token = await getSSWToken();
    
    console.log('📊 Step 2: Fetching sample data...');
    const sampleData = await getSSWData(token);
    
    console.log('💾 Step 3: Saving sample data...');
    saveSampleData(sampleData);
    
    console.log('🎉 SSW sample data fetch completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('🔄 Creating mock data for development...');
    createMockData();
  }
}

// Function to get JWT token from SSW
async function getSSWToken() {
  const loginData = JSON.stringify({
    username: SSW_CREDENTIALS.username,
    password: SSW_CREDENTIALS.password
  });

  const options = {
    hostname: 'api.surabaya.go.id',
    port: 443,
    path: SSW_CONFIG.loginEndpoint,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status === 'success' && response.token) {
            console.log('✅ Token obtained successfully');
            resolve(response.token);
          } else {
            reject(new Error('Failed to get token: ' + response.message));
          }
        } catch (err) {
          reject(new Error('Invalid response format'));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error('Network error: ' + err.message));
    });

    req.write(loginData);
    req.end();
  });
}

// Function to get SSW data using token
async function getSSWData(token) {
  const options = {
    hostname: 'api.surabaya.go.id',
    port: 443,
    path: `${SSW_CONFIG.dataEndpoint}?id_t_permohonan_det=${SSW_CONFIG.targetId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.status === true && response.data) {
            console.log('✅ Sample data fetched successfully');
            console.log('📊 Records found:', response.data.length);
            resolve(response);
          } else {
            reject(new Error('No data found or invalid response'));
          }
        } catch (err) {
          reject(new Error('Invalid response format'));
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error('Network error: ' + err.message));
    });

    req.end();
  });
}

// Save sample data to files
function saveSampleData(rawData) {
  // Save raw response
  fs.writeFileSync('ssw_raw_response.json', JSON.stringify(rawData, null, 2));
  console.log('💾 Raw response saved to: ssw_raw_response.json');

  // Process and format for dummy usage
  const formattedData = processSSWResponse(rawData);
  fs.writeFileSync('ssw_sample_data.js', formatAsJSModule(formattedData));
  console.log('📝 Formatted sample saved to: ssw_sample_data.js');
}

// Process SSW response for dummy system
function processSSWResponse(rawData) {
  const processedData = {
    metadata: {
      fetchDate: new Date().toISOString(),
      recordCount: rawData.data.length,
      sampleId: rawData.data[0]?.id_t_permohonan_det,
      permitType: rawData.data[0]?.nm_ijin,
      department: rawData.data[0]?.nm_opd
    },
    sswData: rawData.data.map((record, index) => ({
      ...record,
      stageMapping: mapToGovChainStage(index),
      businessData: generateBusinessMapping(record)
    }))
  };

  return processedData;
}

// Map SSW records to GovChain stages
function mapToGovChainStage(index) {
  const stageMap = ['A-B', 'B-C', 'C-D', 'D-E', 'E-F'];
  return stageMap[index] || `STAGE-${index + 1}`;
}

// Generate business data mapping
function generateBusinessMapping(sswRecord) {
  const permitType = sswRecord.nm_ijin || 'Unknown';
  
  return {
    businessName: generateBusinessNameFromPermit(permitType),
    businessType: extractBusinessTypeFromPermit(permitType),
    address: generateAddress(sswRecord.nm_opd),
    ownerName: generateOwnerName(permitType),
    department: sswRecord.nm_opd,
    processType: sswRecord.nm_layanan
  };
}

// Business name generation
function generateBusinessNameFromPermit(permitType) {
  if (permitType.includes('Toko Obat')) return 'Apotek Sehat Sentosa';
  if (permitType.includes('Restoran')) return 'Restoran Nusantara';
  if (permitType.includes('Hotel')) return 'Hotel Bintang Lima';
  if (permitType.includes('Perdagangan')) return 'PT Dagang Makmur';
  return `PT ${permitType.split(' ').pop() || 'Demo'} Sentosa`;
}

// Business type extraction
function extractBusinessTypeFromPermit(permitType) {
  if (permitType.includes('Toko Obat')) return 'Apotek';
  if (permitType.includes('Restoran')) return 'Kuliner';
  if (permitType.includes('Hotel')) return 'Perhotelan';
  if (permitType.includes('Perdagangan')) return 'Perdagangan';
  return 'Usaha Umum';
}

// Owner name generation
function generateOwnerName(permitType) {
  if (permitType.includes('Toko Obat')) return 'Apt. Budi Santoso, S.Farm';
  if (permitType.includes('Restoran')) return 'H. Ahmad Wijaya';
  if (permitType.includes('Hotel')) return 'Ir. Siti Rahayu';
  return 'Drs. Made Wirawan';
}

// Address generation
function generateAddress(department) {
  const cityMap = {
    'Dinas Kesehatan': 'Surabaya',
    'Dinas Perdagangan': 'Surabaya',
    'Dinas Perindustrian': 'Surabaya'
  };
  
  const city = cityMap[department] || 'Surabaya';
  const street = department ? department.replace('Dinas ', '') : 'Pemerintahan';
  const number = Math.floor(Math.random() * 100) + 1;
  
  return `Jl. ${street} No. ${number}, Kota ${city}`;
}

// Format as JavaScript module
function formatAsJSModule(data) {
  return `// SSW Sample Data - Generated on ${new Date().toISOString()}
// This data was fetched ONCE from SSW API and used as mock data for Dummy SSW System

const SSW_SAMPLE_DATA = ${JSON.stringify(data, null, 2)};

// Export for use in Dummy SSW System
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SSW_SAMPLE_DATA;
}

// For browser usage
if (typeof window !== 'undefined') {
  window.SSW_SAMPLE_DATA = SSW_SAMPLE_DATA;
}
`;
}

// Create mock data if API fails
function createMockData() {
  const mockData = {
    metadata: {
      fetchDate: new Date().toISOString(),
      recordCount: 5,
      sampleId: 1140402,
      permitType: 'Sertifikat Baru Standar Toko Obat',
      department: 'Dinas Kesehatan',
      note: 'This is mock data - API was not accessible'
    },
    sswData: [
      {
        id: 5191418,
        id_t_permohonan_det: 1140402,
        nm_opd: "Dinas Kesehatan",
        nm_layanan: "Layanan Kesehatan",
        nm_ijin: "Sertifikat Baru Standar Toko Obat",
        dari_proses: "Proses Cek Berkas Petugas BO",
        ke_proses: "Verifikasi Kepala Seksi/ Subkoordinator",
        tgl_proses: "2025-03-24 09:44:58",
        keterangan_proses: "ok",
        stageMapping: "A-B",
        businessData: {
          businessName: "Apotek Sehat Sentosa",
          businessType: "Apotek",
          address: "Jl. Kesehatan No. 67, Kota Surabaya",
          ownerName: "Apt. Budi Santoso, S.Farm",
          department: "Dinas Kesehatan",
          processType: "Layanan Kesehatan"
        }
      }
      // Will be expanded with more mock records
    ]
  };

  fs.writeFileSync('ssw_sample_data.js', formatAsJSModule(mockData));
  console.log('📝 Mock data created: ssw_sample_data.js');
  console.log('⚠️  Remember to replace with real data when API is available');
}