// Referensi elemen
const btnTambahKonser = document.getElementById('btnTambahKonser');
const popupTambahKonser = document.getElementById('popupTambahKonser');
const btnBatalTambah = document.getElementById('btnBatalTambah');
const formTambahKonser = document.getElementById('formTambahKonser');
const tabelBody = document.querySelector('.data-table tbody');

// Event untuk menampilkan popup tambah konser
btnTambahKonser.addEventListener('click', () => {
    popupTambahKonser.style.display = 'flex';
});

// Event untuk menutup popup tambah konser
btnBatalTambah.addEventListener('click', () => {
    popupTambahKonser.style.display = 'none';
});

// Event untuk form submit (menambah data konser ke tabel dan database)
formTambahKonser.addEventListener('submit', async (event) => {
    event.preventDefault();

    const lokasi = document.getElementById('lokasi').value;
    const kapasitas = document.getElementById('kapasitas').value;

    if (!lokasi || !kapasitas) {
        Swal.fire('Gagal!', 'Semua kolom wajib diisi!', 'error');
        return;
    }

    const data = {
        lokasi: lokasi,
        tiket: parseInt(kapasitas), // Menyesuaikan struktur data di backend
    };

    try {
        // Kirim data ke backend
        const response = await fetch('http://localhost:5000/api/lokasi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Gagal menambahkan lokasi ke database!');
        }

        const result = await response.json();

        // Tambahkan data ke tabel di frontend
        const rowCount = tabelBody.rows.length + 1;
        const newRow = `
            <tr>
                <td>${rowCount}</td>
                <td>${result.lokasi}</td>
                <td>${result.tiket}</td>
                <td>
                    <button class="btn edit">Edit</button>
                    <button class="btn delete">Hapus</button>
                </td>
            </tr>
        `;
        tabelBody.insertAdjacentHTML('beforeend', newRow);

        // Reset form dan tutup popup
        formTambahKonser.reset();
        popupTambahKonser.style.display = 'none';

        Swal.fire('Berhasil!', 'Data lokasi berhasil ditambahkan.', 'success');
    } catch (error) {
        Swal.fire('Gagal!', error.message, 'error');
    }
});

// Event untuk menghapus atau mengedit data (sama seperti sebelumnya)
tabelBody.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('delete')) {
        const row = target.closest('tr');
        const lokasi = row.cells[1].textContent;

        Swal.fire({
            title: `Hapus lokasi ${lokasi}?`,
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
                Swal.fire('Terhapus!', 'Data lokasi berhasil dihapus.', 'success');
            }
        });
    }

    if (target.classList.contains('edit')) {
        const row = target.closest('tr');
        const lokasi = row.cells[1].textContent;
        const kapasitas = row.cells[2].textContent;

        Swal.fire({
            title: 'Edit Data Lokasi',
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

                Swal.fire('Berhasil!', 'Data lokasi berhasil diperbarui.', 'success');
            }
        });
    }
});
