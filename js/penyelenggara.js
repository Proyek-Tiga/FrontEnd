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

            // Kosongkan tabel sebelum mengisi
            tableBody.innerHTML = "";

            // Iterasi data dan tambahkan ke tabel
            data.forEach((item, index) => {
                const tableRow = createTableRow(index + 1, item.name, item.email, item.user_id);
                tableBody.innerHTML += tableRow;
            });

            addEditButtonListeners(); // Tambahkan listener untuk tombol detail
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

    function showEditPopup(userId) {
        if (!userId) {
            console.error('User ID tidak valid!');
            return;
        }
    
        fetch(`http://localhost:5000/api/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Gagal mengambil data user');
                }
                return response.json();
            })
            .then(data => {
                // Isi data pada form
                document.getElementById('edit-name').value = data.name || '';
                document.getElementById('edit-email').value = data.email || '';
                // Simpan userId untuk digunakan saat update
                document.getElementById('edit-form').dataset.userId = userId;
                // Tampilkan popup
                document.getElementById('edit-popup').style.display = 'block';
            })
            .catch(error => {
                console.error('Terjadi kesalahan:', error);
            });
    }    

    // Tambahkan event listener untuk tombol edit
    function addEditButtonListeners() {
        const editButtons = document.querySelectorAll('.btn.edit');
        editButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                // Pastikan mengambil data-id dari tombol yang di-klik
                const userId = event.currentTarget.getAttribute('data-id');
                console.log("User ID:", userId); // Tambahkan log ini
                if (userId) {
                    showEditPopup(userId);
                } else {
                    console.error("User ID tidak ditemukan!");
                }
            });
        });
    }    

    // Fungsi untuk mengirim data yang telah diedit ke API
    async function updateUser(event) {
        event.preventDefault();

        const userId = event.target.dataset.userId; // Ambil userId yang sudah disimpan
        const name = document.getElementById('edit-name').value;
        const email = document.getElementById('edit-email').value;

        try {
            const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                },
                body: JSON.stringify({ name, email }) // Kirim data yang diedit
            });

            if (!response.ok) {
                throw new Error("Gagal memperbarui data user");
            }

            // Tutup popup
            closePopup('#edit-popup');

            // Refresh tabel penyelenggara
            fetchPenyelenggara();
        } catch (error) {
            console.error('Terjadi kesalahan saat memperbarui user:', error);
        }
    }

    // Tambahkan event listener pada form edit
    document.getElementById('edit-form').addEventListener('submit', updateUser);

    // Fungsi untuk menutup popup edit
    document.querySelector('.close-btn').addEventListener('click', () => {
        closePopup('#edit-popup');
    });


    // Panggil fungsi fetchPenyelenggara saat halaman dimuat
    fetchPenyelenggara();
});
