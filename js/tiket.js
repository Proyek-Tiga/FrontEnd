// Fungsi untuk mengambil data tiket dari API dan menampilkannya di tabel
async function fetchTiket() {
    try {
        // Fetch data dari endpoint
        const response = await fetch("https://tiket-backend-theta.vercel.app/api/tiket");

        // Periksa apakah respons berhasil
        if (!response.ok) {
            throw new Error(`Gagal mengambil data tiket: ${response.statusText}`);
        }

        // Parse data hasil fetch
        const tiketData = await response.json();

        // Ambil elemen tbody dari tabel
        const tbody = document.querySelector(".data-table tbody");
        tbody.innerHTML = ""; // Kosongkan tabel sebelum diisi ulang

        // Loop melalui data tiket dan tambahkan ke tabel
        tiketData.forEach((tiket, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${tiket.nama_tiket}</td>
                <td>${tiket.harga}</td>
                <td>${tiket.nama_konser}</td>
                <td>${tiket.jumlah_tiket}</td>
                <td>
                    <button class="btn edit" data-id="${tiket.tiket_id}">Edit</button>
                    <button class="btn delete" data-id="${tiket.tiket_id}">Hapus</button>
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (error) {
        console.error("Error:", error);
        alert("Terjadi kesalahan saat mengambil data tiket.");
    }
}

// Panggil fetchTiket ketika DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
    fetchTiket();
});
