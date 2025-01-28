// Referensi elemen
const btnTambahPermintaan = document.getElementById('btnTambahPermintaan');
const popupTambahPermintaan = document.getElementById('popupTambahPermintaan');
const btnBatalTambah = document.getElementById('btnBatalTambah');
const formTambahPermintaan = document.getElementById('formTambahPermintaan');
const tabelBody = document.querySelector('.data-table tbody');

// Event untuk menampilkan popup tambah permintaan
btnTambahPermintaan.addEventListener('click', () => {
    popupTambahPermintaan.style.display = 'flex';
});

// Event untuk menutup popup tambah permintaan
btnBatalTambah.addEventListener('click', () => {
    popupTambahPermintaan.style.display = 'none';
});

// Event untuk form submit (menambah data permintaan ke tabel dan database)
formTambahPermintaan.addEventListener('submit', async (event) => {
    event.preventDefault();

    const lokasi = document.getElementById('lokasi').value;
    const kapasitas = document.getElementById('kapasitas').value;
    const pilihanTiket = document.getElementById('pilihanTiket').value;

    if (!lokasi || !kapasitas || !pilihanTiket) {
        Swal.fire('Gagal!', 'Semua kolom wajib diisi!', 'error');
        return;
    }

    const data = {
        lokasi: lokasi,
        kapasitas: parseInt(kapasitas),
        tiket: pilihanTiket.split('\n').map(tiket => {
            const [tipe, harga] = tiket.split(' - ');
            return { tipe, harga };
        }),
    };

    try {
        // Kirim data ke backend
        const response = await fetch('http://localhost:5000/api/permintaan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Gagal menambahkan permintaan ke database!');
        }

        const result = await response.json();

        // Tambahkan data ke tabel di frontend
        const rowCount = tabelBody.rows.length + 1;
        const newRow = `
            <tr>
                <td>${rowCount}</td>
                <td>${result.lokasi}</td>
                <td>${result.kapasitas}</td>
                <td>
                    <ul>
                        ${result.tiket.map(tiket => `<li>${tiket.tipe} - Rp ${tiket.harga}</li>`).join('')}
                    </ul>
                </td>
                <td id="status-${rowCount}">${result.status || 'Ditunda'}</td>
                <td>
                    <button class="btn edit" onclick="editPermintaan(${rowCount})">Edit</button>
                    <button class="btn delete" onclick="hapusPermintaan(${rowCount})">Hapus</button>
                </td>
            </tr>
        `;
        tabelBody.insertAdjacentHTML('beforeend', newRow);

        // Reset form dan tutup popup
        formTambahPermintaan.reset();
        popupTambahPermintaan.style.display = 'none';

        Swal.fire('Berhasil!', 'Permintaan berhasil ditambahkan.', 'success');
    } catch (error) {
        Swal.fire('Gagal!', error.message, 'error');
    }
});

// Event untuk menghapus atau mengedit data
tabelBody.addEventListener('click', (event) => {
    const target = event.target;

    // Menghapus permintaan
    if (target.classList.contains('delete')) {
        const row = target.closest('tr');
        const lokasi = row.cells[1].textContent;

        Swal.fire({
            title: `Hapus permintaan untuk lokasi ${lokasi}?`,
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
                Swal.fire('Terhapus!', 'Data permintaan berhasil dihapus.', 'success');
            }
        });
    }

    // Mengedit permintaan
    if (target.classList.contains('edit')) {
        const row = target.closest('tr');
        const lokasi = row.cells[1].textContent;
        const kapasitas = row.cells[2].textContent;
        const tiketList = row.cells[3].textContent.split('\n').map(tiket => tiket.trim()).filter(Boolean);

        Swal.fire({
            title: 'Edit Permintaan',
            html: `
                <label for="swalLokasi">Lokasi:</label>
                <input type="text" id="swalLokasi" class="swal2-input" value="${lokasi}">
                <label for="swalKapasitas">Kapasitas Orang:</label>
                <input type="number" id="swalKapasitas" class="swal2-input" value="${kapasitas}">
                <label for="swalPilihanTiket">Pilihan Tiket:</label>
                <textarea id="swalPilihanTiket" class="swal2-input">${tiketList.join('\n')}</textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const newLokasi = document.getElementById('swalLokasi').value;
                const newKapasitas = document.getElementById('swalKapasitas').value;
                const newPilihanTiket = document.getElementById('swalPilihanTiket').value;

                if (!newLokasi || !newKapasitas || !newPilihanTiket) {
                    Swal.showValidationMessage('Semua kolom wajib diisi!');
                }

                return { newLokasi, newKapasitas, newPilihanTiket };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { newLokasi, newKapasitas, newPilihanTiket } = result.value;
                const tiketArray = newPilihanTiket.split('\n').map(tiket => {
                    const [tipe, harga] = tiket.split(' - ');
                    return { tipe, harga };
                });

                row.cells[1].textContent = newLokasi;
                row.cells[2].textContent = newKapasitas;
                row.cells[3].innerHTML = `
                    <ul>
                        ${tiketArray.map(tiket => `<li>${tiket.tipe} - Rp ${tiket.harga}</li>`).join('')}
                    </ul>
                `;

                Swal.fire('Berhasil!', 'Permintaan berhasil diperbarui.', 'success');
            }
        });
    }
});
