document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login ulang.');
        return; // Hentikan eksekusi jika token tidak ditemukan
    }
    const url = 'https://tiket-backend-theta.vercel.app/api/lokasi';
    const tabelBody = document.querySelector('.data-table tbody');
    const btnTambahKonser = document.getElementById('btnTambahKonser');
    const popupTambahKonser = document.getElementById('popupTambahKonser');
    const btnBatalTambah = document.getElementById('btnBatalTambah');
    const formTambahKonser = document.getElementById('formTambahKonser');
    const popupHapusKonser = document.getElementById('popupHapusKonser');
    const btnKonfirmasiHapus = document.getElementById('btnKonfirmasiHapus');
    const btnBatalHapus = document.getElementById('btnBatalHapus');

    let lokasiIdTerpilih = null;

    // Function untuk render tabel
    const renderTable = (data) => {
        tabelBody.innerHTML = ''; // Kosongkan tabel sebelum render ulang
        data.forEach((item, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.lokasi || 'Lokasi Tidak Diketahui'}</td>
                    <td>${item.tiket || 0}</td>
                    <td>
                        <button class="btn edit" data-id="${item.lokasi_id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn delete" data-id="${item.lokasi_id}">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </td>
                </tr>
            `;
            tabelBody.insertAdjacentHTML('beforeend', row);
        });
    };

    // Fetch data dari server dan render tabel
    const fetchData = async () => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Gagal mengambil data dari server');
            }

            const data = await response.json();
            renderTable(data);
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat mengambil data!');
        }
    };

    // Event Listener: Tampilkan pop-up tambah lokasi
    btnTambahKonser.addEventListener('click', () => {
        popupTambahKonser.style.display = 'block';
    });

    // Event Listener: Sembunyikan pop-up saat klik "Batal"
    btnBatalTambah.addEventListener('click', () => {
        popupTambahKonser.style.display = 'none';
        formTambahKonser.reset(); // Reset form input
    });

    // Event Listener: Tambah lokasi baru
    formTambahKonser.addEventListener('submit', async (e) => {
        e.preventDefault();

        const lokasi = document.getElementById('lokasi').value;
        const kapasitas = document.getElementById('kapasitas').value;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Gunakan header Authorization
                },
                body: JSON.stringify({
                    lokasi: lokasi,
                    tiket: parseInt(kapasitas, 10),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal menambahkan data ke server');
            }

            alert('Lokasi berhasil ditambahkan!');
            popupTambahKonser.style.display = 'none'; // Sembunyikan pop-up
            formTambahKonser.reset(); // Reset form input
            await fetchData(); // Render ulang tabel
        } catch (error) {
            console.error('Error:', error);
            alert(`Terjadi kesalahan: ${error.message}`);
        }
    });

    // Event Listener: Tampilkan pop-up konfirmasi hapus
    tabelBody.addEventListener('click', (e) => {
        if (e.target.closest('.delete')) {
            lokasiIdTerpilih = e.target.closest('.delete').dataset.id;
            popupHapusKonser.style.display = 'block';
        }
    });

    // Event Listener: Batal hapus
    btnBatalHapus.addEventListener('click', () => {
        popupHapusKonser.style.display = 'none';
        lokasiIdTerpilih = null;
    });

    // Event Listener: Konfirmasi hapus
    btnKonfirmasiHapus.addEventListener('click', async () => {
        if (!lokasiIdTerpilih) return;

        try {
            const response = await fetch(`${url}/${lokasiIdTerpilih}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus data');
            }

            alert('Data berhasil dihapus!');
            popupHapusKonser.style.display = 'none';
            lokasiIdTerpilih = null;
            await fetchData(); // Render ulang tabel
        } catch (error) {
            console.error('Error:', error);
            alert(`Terjadi kesalahan: ${error.message}`);
        }
    });

    // Initial fetch data
    await fetchData();
});
