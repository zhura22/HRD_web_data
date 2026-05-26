// ========== DATA KARYAWAN DEFAULT ==========
const DEFAULT_EMPLOYEES = [
  { id: 1, nik: "198501230001", nama: "Budi Santoso", jabatan: "Kepala Produksi", divisi: "Produksi", status: "Tetap", gender: "L", gaji: 8500000, birthDate: "1985-01-23", joinDate: "2018-02-10", phone: "081234000001", email: "budi@kmsu.co.id", performance: 88, absensi: 94 },
  { id: 2, nik: "199002150002", nama: "Siti Aminah", jabatan: "HRD Supervisor", divisi: "HRD", status: "Tetap", gender: "P", gaji: 7500000, birthDate: "1990-02-15", joinDate: "2020-06-15", phone: "081234000002", email: "siti@kmsu.co.id", performance: 91, absensi: 97 },
  { id: 3, nik: "199503120003", nama: "Rizky Pratama", jabatan: "Operator Mesin I", divisi: "Produksi", status: "Kontrak", gender: "L", gaji: 3500000, birthDate: "1995-03-12", joinDate: "2023-01-20", phone: "081234000003", email: "rizky@kmsu.co.id", performance: 76, absensi: 88 },
  { id: 4, nik: "198810050004", nama: "Dewi Lestari", jabatan: "Manajer Keuangan", divisi: "Keuangan", status: "Tetap", gender: "P", gaji: 12000000, birthDate: "1988-10-05", joinDate: "2015-09-01", phone: "081234000004", email: "dewi@kmsu.co.id", performance: 94, absensi: 98 },
  { id: 5, nik: "199212200005", nama: "Agus Wibowo", jabatan: "Kepala Gudang", divisi: "Gudang", status: "Tetap", gender: "L", gaji: 6200000, birthDate: "1992-12-20", joinDate: "2019-11-11", phone: "081234000005", email: "agus@kmsu.co.id", performance: 85, absensi: 93 },
  { id: 6, nik: "199707080006", nama: "Hendra Kurniawan", jabatan: "QC Inspector Senior", divisi: "QC", status: "Tetap", gender: "L", gaji: 5200000, birthDate: "1997-07-08", joinDate: "2021-03-05", phone: "081234000006", email: "hendra@kmsu.co.id", performance: 82, absensi: 91 },
  { id: 7, nik: "199305190007", nama: "Ratna Wijayanti", jabatan: "Staf Administrasi", divisi: "Administrasi", status: "Tetap", gender: "P", gaji: 3800000, birthDate: "1993-05-19", joinDate: "2022-08-01", phone: "081234000007", email: "ratna@kmsu.co.id", performance: 87, absensi: 95 },
  { id: 8, nik: "200001150008", nama: "Faisal Abdullah", jabatan: "Operator Mesin II", divisi: "Produksi", status: "Kontrak", gender: "L", gaji: 3200000, birthDate: "2000-01-15", joinDate: "2024-01-15", phone: "081234000008", email: "faisal@kmsu.co.id", performance: 72, absensi: 86 },
  { id: 9, nik: "199609240009", nama: "Nur Hasanah", jabatan: "Staf Akuntansi", divisi: "Keuangan", status: "Tetap", gender: "P", gaji: 4500000, birthDate: "1996-09-24", joinDate: "2021-07-01", phone: "081234000009", email: "nur@kmsu.co.id", performance: 89, absensi: 96 },
  { id: 10, nik: "199811030010", nama: "Dimas Setyawan", jabatan: "IT Support", divisi: "IT", status: "Kontrak", gender: "L", gaji: 4500000, birthDate: "1998-11-03", joinDate: "2023-05-10", phone: "081234000010", email: "dimas@kmsu.co.id", performance: 80, absensi: 90 },
  { id: 11, nik: "200103280011", nama: "Wahyu Prasetyo", jabatan: "Operator Mesin III", divisi: "Produksi", status: "Kontrak", gender: "L", gaji: 3200000, birthDate: "2001-03-28", joinDate: "2024-03-01", phone: "081234000011", email: "wahyu@kmsu.co.id", performance: 70, absensi: 84 },
  { id: 12, nik: "199410120012", nama: "Linda Sari", jabatan: "Staf Marketing", divisi: "Marketing", status: "Tetap", gender: "P", gaji: 4200000, birthDate: "1994-10-12", joinDate: "2022-04-15", phone: "081234000012", email: "linda@kmsu.co.id", performance: 86, absensi: 94 },
  { id: 13, nik: "198205100013", nama: "Suryanto Pratama", jabatan: "Direktur Operasional", divisi: "Direksi", status: "Tetap", gender: "L", gaji: 25000000, birthDate: "1982-05-10", joinDate: "2010-01-03", phone: "081234000013", email: "surya@kmsu.co.id", performance: 96, absensi: 99 }
];

let employees = [];

// ========== HELPER INTERNAL ==========
function saveToLocalStorage() {
  localStorage.setItem('kmsu_hris_v4', JSON.stringify(employees));
}

function generateRandomScore() {
  return Math.floor(Math.random() * 20 + 74); // 74-94
}

function generateRandomAbsensi() {
  return Math.floor(Math.random() * 12 + 86); // 86-98
}

// ========== PUBLIC API ==========
export function loadInitialData() {
  const stored = localStorage.getItem('kmsu_hris_v4');
  if (stored) {
    employees = JSON.parse(stored);
  } else {
    employees = [...DEFAULT_EMPLOYEES];
    saveToLocalStorage();
  }
}

export function getEmployees() {
  return [...employees]; // return copy to avoid mutation
}

export function getEmployeeById(id) {
  return employees.find(emp => emp.id === id);
}

export function addEmployee(empData) {
  const newId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
  const newEmployee = {
    id: newId,
    ...empData,
    performance: generateRandomScore(),
    absensi: generateRandomAbsensi()
  };
  employees.push(newEmployee);
  saveToLocalStorage();
  return newEmployee;
}

export function updateEmployee(id, updatedData) {
  const index = employees.findIndex(emp => emp.id === id);
  if (index === -1) return null;
  // Preserve existing performance/absensi unless explicitly provided
  const existing = employees[index];
  const updated = {
    ...existing,
    ...updatedData,
    id: existing.id // ensure id not changed
  };
  employees[index] = updated;
  saveToLocalStorage();
  return updated;
}

export function deleteEmployee(id) {
  const index = employees.findIndex(emp => emp.id === id);
  if (index === -1) return false;
  employees.splice(index, 1);
  saveToLocalStorage();
  return true;
}

export function resetToDefault() {
  employees = [...DEFAULT_EMPLOYEES];
  saveToLocalStorage();
}

// Optional: get total gaji, etc.
export function getTotalGaji() {
  return employees.reduce((sum, emp) => sum + emp.gaji, 0);
}

export function getStatistik() {
  const total = employees.length;
  const tetap = employees.filter(e => e.status === 'Tetap').length;
  const kontrak = total - tetap;
  const laki = employees.filter(e => e.gender === 'L').length;
  const perempuan = total - laki;
  const divisiCount = {};
  employees.forEach(e => divisiCount[e.divisi] = (divisiCount[e.divisi] || 0) + 1);
  return { total, tetap, kontrak, laki, perempuan, divisiCount };
}