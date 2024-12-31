// Referensi elemen
const tabelBody = document.querySelector('.data-table tbody');

// Menambahkan data konser (misalnya data sudah tersedia sebelumnya)
const konserData = [
    { id: 1, tanggal: '2024-12-25', namaKonser: 'Konser A', lokasi: 'Lokasi A', jumlahTiket: 500, harga: 150000, penyelenggara: 'Penyelenggara A', status: 'Belum Di-Acc' },
    { id: 2, tanggal: '2024-12-26', namaKonser: 'Konser B', lokasi: 'Lokasi B', jumlahTiket: 600, harga: 200000, penyelenggara: 'Penyelenggara B', status: 'Belum Di-Acc' },
    // Tambahkan data konser lainnya sesuai kebutuhan
];

// Menampilkan data konser di tabel
function tampilkanDataKonser() {
    tabelBody.innerHTML = ''; // Menghapus tabel sebelumnya
    konserData.forEach((konser, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${konser.tanggal}</td>
                <td>${konser.namaKonser}</td>
                <td>${konser.lokasi}</td>
                <td>${konser.jumlahTiket}</td>
                <td>${konser.harga}</td>
                <td>${konser.penyelenggara}</td>
                <td>${konser.status}</td>
                <td>
                    <button class="btn edit">Edit</button>
                    <button class="btn delete">Hapus</button>
                </td>
            </tr>
        `;
        tabelBody.insertAdjacentHTML('beforeend', row);
    });
}

// Menampilkan data konser saat halaman dimuat
document.addEventListener('DOMContentLoaded', tampilkanDataKonser);

// Event untuk menghapus atau mengedit data
tabelBody.addEventListener('click', (event) => {
    const target = event.target;

    // Menghapus data konser
    if (target.classList.contains('delete')) {
        const row = target.closest('tr');
        const lokasi = row.cells[3].textContent;

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
                const index = Array.from(tabelBody.rows).indexOf(row);
                konserData.splice(index, 1); // Menghapus data dari array konserData
                tampilkanDataKonser(); // Menampilkan ulang data konser setelah dihapus
                Swal.fire('Terhapus!', 'Data konser berhasil dihapus.', 'success');
            }
        });
    }

    // Mengedit status konser
    if (target.classList.contains('edit')) {
        const row = target.closest('tr');
        const status = row.cells[7].textContent;

        Swal.fire({
            title: 'Edit Status Konser',
            html: `
                <label for="swalStatus">Status:</label>
                <select id="swalStatus" class="swal2-input">
                    <option value="Acc" ${status === 'Acc' ? 'selected' : ''}>Acc</option>
                    <option value="Tidak Acc" ${status === 'Tidak Acc' ? 'selected' : ''}>Tidak Acc</option>
                </select>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Simpan',
            cancelButtonText: 'Batal',
            preConfirm: () => {
                const newStatus = document.getElementById('swalStatus').value;

                return { newStatus };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const { newStatus } = result.value;
                const index = Array.from(tabelBody.rows).indexOf(row);
                konserData[index].status = newStatus; // Update status pada array data
                tampilkanDataKonser(); // Menampilkan ulang data konser setelah update status

                Swal.fire('Berhasil!', 'Status konser berhasil diperbarui.', 'success');
            }
        });
    }
});
