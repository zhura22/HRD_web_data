const DEFAULT_EMPLOYEES = [
  {"id": 1, "nik": "198501230001", "nama": "Budi Santoso", "jabatan": "Kepala Produksi", "divisi": "Produksi", "status": "Tetap", "gender": "L", "gaji": 8500000, "birthDate": "1985-01-23", "joinDate": "2018-02-10", "phone": "081234000001", "email": "budi@kmsu.co.id", "performance": 88, "absensi": 94},
  {"id": 2, "nik": "199002150002", "nama": "Siti Aminah", "jabatan": "HRD Supervisor", "divisi": "Staff", "status": "Tetap", "gender": "P", "gaji": 7500000, "birthDate": "1990-02-15", "joinDate": "2020-06-15", "phone": "081234000002", "email": "siti@kmsu.co.id", "performance": 91, "absensi": 97},
  {"id": 3, "nik": "199503120003", "nama": "Rizky Pratama", "jabatan": "Operator Mesin I", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3500000, "birthDate": "1995-03-12", "joinDate": "2023-01-20", "phone": "081234000003", "email": "rizky@kmsu.co.id", "performance": 76, "absensi": 88},
  {"id": 4, "nik": "198810050004", "nama": "Dewi Lestari", "jabatan": "Manajer Keuangan", "divisi": "Staff", "status": "Tetap", "gender": "P", "gaji": 12000000, "birthDate": "1988-10-05", "joinDate": "2015-09-01", "phone": "081234000004", "email": "dewi@kmsu.co.id", "performance": 94, "absensi": 98},
  {"id": 5, "nik": "199212200005", "nama": "Agus Wibowo", "jabatan": "Kepala Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 6200000, "birthDate": "1992-12-20", "joinDate": "2019-11-11", "phone": "081234000005", "email": "agus@kmsu.co.id", "performance": 85, "absensi": 93},
  {"id": 6, "nik": "199707080006", "nama": "Hendra Kurniawan", "jabatan": "Pengawas QC", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 5200000, "birthDate": "1997-07-08", "joinDate": "2021-03-05", "phone": "081234000006", "email": "hendra@kmsu.co.id", "performance": 82, "absensi": 91},
  {"id": 7, "nik": "199305190007", "nama": "Ratna Wijayanti", "jabatan": "Staf Administrasi", "divisi": "Staff", "status": "Tetap", "gender": "P", "gaji": 3800000, "birthDate": "1993-05-19", "joinDate": "2022-08-01", "phone": "081234000007", "email": "ratna@kmsu.co.id", "performance": 87, "absensi": 95},
  {"id": 8, "nik": "200001150008", "nama": "Faisal Abdullah", "jabatan": "Operator Mesin II", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3200000, "birthDate": "2000-01-15", "joinDate": "2024-01-15", "phone": "081234000008", "email": "faisal@kmsu.co.id", "performance": 72, "absensi": 86},
  {"id": 9, "nik": "199609240009", "nama": "Nur Hasanah", "jabatan": "Staf Akuntansi", "divisi": "Staff", "status": "Tetap", "gender": "P", "gaji": 4500000, "birthDate": "1996-09-24", "joinDate": "2021-07-01", "phone": "081234000009", "email": "nur@kmsu.co.id", "performance": 89, "absensi": 96},
  {"id": 10, "nik": "199811030010", "nama": "Dimas Setyawan", "jabatan": "Staf IT", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 4500000, "birthDate": "1998-11-03", "joinDate": "2023-05-10", "phone": "081234000010", "email": "dimas@kmsu.co.id", "performance": 80, "absensi": 90},
  {"id": 11, "nik": "200103280011", "nama": "Wahyu Prasetyo", "jabatan": "Operator Mesin III", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3200000, "birthDate": "2001-03-28", "joinDate": "2024-03-01", "phone": "081234000011", "email": "wahyu@kmsu.co.id", "performance": 70, "absensi": 84},
  {"id": 12, "nik": "199410120012", "nama": "Linda Sari", "jabatan": "Staf Marketing", "divisi": "Staff", "status": "Tetap", "gender": "P", "gaji": 4200000, "birthDate": "1994-10-12", "joinDate": "2022-04-15", "phone": "081234000012", "email": "linda@kmsu.co.id", "performance": 86, "absensi": 94},
  {"id": 13, "nik": "198205100013", "nama": "Suryanto Pratama", "jabatan": "Direktur Operasional", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 25000000, "birthDate": "1982-05-10", "joinDate": "2010-01-03", "phone": "081234000013", "email": "surya@kmsu.co.id", "performance": 96, "absensi": 99},
  {"id": 14, "nik": "KMSU0014", "nama": "Ahmad Nur Fauzi", "jabatan": "Operator Sawmill", "divisi": "Sawmill", "status": "Tetap", "gender": "L", "gaji": 3487535, "birthDate": "1983-01-24", "joinDate": "2020-04-08", "phone": "081228728463", "email": "ahmadnurfauzi@kmsu.co.id", "performance": 77, "absensi": 96},
  {"id": 15, "nik": "KMSU0015", "nama": "Asnawi", "jabatan": "Operator Sawmill", "divisi": "Sawmill", "status": "Tetap", "gender": "L", "gaji": 3379043, "birthDate": "1982-10-14", "joinDate": "2018-01-03", "phone": "081239345092", "email": "asnawi@kmsu.co.id", "performance": 81, "absensi": 94},
  {"id": 16, "nik": "KMSU0016", "nama": "Mardi", "jabatan": "Kepala Bagian Sawmill", "divisi": "Sawmill", "status": "Tetap", "gender": "L", "gaji": 5644388, "birthDate": "1980-09-07", "joinDate": "2023-11-23", "phone": "081283140807", "email": "mardi@kmsu.co.id", "performance": 87, "absensi": 89},
  {"id": 17, "nik": "KMSU0017", "nama": "Mutaqim", "jabatan": "Operator Sawmill", "divisi": "Sawmill", "status": "Kontrak", "gender": "L", "gaji": 2971029, "birthDate": "1998-05-26", "joinDate": "2024-01-25", "phone": "081231429110", "email": "mutaqim@kmsu.co.id", "performance": 87, "absensi": 91},
  {"id": 18, "nik": "KMSU0018", "nama": "Nur Arifin", "jabatan": "Operator Sawmill", "divisi": "Sawmill", "status": "Kontrak", "gender": "L", "gaji": 2791369, "birthDate": "1984-04-25", "joinDate": "2020-02-03", "phone": "081260992979", "email": "nurarifin@kmsu.co.id", "performance": 77, "absensi": 91},
  {"id": 19, "nik": "KMSU0019", "nama": "Nur Kholis", "jabatan": "Operator Sawmill", "divisi": "Sawmill", "status": "Kontrak", "gender": "L", "gaji": 2860663, "birthDate": "1999-05-26", "joinDate": "2018-12-15", "phone": "081281971316", "email": "nurkholis@kmsu.co.id", "performance": 77, "absensi": 92},
  {"id": 20, "nik": "KMSU0020", "nama": "Ahmad Arifin", "jabatan": "Pengawas Produksi", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4270889, "birthDate": "1997-05-27", "joinDate": "2023-10-28", "phone": "081258537831", "email": "ahmadarifin@kmsu.co.id", "performance": 92, "absensi": 89},
  {"id": 21, "nik": "KMSU0021", "nama": "Budi Nurohmad", "jabatan": "Pengawas Produksi", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4260226, "birthDate": "1981-11-08", "joinDate": "2024-05-03", "phone": "081241244663", "email": "budinurohmad@kmsu.co.id", "performance": 77, "absensi": 92},
  {"id": 22, "nik": "KMSU0022", "nama": "Dul Rohman", "jabatan": "Pengawas Produksi", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4500623, "birthDate": "1994-11-27", "joinDate": "2020-03-12", "phone": "081257683626", "email": "dulrohman@kmsu.co.id", "performance": 80, "absensi": 96},
  {"id": 23, "nik": "KMSU0023", "nama": "Zuchron", "jabatan": "Mandor Produksi", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4487940, "birthDate": "2000-02-20", "joinDate": "2023-03-18", "phone": "081242857966", "email": "zuchron@kmsu.co.id", "performance": 79, "absensi": 93},
  {"id": 24, "nik": "KMSU0024", "nama": "Agus Wigati", "jabatan": "Pengawas Lapangan", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4617675, "birthDate": "1988-11-23", "joinDate": "2022-04-22", "phone": "081253524491", "email": "aguswigati@kmsu.co.id", "performance": 75, "absensi": 89},
  {"id": 25, "nik": "KMSU0025", "nama": "Darmadi", "jabatan": "Pengawas Lapangan", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4217024, "birthDate": "1990-07-09", "joinDate": "2018-04-19", "phone": "081252235350", "email": "darmadi@kmsu.co.id", "performance": 80, "absensi": 96},
  {"id": 26, "nik": "KMSU0026", "nama": "Maryadin", "jabatan": "Pengawas Lapangan", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4755829, "birthDate": "1992-11-15", "joinDate": "2019-05-05", "phone": "081243101783", "email": "maryadin@kmsu.co.id", "performance": 91, "absensi": 94},
  {"id": 27, "nik": "KMSU0027", "nama": "Rohmad Rifandani", "jabatan": "Mandor Lapangan", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4483054, "birthDate": "1998-07-19", "joinDate": "2021-06-08", "phone": "081228566572", "email": "rohmadrifandani@kmsu.co.id", "performance": 90, "absensi": 93},
  {"id": 28, "nik": "KMSU0028", "nama": "Hartono", "jabatan": "Pengawas Shift", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4284857, "birthDate": "1981-02-05", "joinDate": "2023-03-26", "phone": "081266661351", "email": "hartono@kmsu.co.id", "performance": 93, "absensi": 87},
  {"id": 29, "nik": "KMSU0029", "nama": "Nugroho", "jabatan": "Pengawas Shift", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4623802, "birthDate": "1992-10-15", "joinDate": "2022-05-18", "phone": "081211540956", "email": "nugroho@kmsu.co.id", "performance": 77, "absensi": 96},
  {"id": 30, "nik": "KMSU0030", "nama": "Sigit Adi K", "jabatan": "Pengawas Shift", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4799359, "birthDate": "1988-11-11", "joinDate": "2018-05-14", "phone": "081231227574", "email": "sigitadik@kmsu.co.id", "performance": 88, "absensi": 86},
  {"id": 31, "nik": "KMSU0031", "nama": "Supari", "jabatan": "Mandor Shift", "divisi": "Pengawas", "status": "Tetap", "gender": "L", "gaji": 4483801, "birthDate": "1996-03-17", "joinDate": "2018-11-10", "phone": "081295758349", "email": "supari@kmsu.co.id", "performance": 90, "absensi": 95},
  {"id": 32, "nik": "KMSU0032", "nama": "Adimas Purnama", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3309430, "birthDate": "1984-06-25", "joinDate": "2019-09-25", "phone": "081281182864", "email": "adimaspurnama@kmsu.co.id", "performance": 74, "absensi": 95},
  {"id": 33, "nik": "KMSU0033", "nama": "Agus Saryadi", "jabatan": "Staf Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3453892, "birthDate": "1995-01-04", "joinDate": "2020-05-08", "phone": "081217774584", "email": "agussaryadi@kmsu.co.id", "performance": 81, "absensi": 95},
  {"id": 34, "nik": "KMSU0034", "nama": "Almuanang", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2796474, "birthDate": "1982-02-24", "joinDate": "2021-02-25", "phone": "081281498611", "email": "almuanang@kmsu.co.id", "performance": 78, "absensi": 88},
  {"id": 35, "nik": "KMSU0035", "nama": "Durrohman", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2645899, "birthDate": "1995-09-06", "joinDate": "2020-09-28", "phone": "081291415657", "email": "durrohman@kmsu.co.id", "performance": 87, "absensi": 89},
  {"id": 36, "nik": "KMSU0036", "nama": "Jumari", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3835719, "birthDate": "1997-12-23", "joinDate": "2019-12-10", "phone": "081263551839", "email": "jumari@kmsu.co.id", "performance": 94, "absensi": 91},
  {"id": 37, "nik": "KMSU0037", "nama": "M Yayin", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2529690, "birthDate": "1996-08-04", "joinDate": "2019-04-03", "phone": "081255377076", "email": "myayin@kmsu.co.id", "performance": 74, "absensi": 95},
  {"id": 38, "nik": "KMSU0038", "nama": "Muhaimin", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2590414, "birthDate": "1987-10-08", "joinDate": "2018-02-23", "phone": "081294705205", "email": "muhaimin@kmsu.co.id", "performance": 75, "absensi": 89},
  {"id": 39, "nik": "KMSU0039", "nama": "Munir", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3338870, "birthDate": "1981-06-03", "joinDate": "2022-04-09", "phone": "081299788677", "email": "munir@kmsu.co.id", "performance": 89, "absensi": 89},
  {"id": 40, "nik": "KMSU0040", "nama": "Nursalim", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3610984, "birthDate": "1984-12-19", "joinDate": "2022-08-08", "phone": "081273481353", "email": "nursalim@kmsu.co.id", "performance": 87, "absensi": 89},
  {"id": 41, "nik": "KMSU0041", "nama": "Nurudin", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2349453, "birthDate": "1983-11-14", "joinDate": "2020-07-14", "phone": "081272682989", "email": "nurudin@kmsu.co.id", "performance": 75, "absensi": 96},
  {"id": 42, "nik": "KMSU0042", "nama": "Nuryanto", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2642598, "birthDate": "2000-02-02", "joinDate": "2021-12-11", "phone": "081224665841", "email": "nuryanto@kmsu.co.id", "performance": 81, "absensi": 89},
  {"id": 43, "nik": "KMSU0043", "nama": "Samidin", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3409696, "birthDate": "1997-08-05", "joinDate": "2021-03-09", "phone": "081272092888", "email": "samidin@kmsu.co.id", "performance": 81, "absensi": 87},
  {"id": 44, "nik": "KMSU0044", "nama": "Santoso", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2532328, "birthDate": "1997-02-02", "joinDate": "2023-09-27", "phone": "081211980765", "email": "santoso@kmsu.co.id", "performance": 76, "absensi": 98},
  {"id": 45, "nik": "KMSU0045", "nama": "Suhadi", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "L", "gaji": 3352647, "birthDate": "1985-07-16", "joinDate": "2021-04-28", "phone": "081263826716", "email": "suhadi@kmsu.co.id", "performance": 75, "absensi": 88},
  {"id": 46, "nik": "KMSU0046", "nama": "Trimah", "jabatan": "Staf Bahan Baku", "divisi": "Bahan Baku", "status": "Tetap", "gender": "P", "gaji": 3517120, "birthDate": "1980-07-09", "joinDate": "2024-08-10", "phone": "081266775103", "email": "trimah@kmsu.co.id", "performance": 91, "absensi": 96},
  {"id": 47, "nik": "KMSU0047", "nama": "Muhamad Riki", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2576652, "birthDate": "1995-03-07", "joinDate": "2020-04-02", "phone": "081287736262", "email": "muhamadriki@kmsu.co.id", "performance": 91, "absensi": 86},
  {"id": 48, "nik": "KMSU0048", "nama": "Wahyu Rizal A", "jabatan": "Operator Bahan Baku", "divisi": "Bahan Baku", "status": "Kontrak", "gender": "L", "gaji": 2692154, "birthDate": "1990-01-02", "joinDate": "2022-08-17", "phone": "081281286543", "email": "wahyurizala@kmsu.co.id", "performance": 79, "absensi": 86},
  {"id": 49, "nik": "KMSU0049", "nama": "Edy S", "jabatan": "Staf Teknik Senior", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 4985745, "birthDate": "1982-03-03", "joinDate": "2022-02-22", "phone": "081241568532", "email": "edys@kmsu.co.id", "performance": 86, "absensi": 87},
  {"id": 50, "nik": "KMSU0050", "nama": "Henry WCS", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 4177081, "birthDate": "1987-10-20", "joinDate": "2018-10-03", "phone": "081266267415", "email": "henrywcs@kmsu.co.id", "performance": 92, "absensi": 95},
  {"id": 51, "nik": "KMSU0051", "nama": "Heru S", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 4122994, "birthDate": "1990-05-07", "joinDate": "2023-12-11", "phone": "081242035886", "email": "herus@kmsu.co.id", "performance": 82, "absensi": 92},
  {"id": 52, "nik": "KMSU0052", "nama": "Komarudin", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 3670958, "birthDate": "2000-05-15", "joinDate": "2020-02-01", "phone": "081271510041", "email": "komarudin@kmsu.co.id", "performance": 93, "absensi": 95},
  {"id": 53, "nik": "KMSU0053", "nama": "M Andi Suryawan", "jabatan": "Staf Teknik Listrik", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 3635320, "birthDate": "1982-09-07", "joinDate": "2022-05-05", "phone": "081256843172", "email": "mandisuryawan@kmsu.co.id", "performance": 76, "absensi": 89},
  {"id": 54, "nik": "KMSU0054", "nama": "Sarno", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 3587477, "birthDate": "1989-03-15", "joinDate": "2024-09-23", "phone": "081250603163", "email": "sarno@kmsu.co.id", "performance": 93, "absensi": 98},
  {"id": 55, "nik": "KMSU0055", "nama": "Sihabudin", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 3885743, "birthDate": "1996-01-22", "joinDate": "2024-09-10", "phone": "081299038526", "email": "sihabudin@kmsu.co.id", "performance": 77, "absensi": 88},
  {"id": 56, "nik": "KMSU0056", "nama": "Sumantri", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 3477312, "birthDate": "1983-02-24", "joinDate": "2022-03-09", "phone": "081247816686", "email": "sumantri@kmsu.co.id", "performance": 93, "absensi": 89},
  {"id": 57, "nik": "KMSU0057", "nama": "Sunarto", "jabatan": "Staf Teknik Las", "divisi": "Staff", "status": "Tetap", "gender": "L", "gaji": 4347717, "birthDate": "1990-04-22", "joinDate": "2023-05-17", "phone": "081275569635", "email": "sunarto@kmsu.co.id", "performance": 82, "absensi": 86},
  {"id": 58, "nik": "KMSU0058", "nama": "Tatag P", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 3296781, "birthDate": "2000-07-27", "joinDate": "2020-01-01", "phone": "081254769200", "email": "tatagp@kmsu.co.id", "performance": 78, "absensi": 96},
  {"id": 59, "nik": "KMSU0059", "nama": "Trismiyanto", "jabatan": "Staf Teknik", "divisi": "Staff", "status": "Kontrak", "gender": "L", "gaji": 3474680, "birthDate": "1985-12-15", "joinDate": "2022-12-14", "phone": "081285283645", "email": "trismiyanto@kmsu.co.id", "performance": 74, "absensi": 87},
  {"id": 60, "nik": "KMSU0060", "nama": "Ikhsan Abdul Razaq", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2239449, "birthDate": "1984-09-02", "joinDate": "2024-06-19", "phone": "081284158663", "email": "ikhsanabdulrazaq@kmsu.co.id", "performance": 78, "absensi": 92},
  {"id": 61, "nik": "KMSU0061", "nama": "M Wafiq Fauzan", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2266818, "birthDate": "1981-05-12", "joinDate": "2024-01-12", "phone": "081238195995", "email": "mwafiqfauzan@kmsu.co.id", "performance": 81, "absensi": 96},
  {"id": 62, "nik": "KMSU0062", "nama": "Muhammad D Ulhaq", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2253893, "birthDate": "1991-09-28", "joinDate": "2021-10-24", "phone": "081230743797", "email": "muhammaddulhaq@kmsu.co.id", "performance": 81, "absensi": 88},
  {"id": 63, "nik": "KMSU0063", "nama": "Muhammad Taufik K.H", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2292826, "birthDate": "1993-01-06", "joinDate": "2023-06-26", "phone": "081265259205", "email": "muhammadtaufikkh@kmsu.co.id", "performance": 81, "absensi": 90},
  {"id": 64, "nik": "KMSU0064", "nama": "Muntholib", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2283465, "birthDate": "1983-07-28", "joinDate": "2018-08-08", "phone": "081236786211", "email": "muntholib@kmsu.co.id", "performance": 88, "absensi": 91},
  {"id": 65, "nik": "KMSU0065", "nama": "Nanang Nur Arifin", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2360007, "birthDate": "1987-04-01", "joinDate": "2023-04-13", "phone": "081254058573", "email": "nanangnurarifin@kmsu.co.id", "performance": 82, "absensi": 87},
  {"id": 66, "nik": "KMSU0066", "nama": "Supriyadi Bkl", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2346341, "birthDate": "1991-11-17", "joinDate": "2021-11-27", "phone": "081281969657", "email": "supriyadibkl@kmsu.co.id", "performance": 84, "absensi": 86},
  {"id": 67, "nik": "KMSU0067", "nama": "Surono", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2260472, "birthDate": "1988-03-19", "joinDate": "2020-01-04", "phone": "081290070438", "email": "surono@kmsu.co.id", "performance": 87, "absensi": 91},
  {"id": 68, "nik": "KMSU0068", "nama": "Irfan Yuniyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2581967, "birthDate": "1990-07-20", "joinDate": "2022-02-13", "phone": "081287388337", "email": "irfanyuniyanto@kmsu.co.id", "performance": 80, "absensi": 90},
  {"id": 69, "nik": "KMSU0069", "nama": "Ramadhan Kurniawan", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2223271, "birthDate": "1993-01-17", "joinDate": "2024-09-22", "phone": "081236445607", "email": "ramadhankurniawan@kmsu.co.id", "performance": 85, "absensi": 92},
  {"id": 70, "nik": "KMSU0070", "nama": "A Zaenal Arifin", "jabatan": "Operator Press", "divisi": "Press", "status": "Tetap", "gender": "L", "gaji": 2830709, "birthDate": "1990-10-11", "joinDate": "2023-02-24", "phone": "081250308572", "email": "azaenalarifin@kmsu.co.id", "performance": 90, "absensi": 90},
  {"id": 71, "nik": "KMSU0071", "nama": "Ahmad Maesuri", "jabatan": "Operator Press", "divisi": "Press", "status": "Tetap", "gender": "L", "gaji": 3519215, "birthDate": "1993-06-13", "joinDate": "2023-05-18", "phone": "081227084279", "email": "ahmadmaesuri@kmsu.co.id", "performance": 80, "absensi": 92},
  {"id": 72, "nik": "KMSU0072", "nama": "Asmadi Mustofa", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 3197229, "birthDate": "1992-11-24", "joinDate": "2019-10-19", "phone": "081250392808", "email": "asmadimustofa@kmsu.co.id", "performance": 86, "absensi": 94},
  {"id": 73, "nik": "KMSU0073", "nama": "Bekti Wibowo", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2500425, "birthDate": "1989-05-07", "joinDate": "2021-10-20", "phone": "081297873101", "email": "bektiwibowo@kmsu.co.id", "performance": 84, "absensi": 93},
  {"id": 74, "nik": "KMSU0074", "nama": "Buchori", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2963246, "birthDate": "1994-11-07", "joinDate": "2022-08-26", "phone": "081232775593", "email": "buchori@kmsu.co.id", "performance": 76, "absensi": 90},
  {"id": 75, "nik": "KMSU0075", "nama": "Hafiz Putra W", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 3040490, "birthDate": "2000-10-11", "joinDate": "2018-04-22", "phone": "081251663795", "email": "hafizputraw@kmsu.co.id", "performance": 81, "absensi": 98},
  {"id": 76, "nik": "KMSU0076", "nama": "Hendra Haryanto", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2708802, "birthDate": "1984-01-02", "joinDate": "2019-08-20", "phone": "081219774839", "email": "hendraharyanto@kmsu.co.id", "performance": 88, "absensi": 92},
  {"id": 77, "nik": "KMSU0077", "nama": "M Aziz Arafi", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 3160356, "birthDate": "1998-04-23", "joinDate": "2023-07-16", "phone": "081263640499", "email": "mazizarafi@kmsu.co.id", "performance": 81, "absensi": 88},
  {"id": 78, "nik": "KMSU0078", "nama": "Nurrohmat", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 3187926, "birthDate": "1980-02-25", "joinDate": "2021-04-06", "phone": "081279519112", "email": "nurrohmat@kmsu.co.id", "performance": 88, "absensi": 86},
  {"id": 79, "nik": "KMSU0079", "nama": "Ragil Widaryanto", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 3084482, "birthDate": "1987-02-15", "joinDate": "2019-08-22", "phone": "081281287314", "email": "ragilwidaryanto@kmsu.co.id", "performance": 91, "absensi": 95},
  {"id": 80, "nik": "KMSU0080", "nama": "Riza Prihartanto", "jabatan": "Kepala Bagian Press", "divisi": "Press", "status": "Tetap", "gender": "L", "gaji": 5315982, "birthDate": "1994-10-27", "joinDate": "2023-09-14", "phone": "081283534128", "email": "rizaprihartanto@kmsu.co.id", "performance": 88, "absensi": 88},
  {"id": 81, "nik": "KMSU0081", "nama": "Rudi Susanto", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2997732, "birthDate": "1994-05-25", "joinDate": "2019-11-09", "phone": "081279967676", "email": "rudisusanto@kmsu.co.id", "performance": 89, "absensi": 96},
  {"id": 82, "nik": "KMSU0082", "nama": "Sarbini", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2750867, "birthDate": "1988-08-03", "joinDate": "2023-05-08", "phone": "081246468984", "email": "sarbini@kmsu.co.id", "performance": 84, "absensi": 91},
  {"id": 83, "nik": "KMSU0083", "nama": "Sumarjono", "jabatan": "Operator Press", "divisi": "Press", "status": "Tetap", "gender": "L", "gaji": 3373029, "birthDate": "1982-03-05", "joinDate": "2019-07-23", "phone": "081230509175", "email": "sumarjono@kmsu.co.id", "performance": 80, "absensi": 87},
  {"id": 84, "nik": "KMSU0084", "nama": "Whendi Adi W", "jabatan": "Operator Press", "divisi": "Press", "status": "Kontrak", "gender": "L", "gaji": 2935020, "birthDate": "1993-06-18", "joinDate": "2021-07-02", "phone": "081237760841", "email": "whendiadiw@kmsu.co.id", "performance": 87, "absensi": 92},
  {"id": 85, "nik": "KMSU0085", "nama": "Ahmad Jafar", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 3423696, "birthDate": "1980-10-13", "joinDate": "2021-01-12", "phone": "081250079111", "email": "ahmadjafar@kmsu.co.id", "performance": 86, "absensi": 92},
  {"id": 86, "nik": "KMSU0086", "nama": "Ahmad Yudi Fahrudin", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 3370801, "birthDate": "1997-10-08", "joinDate": "2021-04-09", "phone": "081268496914", "email": "ahmadyudifahrudin@kmsu.co.id", "performance": 89, "absensi": 86},
  {"id": 87, "nik": "KMSU0087", "nama": "Azuar Efendi", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 3198520, "birthDate": "1990-11-22", "joinDate": "2024-07-24", "phone": "081232151928", "email": "azuarefendi@kmsu.co.id", "performance": 88, "absensi": 88},
  {"id": 88, "nik": "KMSU0088", "nama": "Budi Santoso S", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 3467731, "birthDate": "1997-01-13", "joinDate": "2022-10-22", "phone": "081213637575", "email": "budisantosos@kmsu.co.id", "performance": 76, "absensi": 96},
  {"id": 89, "nik": "KMSU0089", "nama": "M Jauhari", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Kontrak", "gender": "L", "gaji": 2949433, "birthDate": "1984-08-06", "joinDate": "2018-05-13", "phone": "081253936531", "email": "mjauhari@kmsu.co.id", "performance": 80, "absensi": 93},
  {"id": 90, "nik": "KMSU0090", "nama": "M Nur Sholeh", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Kontrak", "gender": "L", "gaji": 2842722, "birthDate": "1990-07-09", "joinDate": "2024-07-09", "phone": "081220993268", "email": "mnursholeh@kmsu.co.id", "performance": 89, "absensi": 86},
  {"id": 91, "nik": "KMSU0091", "nama": "Puji Widodo", "jabatan": "Kepala Bagian Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 5813948, "birthDate": "1997-01-12", "joinDate": "2019-11-03", "phone": "081297477029", "email": "pujiwidodo@kmsu.co.id", "performance": 75, "absensi": 98},
  {"id": 92, "nik": "KMSU0092", "nama": "Rohman K", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Kontrak", "gender": "L", "gaji": 2532537, "birthDate": "1987-04-27", "joinDate": "2018-10-05", "phone": "081242016960", "email": "rohmank@kmsu.co.id", "performance": 78, "absensi": 93},
  {"id": 93, "nik": "KMSU0093", "nama": "Slamet Zaedun", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Kontrak", "gender": "L", "gaji": 2619946, "birthDate": "1998-04-15", "joinDate": "2023-05-25", "phone": "081259512272", "email": "slametzaedun@kmsu.co.id", "performance": 79, "absensi": 95},
  {"id": 94, "nik": "KMSU0094", "nama": "Supriyadi S", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Kontrak", "gender": "L", "gaji": 3136745, "birthDate": "1983-03-10", "joinDate": "2018-10-01", "phone": "081251870192", "email": "supriyadis@kmsu.co.id", "performance": 92, "absensi": 96},
  {"id": 95, "nik": "KMSU0095", "nama": "Suharto", "jabatan": "Operator Sezing", "divisi": "Sezing", "status": "Tetap", "gender": "L", "gaji": 3182890, "birthDate": "1992-12-07", "joinDate": "2018-10-23", "phone": "081294187049", "email": "suharto@kmsu.co.id", "performance": 81, "absensi": 87},
  {"id": 96, "nik": "KMSU0096", "nama": "Bambang Irwanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Tetap", "gender": "L", "gaji": 3097855, "birthDate": "1999-02-26", "joinDate": "2022-01-12", "phone": "081281503856", "email": "bambangirwanto@kmsu.co.id", "performance": 87, "absensi": 96},
  {"id": 97, "nik": "KMSU0097", "nama": "Irfanudin", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2888571, "birthDate": "1982-09-21", "joinDate": "2020-01-28", "phone": "081266379329", "email": "irfanudin@kmsu.co.id", "performance": 89, "absensi": 87},
  {"id": 98, "nik": "KMSU0098", "nama": "M Hidayat", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2954582, "birthDate": "1991-11-27", "joinDate": "2021-12-05", "phone": "081268450095", "email": "mhidayat@kmsu.co.id", "performance": 79, "absensi": 97},
  {"id": 99, "nik": "KMSU0099", "nama": "M Khoirul Huda", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3047091, "birthDate": "2000-05-20", "joinDate": "2024-09-25", "phone": "081274893936", "email": "mkhoirulhuda@kmsu.co.id", "performance": 88, "absensi": 92},
  {"id": 100, "nik": "KMSU0100", "nama": "Muh Zuhri", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3121254, "birthDate": "1988-06-28", "joinDate": "2019-02-09", "phone": "081270505620", "email": "muhzuhri@kmsu.co.id", "performance": 81, "absensi": 98},
  {"id": 101, "nik": "KMSU0101", "nama": "Sistiyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2987282, "birthDate": "1998-10-22", "joinDate": "2021-06-01", "phone": "081276344695", "email": "sistiyanto@kmsu.co.id", "performance": 84, "absensi": 88},
  {"id": 102, "nik": "KMSU0102", "nama": "Sugiono", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3011233, "birthDate": "1986-06-26", "joinDate": "2020-06-09", "phone": "081290014570", "email": "sugiono@kmsu.co.id", "performance": 82, "absensi": 94},
  {"id": 103, "nik": "KMSU0103", "nama": "Suparjo", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2510644, "birthDate": "1996-04-03", "joinDate": "2019-12-14", "phone": "081275575808", "email": "suparjo@kmsu.co.id", "performance": 91, "absensi": 98},
  {"id": 104, "nik": "KMSU0104", "nama": "Suryadi", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2751997, "birthDate": "1995-11-23", "joinDate": "2021-08-26", "phone": "081212314351", "email": "suryadi@kmsu.co.id", "performance": 76, "absensi": 90},
  {"id": 105, "nik": "KMSU0105", "nama": "Syaiful Apriyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2732360, "birthDate": "1992-12-08", "joinDate": "2020-11-19", "phone": "081259529086", "email": "syaifulapriyanto@kmsu.co.id", "performance": 89, "absensi": 94},
  {"id": 106, "nik": "KMSU0106", "nama": "Timbul", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3056711, "birthDate": "1991-07-24", "joinDate": "2022-06-12", "phone": "081270900658", "email": "timbul@kmsu.co.id", "performance": 82, "absensi": 90},
  {"id": 107, "nik": "KMSU0107", "nama": "Wahyudi", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2763615, "birthDate": "1987-02-24", "joinDate": "2019-06-04", "phone": "081281922443", "email": "wahyudi@kmsu.co.id", "performance": 79, "absensi": 89},
  {"id": 108, "nik": "KMSU0108", "nama": "Zubidin", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2726895, "birthDate": "1995-05-24", "joinDate": "2022-09-20", "phone": "081247983442", "email": "zubidin@kmsu.co.id", "performance": 77, "absensi": 89},
  {"id": 109, "nik": "KMSU0109", "nama": "Agus Pardiyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2810636, "birthDate": "1987-06-06", "joinDate": "2020-01-23", "phone": "081281690398", "email": "aguspardiyanto@kmsu.co.id", "performance": 78, "absensi": 90},
  {"id": 110, "nik": "KMSU0110", "nama": "Arif Muslim", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2547726, "birthDate": "1981-09-10", "joinDate": "2023-03-21", "phone": "081275884623", "email": "arifmuslim@kmsu.co.id", "performance": 77, "absensi": 86},
  {"id": 111, "nik": "KMSU0111", "nama": "Eksan", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3101949, "birthDate": "1989-08-16", "joinDate": "2021-06-06", "phone": "081216895666", "email": "eksan@kmsu.co.id", "performance": 82, "absensi": 93},
  {"id": 112, "nik": "KMSU0112", "nama": "Eksan Nur Huda", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2619629, "birthDate": "1982-07-16", "joinDate": "2018-10-21", "phone": "081217195288", "email": "eksannurhuda@kmsu.co.id", "performance": 78, "absensi": 88},
  {"id": 113, "nik": "KMSU0113", "nama": "Joko Supadi", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3090180, "birthDate": "1989-02-08", "joinDate": "2018-09-25", "phone": "081265857931", "email": "jokosupadi@kmsu.co.id", "performance": 93, "absensi": 95},
  {"id": 114, "nik": "KMSU0114", "nama": "Muh Yudi", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3148458, "birthDate": "1987-09-13", "joinDate": "2021-08-10", "phone": "081288990506", "email": "muhyudi@kmsu.co.id", "performance": 87, "absensi": 90},
  {"id": 115, "nik": "KMSU0115", "nama": "Syarifudin Arif B", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3096251, "birthDate": "1999-01-20", "joinDate": "2023-02-25", "phone": "081237888820", "email": "syarifudinarifb@kmsu.co.id", "performance": 94, "absensi": 89},
  {"id": 116, "nik": "KMSU0116", "nama": "Sigit", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2777501, "birthDate": "1982-03-08", "joinDate": "2019-09-03", "phone": "081231009452", "email": "sigit@kmsu.co.id", "performance": 74, "absensi": 92},
  {"id": 117, "nik": "KMSU0117", "nama": "Ahmad Juari", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2972387, "birthDate": "1999-08-10", "joinDate": "2018-04-10", "phone": "081247945817", "email": "ahmadjuari@kmsu.co.id", "performance": 88, "absensi": 87},
  {"id": 118, "nik": "KMSU0118", "nama": "Dedi Setiawan", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2744762, "birthDate": "1988-11-19", "joinDate": "2023-04-14", "phone": "081225405014", "email": "dedisetiawan@kmsu.co.id", "performance": 91, "absensi": 89},
  {"id": 119, "nik": "KMSU0119", "nama": "Dwi Indra", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3179094, "birthDate": "1984-05-27", "joinDate": "2019-02-02", "phone": "081232269779", "email": "dwiindra@kmsu.co.id", "performance": 83, "absensi": 95},
  {"id": 120, "nik": "KMSU0120", "nama": "Jumar", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3096856, "birthDate": "1989-08-04", "joinDate": "2021-12-10", "phone": "081264023778", "email": "jumar@kmsu.co.id", "performance": 82, "absensi": 94},
  {"id": 121, "nik": "KMSU0121", "nama": "Nurul Huda", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3066211, "birthDate": "1995-08-03", "joinDate": "2022-01-14", "phone": "081253261270", "email": "nurulhuda@kmsu.co.id", "performance": 93, "absensi": 90},
  {"id": 122, "nik": "KMSU0122", "nama": "Subiyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2527121, "birthDate": "1982-04-22", "joinDate": "2024-10-19", "phone": "081212784407", "email": "subiyanto@kmsu.co.id", "performance": 82, "absensi": 95},
  {"id": 123, "nik": "KMSU0123", "nama": "Suharyanto", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2542185, "birthDate": "1985-08-17", "joinDate": "2023-08-09", "phone": "081234359060", "email": "suharyanto@kmsu.co.id", "performance": 92, "absensi": 92},
  {"id": 124, "nik": "KMSU0124", "nama": "Budi Nurrohman", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3165620, "birthDate": "1995-02-16", "joinDate": "2020-07-11", "phone": "081253091709", "email": "budinurrohman@kmsu.co.id", "performance": 77, "absensi": 88},
  {"id": 125, "nik": "KMSU0125", "nama": "Dhimas Wahyu W", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2845824, "birthDate": "1993-12-16", "joinDate": "2020-11-13", "phone": "081283832717", "email": "dhimaswahyuw@kmsu.co.id", "performance": 75, "absensi": 93},
  {"id": 126, "nik": "KMSU0126", "nama": "Muhamad Wahyu S", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2592337, "birthDate": "1990-05-11", "joinDate": "2018-07-28", "phone": "081279067939", "email": "muhamadwahyus@kmsu.co.id", "performance": 74, "absensi": 96},
  {"id": 127, "nik": "KMSU0127", "nama": "Afif Rozan", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3068950, "birthDate": "1994-07-02", "joinDate": "2019-09-12", "phone": "081293568503", "email": "afifrozan@kmsu.co.id", "performance": 89, "absensi": 96},
  {"id": 128, "nik": "KMSU0128", "nama": "Jumarno", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2963513, "birthDate": "1981-04-09", "joinDate": "2022-03-10", "phone": "081268802946", "email": "jumarno@kmsu.co.id", "performance": 89, "absensi": 87},
  {"id": 129, "nik": "KMSU0129", "nama": "Ratmoko", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 2530271, "birthDate": "2000-10-26", "joinDate": "2019-12-06", "phone": "081251708177", "email": "ratmoko@kmsu.co.id", "performance": 91, "absensi": 86},
  {"id": 130, "nik": "KMSU0130", "nama": "Ariful Zaenuri", "jabatan": "Operator Produksi", "divisi": "Produksi", "status": "Kontrak", "gender": "L", "gaji": 3079077, "birthDate": "1993-02-08", "joinDate": "2024-02-15", "phone": "081225766039", "email": "arifulzaenuri@kmsu.co.id", "performance": 94, "absensi": 88}
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