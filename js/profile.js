document.addEventListener("DOMContentLoaded", function () {
    // Mengambil token dari localStorage
    const token = localStorage.getItem("authToken");

    console.log("Token yang ditemukan:", token);  // Menampilkan token di console

    if (!token) {
        // Jika token tidak ditemukan, alihkan pengguna ke halaman login
        console.log("Token tidak ditemukan, mengalihkan ke halaman login...");
        window.location.href = "index.html";
    } else {
        console.log("Token ditemukan, mencoba mengambil data profil...");

        // Ambil data profil pengguna menggunakan token
        fetch("https://tiket-backend-theta.vercel.app/api/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}` // Sertakan token dalam header untuk autentikasi
            }
        })
        .then(response => {
            console.log("Respons dari server:", response);  // Menampilkan respons server di console
            return response.json();
        })
        .then(data => {
            console.log("Data profil pengguna:", data);  // Menampilkan data profil pengguna

            // Jika berhasil, tampilkan nama pengguna
            if (data && data.name) {
                document.getElementById("username-display").textContent = data.name;
                console.log("Nama pengguna ditampilkan:", data.name);  // Menampilkan nama yang di-set
            } else {
                console.error("Nama pengguna tidak ditemukan di data respons.");
            }
        })
        .catch(error => {
            console.error("Error saat mengambil data pengguna:", error);  // Menampilkan error jika ada
        });
    }

    // Event listener untuk logout
    const logoutButton = document.getElementById("logout");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            console.log("Proses logout dimulai...");

            // Hapus token dari localStorage
            localStorage.removeItem("authToken");

            // Tampilkan notifikasi logout menggunakan SweetAlert
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Anda telah logout.',
            }).then(() => {
                // Redirect ke halaman login
                console.log("Pengguna diarahkan ke halaman login.");
                window.location.href = "index.html";
            });
        });
    }
});
