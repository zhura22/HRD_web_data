import { getEmployees } from '../core/data.js';
import { showToast } from '../utils/helpers.js';

function downloadBlob(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCSV() {
  const employees = getEmployees();
  const headers = ['ID', 'NIK', 'Nama', 'Jabatan', 'Divisi', 'Status', 'Gender', 'Gaji', 'Bergabung', 'Email', 'Telepon', 'Performa', 'Absensi'];
  const rows = employees.map(e => [
    e.id, e.nik, e.nama, e.jabatan, e.divisi, e.status, e.gender, e.gaji, e.joinDate, e.email || '', e.phone || '', e.performance || 0, e.absensi || 0
  ]);
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  downloadBlob(csvContent, 'KMSU_Karyawan.csv', 'text/csv;charset=utf-8;');
  showToast('Export CSV berhasil', 'success');
}

export function exportToJSON() {
  const employees = getEmployees();
  const jsonContent = JSON.stringify(employees, null, 2);
  downloadBlob(jsonContent, 'KMSU_Karyawan.json', 'application/json');
  showToast('Export JSON berhasil', 'success');
}