let state = {
  currentPage: 'dashboard',
  filterDivisi: 'Semua',
  filterStatus: 'Semua',
  karyawanPage: 1,
  itemsPerPage: 8,
  searchQuery: ''
};

const subscribers = [];

export function getState() {
  return { ...state };
}

export function setState(updates) {
  state = { ...state, ...updates };
  notifySubscribers();
}

export function subscribe(callback) {
  subscribers.push(callback);
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) subscribers.splice(index, 1);
  };
}

function notifySubscribers() {
  subscribers.forEach(cb => cb(state));
}

export function initState() {
  notifySubscribers();
}