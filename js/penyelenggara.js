document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login ulang.');
        return; // Hentikan eksekusi jika token tidak ditemukan
    }
    const tableBody = document.querySelector(".data-table tbody");
    const apiUrl = "https://tiket-backend-theta.vercel.app/api/users?role_name=penyelenggara";
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

    // Tutup popup detail
    document.querySelector(".close-btn").addEventListener("click", () => {
        document.getElementById("popup").style.display = "none";
    });

    // Fungsi untuk membuka popup tambah penyelenggara
    function showAddPopup() {
        document.getElementById("add-popup").style.display = "block";
    }

    // Fungsi untuk menutup popup tambah penyelenggara
    document.querySelector(".add-close-btn").addEventListener("click", () => {
        document.getElementById("add-popup").style.display = "none";
    });

    // Fungsi untuk mengirim data penyelenggara baru ke API
    async function addPenyelenggara(event) {
        event.preventDefault();
    
        const name = document.getElementById("add-name").value;
        const email = document.getElementById("add-email").value;
        const password = document.getElementById("add-password").value;
    
        // ID peran untuk penyelenggara (sesuai dari API/Postman)
        const role_id = "9c8ec6c5-39e4-45c2-abe2-65024d7bcae8";
    
        try {
            const response = await fetch(postUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ role_id, name, email, password }) // Sertakan role_id
            });
    
            if (!response.ok) {
                throw new Error("Gagal menambahkan penyelenggara baru");
            }
    
            // Bersihkan form
            document.getElementById("add-form").reset();
    
            // Tutup popup
            document.getElementById("add-popup").style.display = "none";
    
            // Refresh tabel penyelenggara
            fetchPenyelenggara();
        } catch (error) {
            console.error("Terjadi kesalahan saat menambahkan penyelenggara:", error);
        }
    }    

    // Tambahkan event listener pada tombol tambah
    document.getElementById("add-button").addEventListener("click", showAddPopup);
    document.getElementById("add-form").addEventListener("submit", addPenyelenggara);

    // Panggil fungsi fetchPenyelenggara saat halaman dimuat
    fetchPenyelenggara();
});
