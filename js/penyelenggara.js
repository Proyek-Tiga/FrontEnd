document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector(".data-table tbody");
    const apiUrl = "https://tiket-backend-theta.vercel.app/api/users?role_name=penyelenggara";

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
    async function fetchPenyelenggara() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error("Gagal mengambil data penyelenggara");
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
                throw new Error("Gagal mengambil detail penyelenggara");
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

    // Tutup popup
    document.querySelector(".close-btn").addEventListener("click", () => {
        document.getElementById("popup").style.display = "none";
    });

    // Panggil fungsi fetchPenyelenggara saat halaman dimuat
    fetchPenyelenggara();
});
