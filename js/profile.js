document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("authToken"); // Mengambil token dari localStorage

    if (!token) {
        // Jika token tidak ditemukan, alihkan pengguna ke halaman login
        window.location.href = "index.html";
    } else {
        // Ambil data profil pengguna menggunakan token
        fetch("https://tiket-backend-theta.vercel.app/api/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` // Sertakan token dalam header untuk autentikasi
            }
        })
        .then(response => response.json())
        .then(data => {
            // Jika berhasil, tampilkan nama pengguna
            if (data && data.name) {
                document.getElementById("username-display").textContent = data.name;
            } else {
                console.error("Nama pengguna tidak ditemukan di data respons.");
            }
        })
        .catch(error => {
            console.error("Error saat mengambil data pengguna:", error);
        });
    }

    // Event listener untuk logout
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("authToken");  // Hapus token dari localStorage
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Anda telah logout.',
            }).then(() => {
                window.location.href = "index.html";  // Redirect ke halaman login
            });
        });
    }
});
