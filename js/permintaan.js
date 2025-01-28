document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://tiket-backend-theta.vercel.app/api/request";
    const tableBody = document.getElementById("requestLokasiTableBody");

    if (!tableBody) {
        console.error("Elemen dengan ID 'requestLokasiTableBody' tidak ditemukan!");
        return;
    }

    // Fungsi untuk mengambil data dari API
    async function fetchRequestLokasi() {
        try {
            const response = await fetch(API_URL, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Gagal mengambil data: ${response.statusText}`);
            }

            const requestLokasiData = await response.json();
            displayRequestLokasi(requestLokasiData);
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat mengambil data.");
        }
    }

    // Fungsi untuk menampilkan data ke dalam tabel
    function displayRequestLokasi(data) {
        tableBody.innerHTML = ""; // Kosongkan isi tabel sebelum menambahkan data

        if (data.length === 0) {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="6" style="text-align: center;">Tidak ada data tersedia.</td>`;
            tableBody.appendChild(row);
            return;
        }

        data.forEach((request, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${request.nama_lokasi || "-"}</td>
                <td>${request.kapasitas || "-"}</td>
                <td>${request.pilihan_tiket || "-"}</td>
                <td>${request.status || "Pending"}</td>
                <td>
                    <button class="btn edit" aria-label="Edit"><i class="fa fa-edit"></i></button>
                    <button class="btn delete" aria-label="Delete"><i class="fa fa-trash"></i></button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    }

    // Jalankan fungsi untuk mengambil data
    fetchRequestLokasi();
});
