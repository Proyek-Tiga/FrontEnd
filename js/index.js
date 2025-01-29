const token = localStorage.getItem("authToken");
if (!token) {
    alert('Token tidak ditemukan. Harap login terlebih dahulu');
    window.location.href = "proyek-tiga.github.io/login";
}

// Fungsi umum untuk mengambil data dari API
async function fetchData(endpoint, index) {
    try {
        const response = await fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Gagal mengambil data dari ${endpoint}. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Data dari ${endpoint}:`, data);

        const elements = document.querySelectorAll(".cards-container .card .card-info p strong");

        if (endpoint.includes("transaksi")) {
            // Hitung total transaksi (jumlah transaksi yang terjadi)
            elements[index].textContent = data.length;
        } else if (Array.isArray(data) && elements.length > index) {
            elements[index].textContent = data.length;
        }
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
    }
}

// Panggil fungsi fetchData untuk setiap endpoint
const endpoints = [
    { url: "https://tiket-backend-theta.vercel.app/api/request", index: 0 }, // Permintaan
    { url: "https://tiket-backend-theta.vercel.app/api/lokasi", index: 1 }, // Lokasi
    { url: "https://tiket-backend-theta.vercel.app/api/konser", index: 2 }, // Konser
    { url: "https://tiket-backend-theta.vercel.app/api/users?role_name=pembeli", index: 3 }, // Pembeli
    { url: "https://tiket-backend-theta.vercel.app/api/transaksi", index: 4 }, // Transaksi
    { url: "https://tiket-backend-theta.vercel.app/api/tiket", index: 5 } // Tiket
];

document.addEventListener("DOMContentLoaded", () => {
    endpoints.forEach(endpoint => fetchData(endpoint.url, endpoint.index));
});

function logout() {
    localStorage.removeItem("authToken");
    alert("Anda telah logout.");
    window.location.href = "index.html"; // Kembali ke halaman login
}

