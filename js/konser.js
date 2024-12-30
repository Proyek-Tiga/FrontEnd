// Referensi elemen
const btnTambahKonser = document.getElementById('btnTambahKonser');
const popupTambahKonser = document.getElementById('popupTambahKonser');
const btnBatalTambah = document.getElementById('btnBatalTambah');
const formTambahKonser = document.getElementById('formTambahKonser');
const tabelBody = document.querySelector('.data-table tbody');

// Fungsi untuk menyimpan data ke Local Storage
const saveToLocalStorage = (data) => {
    localStorage.setItem('konserData', JSON.stringify(data));
};

// Fungsi untuk mengambil data dari Local Storage
const loadFromLocalStorage = () => {
    const data = localStorage.getItem('konserData');
    return data ? JSON.parse(data) : [];
};

// Fungsi untuk merender data ke tabel
const renderTable = () => {
    const data = loadFromLocalStorage();
    tabelBody.innerHTML = '';
    data.forEach((item, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${item.tanggal}</td>
                <td>${item.namaKonser}</td>
                <td>${item.lokasi}</td>
                <td>${item.jumlahTiket}</td>
                <td>${item.harga}</td>
                <td>${item.penyelenggara}</td>
                <td>${item.status}</td>
                <td>
                    <button class="btn edit">Edit</button>
                    <button class="btn delete">Hapus</button>
                </td>
            </tr>
        `;
        tabelBody.insertAdjacentHTML('beforeend', row);
    });
};

// Event untuk menampilkan popup tambah konser
btnTambahKonser.addEventListener('click', () => {
    popupTambahKonser.style.display = 'flex';
});

// Event untuk menutup popup tambah konser
btnBatalTambah.addEventListener('click', () => {
    popupTambahKonser.style.display = 'none';
});

// Event untuk form submit (menambah data konser ke tabel)
formTambahKonser.addEventListener('submit', (event) => {
    event.preventDefault();

    const tanggal = document.getElementById('tanggal').value;
    const namaKonser = document.getElementById('namaKonser').value;
    const lokasi = document.getElementById('lokasi').value;
    const jumlahTiket = document.getElementById('jumlahTiket').value;
    const harga = document.getElementById('harga').value;
    const penyelenggara = document.getElementById('penyelenggara').value;
    const status = document.getElementById('status').value;

    if (!tanggal || !namaKonser || !lokasi || !jumlahTiket || !harga || !penyelenggara || !status) {
        Swal.fire('Gagal!', 'Semua kolom wajib diisi!', 'error');
        return;
    }

    const konserData = loadFromLocalStorage();
    konserData.push({ tanggal, namaKonser, lokasi, jumlahTiket, harga, penyelenggara, status });
    saveToLocalStorage(konserData);

    formTambahKonser.reset();
    popupTambahKonser.style.display = 'none';
    renderTable();

    Swal.fire('Berhasil!', 'Data konser berhasil ditambahkan.', 'success');
});

// Event untuk menghapus atau mengedit data
tabelBody.addEventListener('click', (event) => {
    const target = event.target;

    const konserData = loadFromLocalStorage();

    if (target.classList.contains('delete')) {
        const row = target.closest('tr');
        const index = row.rowIndex - 1;

        Swal.fire({
            title: `Hapus konser "${konserData[index].namaKonser}"?`,
            text: 'Data ini akan dihapus secara permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                konserData.splice(index, 1);
                saveToLocalStorage(konserData);
                renderTable();
                Swal.fire('Terhapus!', 'Data konser berhasil dihapus.', 'success');
            }
        });
    }

    if (target.classList.contains('edit')) {
        const row = target.closest('tr');
        const index = row.rowIndex - 1;
        const konser = konserData[index];

        Swal.fire({
            title: 'Edit Data Konser',
            html: `
                <label for="swalTanggal">Tanggal:</label>
                <input type="date" id="swalTanggal" class="swal2-input" value="${konser.tanggal}">
                <label for="swalNamaKonser">Nama Konser:</label>
                <input type="text" id="swalNamaKonser" class="swal2-input" value="${konser.namaKonser}">
                <label for="swalLokasi">Lokasi:</label>
                <input type="text" id="swalLokasi" class="swal2-input" value="${konser.lokasi}">
                <label for="swalJumlahTiket">Jumlah Tiket:</label>
                <input type="number" id="swalJumlahTiket" class="swal2-input" value="${konser.jumlahTiket}">
                <label for="swalHarga">Harga:</label>
                <input type="number" id="swalHarga" class="swal2-input" value="${konser.harga}">
                <label for="swalPenyelenggara">Nama Penyelenggara:</label>
                <input type="text" id="swalPenyelenggara" class="swal2-input" value="${konser.penyelenggara}">
                <label for="swalStatus">Status:</label>
                <select id="swalStatus" class="swal2-select">
                    <option value="Setuju" ${konser.status === 'Setuju' ? 'selected' : ''}>Setuju</option>
                    <option value="Tidak Setuju" ${konser.status === 'Tidak Setuju' ? 'selected' : ''}>Tidak Setuju</option>
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const newTanggal = document.getElementById('swalTanggal').value;
                const newNamaKonser = document.getElementById('swalNamaKonser').value;
                const newLokasi = document.getElementById('swalLokasi').value;
                const newJumlahTiket = document.getElementById('swalJumlahTiket').value;
                const newHarga = document.getElementById('swalHarga').value;
                const newPenyelenggara = document.getElementById('swalPenyelenggara').value;
                const newStatus = document.getElementById('swalStatus').value;

                if (!newTanggal || !newNamaKonser || !newLokasi || !newJumlahTiket || !newHarga || !newPenyelenggara || !newStatus) {
                    Swal.showValidationMessage('Semua kolom wajib diisi!');
                }

                return { newTanggal, newNamaKonser, newLokasi, newJumlahTiket, newHarga, newPenyelenggara, newStatus };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                konserData[index] = { ...result.value };
                saveToLocalStorage(konserData);
                renderTable();

                Swal.fire('Berhasil!', 'Data konser berhasil diperbarui.', 'success');
            }
        });
    }
});

// Muat data saat halaman pertama kali dimuat
document.addEventListener('DOMContentLoaded', renderTable);
