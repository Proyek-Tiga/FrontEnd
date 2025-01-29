async function fetchTransaksi() {
  try {
    const response = await fetch("https://tiket-backend-theta.vercel.app/api/transaksi", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const transaksiList = await response.json();
    renderTransaksiTable(transaksiList);
  } catch (error) {
    console.error("Error mengambil data transaksi:", error);
    alert("Gagal mengambil data transaksi. Silakan coba lagi.");
  }
}

function renderTransaksiTable(data) {
  const tbody = document.querySelector(".data-table tbody");
  tbody.innerHTML = ""; // Hapus konten tabel sebelumnya

  data.forEach((item, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.transaksi.user_id}</td>
        <td>${item.transaksi.tiket_id}</td>
        <td>${item.payment.created_at && item.payment.created_at !== "0001-01-01T00:00:00Z" ? new Date(item.payment.created_at).toLocaleDateString() : "Belum Membayar"}</td>
        <td>${item.transaksi.qty}</td>
        <td>Rp${(item.transaksi.harga * item.transaksi.qty).toLocaleString()}</td>
        <td><img src="${item.transaksi.qrcode}" alt="QR Code" width="50"></td>
       <td>
          <button class="btn detail" onclick="showTransactionDetail(${index})" aria-label="Detail">
          <i class="fas fa-info-circle"></i> Detail
          </button>
      </td>


      `;

    tbody.appendChild(row);
  });

  // Simpan data transaksi ke dalam variabel global untuk digunakan dalam modal
  window.transactionData = data;
}

function showTransactionDetail(index) {
  const transaction = window.transactionData[index];

  const modal = document.getElementById("transaction-modal");
  const detailContent = document.getElementById("transaction-detail");

  detailContent.innerHTML = `
      <strong>No. Tiket:</strong> ${transaction.transaksi.transaksi_id}<br>
      <strong>Tanggal:</strong> ${new Date(transaction.payment.created_at).toLocaleString()}<br>
      <strong>Nama Konser:</strong> ${transaction.transaksi.nama_konser || "N/A"}<br>
      <strong>Nama User:</strong> ${transaction.payment.user_id}<br>
      <strong>Jumlah Tiket:</strong> ${transaction.transaksi.qty}<br>
      <strong>Total Harga:</strong> Rp${(transaction.transaksi.harga * transaction.transaksi.qty).toLocaleString()}<br>
      <strong>Status:</strong> ${transaction.payment.status}<br>
      <img src="${transaction.transaksi.qrcode}" alt="QR Code" width="100">
    `;

  modal.style.display = "block";
}

// Panggil fungsi fetch saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  fetchTransaksi();
  const modal = document.getElementById("transaction-modal");
  const closeBtn = document.querySelector(".close-btn");

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  };
});
