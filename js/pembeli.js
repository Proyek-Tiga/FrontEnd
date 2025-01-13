let userDetails = []; // Variabel untuk menyimpan data pengguna dari API

// Fetch data semua pengguna dengan role "pembeli" saat halaman dimuat
async function fetchUsers() {
    try {
        const response = await fetch("https://tiket-backend-theta.vercel.app/api/users?role_name=pembeli", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Menggunakan Bearer Token
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        userDetails = await response.json(); // Simpan data ke variabel userDetails
    } catch (error) {
        console.error("Error fetching users:", error);
        alert("Gagal mengambil data pengguna. Silakan coba lagi.");
    }
}

// Event Listener untuk tombol detail
document.querySelectorAll(".btn.detail").forEach((button) => {
    button.addEventListener("click", (event) => {
        const id = parseInt(event.target.closest("button").dataset.id, 10); // Ambil ID dari data-id tombol
        const user = userDetails.find((u) => u.id === id); // Cari pengguna berdasarkan ID

        if (user) {
            // Menampilkan data pada placeholder di popup
            document.getElementById("popup-nama").textContent = user.nama || "Nama tidak tersedia";
            document.getElementById("popup-email").textContent = user.email || "Email tidak tersedia";
            document.getElementById("popup").style.display = "flex"; // Tampilkan popup
        } else {
            alert("Pengguna tidak ditemukan.");
        }
    });
});

// Event Listener untuk tombol close
document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none"; // Sembunyikan popup
});

// Panggil fetchUsers saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchUsers);
