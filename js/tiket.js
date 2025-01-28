// Fungsi utama untuk mengatur event listener dan logika
// Menunggu DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
    const popupTambahTiket = document.getElementById("popupTambahTiket");
    const btnBatalTambahTiket = document.getElementById("btnBatalTambahTiket");
    const btnTambahTiket = document.getElementById("btnTambahTiket");
    const formTambahTiket = document.getElementById("formTambahTiket");

    // Fungsi untuk mendapatkan data tiket dari server
    async function fetchTiket() {
        try {
            const response = await fetch("https://tiket-backend-theta.vercel.app/api/tiket", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error(`Gagal mengambil data tiket: ${response.statusText}`);
            }

            const tiketData = await response.json();
            displayTiket(tiketData);
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat mengambil data tiket.");
        }
    }

    // Fungsi untuk menampilkan data tiket ke dalam tabel
    function displayTiket(tiketData) {
        const tiketTableBody = document.getElementById("tiketTableBody");
        tiketTableBody.innerHTML = ""; // Kosongkan tabel sebelum menambahkan data baru

        tiketData.forEach((tiket, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${tiket.nama_tiket}</td>
                <td>${tiket.harga}</td>
                <td>${tiket.nama_konser}</td>
                <td>${tiket.jumlah_tiket || "-"}</td>
                <td>
                    <button class="btn edit" data-id="${tiket.tiket_id}">Edit</button>
                    <button class="btn delete" data-id="${tiket.tiket_id}">Hapus</button>
                </td>
            `;
            tiketTableBody.appendChild(row);
        });
    }

    // Fungsi untuk menambahkan tiket baru ke server
    async function addTiket(data) {
        try {
            const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImF1ZHlhcmRoYW5hc3l3YUBnbWFpbC5jb20iLCJ1c2VyX2lkIjoiMTViY2JhYTItYzc3ZS00YTA2LThjZjktOGM1Y2E4MmNjN2VmIiwiZXhwIjoxNzM3NzMxNjk0fQ.PGFjEebApWJBFnvdkamTIcl6F8Z3Xmd2cC01xMbhHhs";

            const response = await fetch("https://tiket-backend-theta.vercel.app/api/tiket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Token tidak valid atau telah kedaluwarsa.");
                }
                const errorMessage = await response.text();
                throw new Error(`Gagal menambahkan tiket: ${errorMessage}`);
            }

            const result = await response.json();
            alert(`Tiket berhasil ditambahkan dengan ID: ${result.id}`);

            fetchTiket(); // Refresh tabel data
        } catch (error) {
            console.error("Error:", error);
            alert("Terjadi kesalahan saat menambahkan tiket. " + error.message);
        }
    }

    // Event listener untuk tombol "Tambah Tiket"
    if (btnTambahTiket) {
        btnTambahTiket.addEventListener("click", function () {
            popupTambahTiket.style.display = "block"; // Tampilkan popup
        });
    }

    // Event listener untuk tombol "Batal"
    if (btnBatalTambahTiket) {
        btnBatalTambahTiket.addEventListener("click", function () {
            popupTambahTiket.style.display = "none"; // Sembunyikan popup
        });
    }

    // Event listener untuk form "Tambah Tiket"
    if (formTambahTiket) {
        formTambahTiket.addEventListener("submit", function (event) {
            event.preventDefault(); // Mencegah reload halaman

            const namaTiket = document.getElementById("namaTiket").value;
            const hargaTiket = parseInt(document.getElementById("hargaTiket").value);
            const konser = document.getElementById("konser").value;
            const jumlahTiket = parseInt(document.getElementById("jumlahTiket").value);

            if (!namaTiket || isNaN(hargaTiket) || !konser || isNaN(jumlahTiket)) {
                alert("Semua field harus diisi dengan benar!");
                return;
            }

            const tiketData = {
                nama_tiket: namaTiket,
                harga: hargaTiket,
                nama_konser: konser,
                jumlah_tiket: jumlahTiket, // Tambahkan jumlah tiket
            };

            addTiket(tiketData);

            popupTambahTiket.style.display = "none"; // Sembunyikan popup setelah submit
            formTambahTiket.reset(); // Reset form setelah submit
        });
    }

    // Panggil fetchTiket saat halaman dimuat
    fetchTiket();
});
