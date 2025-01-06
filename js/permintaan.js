// Fungsi untuk memperbarui status berdasarkan pilihan dropdown
function updateStatus(id, status) {
    const statusCell = document.getElementById(`status-${id}`);
    const row = document.getElementById(`row-${id}`);

    // Update status di tabel
    statusCell.textContent = status;

    // Ubah warna baris sesuai status
    if (status === "Disetujui") {
        row.style.backgroundColor = "#d4edda"; // Hijau terang
    } else if (status === "Ditolak") {
        row.style.backgroundColor = "#f8d7da"; // Merah terang
    } else {
        row.style.backgroundColor = ""; // Default
    }

    // Tambahkan logika untuk menyimpan perubahan ke backend jika diperlukan
    alert(`Status permintaan ID ${id} telah diubah menjadi "${status}".`);
}