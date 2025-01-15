document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login ulang.');
        return; // Hentikan eksekusi jika token tidak ditemukan
    }
    const tableBody = document.querySelector(".data-table tbody");
    const apiUrl = "https://tiket-backend-theta.vercel.app/api/users?role_name=penyelenggara";
    const postUrl = "https://tiket-backend-theta.vercel.app/api/users";

    // Fungsi untuk membuat baris tabel
    function createTableRow(index, name, email, id) {
        return `
            <tr>
                <td>${index}</td>
                <td>${name}</td>
                <td>${email}</td>
                <td>
                    <button class="btn edit" data-id="${id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn delete" data-id="${id}">
                        <i class="fas fa-trash"></i> Hapus
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
            console.log(data); // Debug: tampilkan seluruh data yang diterima

            // Kosongkan tabel sebelum mengisi
            tableBody.innerHTML = "";

            // Iterasi data dan tambahkan ke tabel
            data.forEach((item, index) => {
                if (!item.name || !item.email || !item.user_id) {
                    console.warn(`Data tidak lengkap untuk item:`, item);
                    return; // Lewati item jika datanya tidak lengkap
                }
                const tableRow = createTableRow(index + 1, item.name, item.email, item.user_id);
                tableBody.innerHTML += tableRow;
            });

            addEditButtonListeners(); // Tambahkan listener untuk tombol detail
            addDeleteButtonListeners();
        } catch (error) {
            console.error("Terjadi kesalahan:", error);
        }
    }

    // Fungsi untuk menutup semua popup
    function closePopup(selector) {
        const popup = document.querySelector(selector);
        if (popup) {
            popup.style.display = "none";
        }
    }

    // Listener untuk tombol close pada popup detail
    document.querySelector(".close-btn").addEventListener("click", () => {
        closePopup("#popup");
    });

    // Fungsi untuk membuka popup tambah penyelenggara
    function showAddPopup() {
        document.getElementById("add-popup").style.display = "block";
    }

    // Listener untuk tombol close pada popup tambah penyelenggara
    document.querySelector(".add-close-btn").addEventListener("click", () => {
        closePopup("#add-popup");
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

    // Fungsi untuk menangani klik tombol Edit
    function addEditButtonListeners() {
        const editButtons = document.querySelectorAll(".btn.edit");
        editButtons.forEach(button => {
            button.addEventListener("click", async () => {
                const userId = button.getAttribute("data-id");

                try {
                    // Fetch data pengguna berdasarkan ID menggunakan getUserById
                    const response = await fetch(`https://tiket-backend-theta.vercel.app/api/users/${userId}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                    if (!response.ok) {
                        throw new Error("Gagal mengambil data pengguna");
                    }

                    const userData = await response.json();
                    console.log("Data pengguna:", userData);

                    if (!userData || !userData.name) {
                        throw new Error("Data pengguna tidak valid atau tidak ditemukan");
                    }

                    // Isi form edit dengan data pengguna
                    document.getElementById("edit-name").value = userData.name;
                    document.getElementById("edit-email").value = userData.email;

                    // Simpan ID pengguna ke elemen form untuk referensi
                    document.getElementById("edit-form").setAttribute("data-id", userId);

                    // Tampilkan popup edit
                    document.getElementById("edit-popup").style.display = "block";
                } catch (error) {
                    console.error("Terjadi kesalahan:", error);
                }
            });
        });
    }

    // Fungsi untuk menyimpan data edit
    async function saveEditData(event) {
        event.preventDefault();

        const userId = document.getElementById("edit-form").getAttribute("data-id");
        const name = document.getElementById("edit-name").value;
        const email = document.getElementById("edit-email").value;

        // Tambahkan role_id jika diperlukan
        const role_id = "9c8ec6c5-39e4-45c2-abe2-65024d7bcae8";

        try {
            console.log("Sending PUT request to:", `https://tiket-backend-theta.vercel.app/api/users/${userId}`);
            console.log("Request body:", { name, email, role_id });

            const response = await fetch(`https://tiket-backend-theta.vercel.app/api/users/${userId}`, {
                method: "PUT", // Gunakan metode sesuai API (PUT atau PATCH)
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, role_id })
            });

            if (!response.ok) {
                const errorText = await response.text(); // Tampilkan error detail
                console.error("Error response:", errorText);
                throw new Error("Gagal memperbarui data pengguna");
            }

            console.log("Berhasil memperbarui pengguna.");

            // Tutup popup edit
            document.getElementById("edit-popup").style.display = "none";

            // Refresh data tabel
            fetchPenyelenggara();
        } catch (error) {
            console.error("Terjadi kesalahan saat menyimpan data edit:", error);
            alert("Terjadi kesalahan: " + error.message);
        }
    }

    // Listener untuk tombol Simpan di form edit
    document.getElementById("edit-form").addEventListener("submit", saveEditData);

    // Listener untuk tombol close pada popup edit
    document.querySelector(".close-btn").addEventListener("click", () => {
        closePopup("#edit-popup");
    });

    function addDeleteButtonListeners() {
        const deleteButtons = document.querySelectorAll(".btn.delete");
        deleteButtons.forEach(button => {
            button.addEventListener("click", async () => {
                const userId = button.getAttribute("data-id");
                const confirmation = confirm("Apakah Anda yakin ingin menghapus pengguna ini?");
                if (!confirmation) return;

                try {
                    const response = await fetch(`https://tiket-backend-theta.vercel.app/api/users/${userId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        const errorText = await response.text(); // Debug detail error
                        console.error("Error response:", errorText);
                        throw new Error("Gagal menghapus pengguna.");
                    }

                    console.log("Pengguna berhasil dihapus.");
                    alert("Pengguna berhasil dihapus!");

                    // Refresh tabel
                    fetchPenyelenggara();
                } catch (error) {
                    console.error("Terjadi kesalahan saat menghapus pengguna:", error);
                    alert("Terjadi kesalahan: " + error.message);
                }
            });
        });
    }

    // Panggil fungsi fetchPenyelenggara saat halaman dimuat
    fetchPenyelenggara();
});
