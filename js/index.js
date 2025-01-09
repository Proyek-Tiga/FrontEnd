// Referensi elemen
const btnTambahKonser = document.getElementById('btnTambahKonser');
const popupTambahKonser = document.getElementById('popupTambahKonser');
const btnBatalTambah = document.getElementById('btnBatalTambah');
const formTambahKonser = document.getElementById('formTambahKonser');
const tabelBody = document.querySelector('.data-table tbody');

const token = localStorage.getItem("authToken");
if (token) {
    console.log("Token ditemukan:", token);
} else {
    console.log("Token tidak ditemukan. Harap login ulang.");
}

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

    const lokasi = document.getElementById('lokasi').value;
    const kapasitas = document.getElementById('kapasitas').value;

    if (!lokasi || !kapasitas) {
        Swal.fire('Gagal!', 'Semua kolom wajib diisi!', 'error');
        return;
    }

    const rowCount = tabelBody.rows.length + 1;
    const newRow = `
        <tr>
            <td>${rowCount}</td>
            <td>${lokasi}</td>
            <td>${kapasitas}</td>
            <td>
                <button class="btn edit">Edit</button>
                <button class="btn delete">Hapus</button>
            </td>
        </tr>
    `;
    tabelBody.insertAdjacentHTML('beforeend', newRow);

    formTambahKonser.reset();
    popupTambahKonser.style.display = 'none';

    Swal.fire('Berhasil!', 'Data konser berhasil ditambahkan.', 'success');
});

// Event untuk menghapus atau mengedit data
tabelBody.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('delete')) {
        const row = target.closest('tr');
        const lokasi = row.cells[1].textContent;

        Swal.fire({
            title: `Hapus konser di ${lokasi}?`,
            text: 'Data ini akan dihapus secara permanen.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                tabelBody.removeChild(row);
                [...tabelBody.rows].forEach((row, index) => {
                    row.cells[0].textContent = index + 1;
                });
                Swal.fire('Terhapus!', 'Data konser berhasil dihapus.', 'success');
            }
        });
    }

    if (target.classList.contains('edit')) {
        const row = target.closest('tr');
        const lokasi = row.cells[1].textContent;
        const kapasitas = row.cells[2].textContent;

        Swal.fire({
            title: 'Edit Data Konser',
            html: `
                <label for="swalLokasi">Lokasi:</label>
                <input type="text" id="swalLokasi" class="swal2-input" value="${lokasi}">
                <label for="swalKapasitas">Kapasitas Orang:</label>
                <input type="number" id="swalKapasitas" class="swal2-input" value="${kapasitas}">
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const newLokasi = document.getElementById('swalLokasi').value;
                const newKapasitas = document.getElementById('swalKapasitas').value;

                if (!newLokasi || !newKapasitas) {
                    Swal.showValidationMessage('Semua kolom wajib diisi!');
                }

                return { newLokasi, newKapasitas };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { newLokasi, newKapasitas } = result.value;
                row.cells[1].textContent = newLokasi;
                row.cells[2].textContent = newKapasitas;

                Swal.fire('Berhasil!', 'Data konser berhasil diperbarui.', 'success');
            }
        });
    }
});

function logout() {
    localStorage.removeItem("authToken");
    alert("Anda telah logout.");
    window.location.href = "index.html"; // Kembali ke halaman login
}

