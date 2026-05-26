import { addEmployee, updateEmployee, getEmployees } from '../core/data.js';
import { closeModal } from './ui-helpers.js';
import { showToast } from '../utils/helpers.js';
import { renderCurrentPage } from './navigation.js';

export function openEmployeeModal(employee = null) {
  const modal = document.getElementById('employeeModal');
  const title = document.getElementById('modalTitle');
  const form = document.getElementById('employeeForm');
  form.reset();
  document.getElementById('empId').value = '';

  if (employee) {
    title.textContent = 'Edit Data Karyawan';
    document.getElementById('empId').value = employee.id;
    document.getElementById('nik').value = employee.nik || '';
    document.getElementById('fullName').value = employee.nama || '';
    document.getElementById('jabatan').value = employee.jabatan || '';
    document.getElementById('divisi').value = employee.divisi || 'Produksi';
    document.getElementById('status').value = employee.status || 'Tetap';
    document.getElementById('gender').value = employee.gender || 'L';
    document.getElementById('gaji').value = employee.gaji || 0;
    document.getElementById('birthDate').value = employee.birthDate || '';
    document.getElementById('joinDate').value = employee.joinDate || '';
    document.getElementById('phone').value = employee.phone || '';
    document.getElementById('email').value = employee.email || '';
  } else {
    title.textContent = 'Tambah Karyawan Baru';
  }
  modal.classList.add('open');
}

export function initFormHandler() {
  const form = document.getElementById('employeeForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('empId').value;
    const employeeData = {
      nik: document.getElementById('nik').value.trim(),
      nama: document.getElementById('fullName').value.trim(),
      jabatan: document.getElementById('jabatan').value.trim(),
      divisi: document.getElementById('divisi').value,
      status: document.getElementById('status').value,
      gender: document.getElementById('gender').value,
      gaji: parseInt(document.getElementById('gaji').value) || 0,
      birthDate: document.getElementById('birthDate').value,
      joinDate: document.getElementById('joinDate').value || new Date().toISOString().split('T')[0],
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim()
    };

    if (id) {
      updateEmployee(parseInt(id), employeeData);
      showToast(`${employeeData.nama} berhasil diperbarui`, 'success');
    } else {
      // check duplicate NIK
      const existing = getEmployees().find(emp => emp.nik === employeeData.nik);
      if (existing) {
        showToast('NIK sudah terdaftar!', 'error');
        return;
      }
      addEmployee(employeeData);
      showToast(`${employeeData.nama} berhasil ditambahkan`, 'success');
    }
    closeModal('employeeModal');
    renderCurrentPage();
  });

  // attach close buttons
  document.querySelectorAll('[data-close="employeeModal"]').forEach(btn => {
    btn.addEventListener('click', () => closeModal('employeeModal'));
  });
}