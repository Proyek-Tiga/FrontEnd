document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector(".data-table tbody");
    const apiUrl = "https://tiket-backend-theta.vercel.app/api/users?role_name=pembeli";
    const postUrl = "http://localhost:5000/api/users";

    // Fungsi untuk membuat baris tabel
    function createTableRow(index, name, email, id) {
        return `
            <tr>
                <td>${index}</td>
                <td>${name}</td>
                <td>${email}</td>
                <td>
                    <button class="btn detail" data-id="${id}">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    // Fungsi untuk mengambil data dari API
    async function fetchPembeli() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Gagal mengambil data pembeli");
            }
            const data = await response.json();

            // Kosongkan tabel sebelum mengisi
            tableBody.innerHTML = "";

            // Iterasi data dan tambahkan ke tabel
            data.forEach((item, index) => {
                const tableRow = createTableRow(index + 1, item.name, item.email, item.id);
                tableBody.innerHTML += tableRow;
            });

            addDetailButtonListeners(); // Tambahkan listener untuk tombol detail
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    }

    // Fungsi untuk menangani klik tombol detail
    function addDetailButtonListeners() {
        const detailButtons = document.querySelectorAll(".btn.detail");
        detailButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                const id = event.currentTarget.dataset.id;
                showDetailPopup(id);
            });
        });
    }

    // Fungsi untuk menampilkan popup detail
    async function showDetailPopup(id) {
        try {
            const response = await fetch(`${apiUrl}&id=${id}`);
            if (!response.ok) {
                throw new Error("Gagal mengambil detail pembeli");
            }
            const detail = await response.json();

            // Isi data di popup
            document.getElementById("popup-nama").textContent = detail.name || "Tidak ada data";
            document.getElementById("popup-email").textContent = detail.email || "Tidak ada data";
            document.getElementById("popup-role").textContent = detail.role_name || "Tidak ada data";

            // Tampilkan popup
            document.getElementById("popup").style.display = "block";
        } catch (error) {
            console.error("Terjadi kesalahan saat memuat detail:", error);
        }
    }

    // Tutup popup detail
    document.querySelector(".close-btn").addEventListener("click", () => {
        document.getElementById("popup").style.display = "none";
    });

    // Fungsi untuk membuka popup tambah pembeli
    function showAddPopup() {
        document.getElementById("add-popup").style.display = "block";
    }

    // Fungsi untuk menutup popup tambah pembeli
    document.querySelector(".add-close-btn").addEventListener("click", () => {
        document.getElementById("add-popup").style.display = "none";
    });

    // Fungsi untuk mengirim data pembeli baru ke API
    async function addPembeli(event) {
        event.preventDefault();

        const name = document.getElementById("add-name").value;
        const email = document.getElementById("add-email").value;
        const password = document.getElementById("add-password").value;

        try {
            const response = await fetch(postUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, email, password })
            });

            if (!response.ok) {
                throw new Error("Gagal menambahkan pembeli baru");
            }

            document.getElementById("add-popup").style.display = "none"; // Tutup popup
            fetchPembeli(); // Refresh tabel
        } catch (error) {
            console.error("Terjadi kesalahan saat menambahkan pembeli:", error);
        }
    }

    // Tambahkan event listener pada tombol tambah
    document.getElementById("add-button").addEventListener("click", showAddPopup);
    document.getElementById("add-form").addEventListener("submit", addPembeli);

    // Panggil fungsi fetchPembeli saat halaman dimuat
    fetchPembeli();
});
