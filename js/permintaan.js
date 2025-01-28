const tableBody = document.querySelector(".data-table tbody");
// Fungsi untuk mendekode token JWT
function decodeJwt(token) {
  const base64Url = token.split(".")[1]; // Ambil bagian payload (second part of JWT)
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Decode URL-safe Base64
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload); // Kembalikan payload yang sudah didekode
}

// Contoh penggunaan
const token = localStorage.getItem("authToken");
const decoded = decodeJwt(token);

const userId = decoded.user_id; // Mengambil user_id dari payload token

console.log("User ID:", userId);

async function fetchRequest() {
  try {
    const response = await fetch("https://tiket-backend-theta.vercel.app/api/request", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const requestList = await response.json();

    tableBody.innerHTML = ""; // Clear existing table rows

    requestList.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.nama_lokasi}</td>
            <td>${item.kapasitas}</td>
            <td>${item.status}</td>
            <td>
                <button class="btn-edit" onclick="editRequest('${item.request_id}', '${item.status}')">Edit</button>
            </td>
        `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching requests:", error);
    alert("Gagal mengambil data request. Silakan coba lagi.");
  }
}

function editRequest(requestId, currentStatus) {
  // Set nilai requestId dan status saat ini pada popup
  document.getElementById("editRequestId").value = requestId;
  document.getElementById("editStatus").value = currentStatus;

  // Tampilkan popup
  document.getElementById("popupEditStatus").style.display = "block";
}

// Fungsi untuk menyimpan perubahan status
document.getElementById("formEditStatus").addEventListener("submit", function (e) {
  e.preventDefault();
  const requestId = document.getElementById("editRequestId").value;
  const status = document.getElementById("editStatus").value;

  const data = JSON.stringify({
    status: status,
  });

  console.log(data);

  fetch(`https://tiket-backend-theta.vercel.app/api/requests/${requestId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Status berhasil diubah");
      fetchRequest(); // Reload data request
      document.getElementById("popupEditStatus").style.display = "none"; // Hide popup
    })
    .catch((error) => {
      console.error("Error updating status:", error);
      alert("Gagal mengubah status");
    });
});

function editRequest(requestId, currentStatus) {
  // Set nilai requestId dan status saat ini pada popup
  document.getElementById("editRequestId").value = requestId;
  document.getElementById("editStatus").value = currentStatus;

  // Tampilkan popup
  document.getElementById("popupEditStatus").style.display = "block";
}

// Menutup popup jika batal edit status
document.getElementById("btnBatalEditStatus").onclick = function () {
  document.getElementById("popupEditStatus").style.display = "none";
};

// Tampilkan popup saat tombol tambah permintaan diklik
document.getElementById("btnTambahPermintaan").addEventListener("click", function () {
  document.getElementById("popupTambahPermintaan").style.display = "block";
});

// Menutup popup saat tombol batal diklik
document.getElementById("btnBatalTambah").addEventListener("click", function () {
  document.getElementById("popupTambahPermintaan").style.display = "none";
});

// Menangani pengiriman form untuk tambah permintaan
document.getElementById("formTambahPermintaan").addEventListener("submit", function (e) {
  e.preventDefault();

  const lokasi = document.getElementById("lokasi").value;
  const kapasitas = parseInt(document.getElementById("kapasitas").value);

  if (!userId) {
    alert("Token tidak valid atau user_id tidak ditemukan.");
    return;
  }

  const data = JSON.stringify({
    user_id: userId, // Gunakan user_id dari token
    nama_lokasi: lokasi,
    kapasitas: kapasitas,
  });

  console.log(data);

  // Kirim data ke server
  fetch("https://tiket-backend-theta.vercel.app/api/request", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      alert("Permintaan berhasil ditambahkan!");
      fetchRequest();
      document.getElementById("popupTambahPermintaan").style.display = "none"; // Tutup popup
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Gagal menambahkan permintaan.");
    });
});

// Fetch and populate data on page load
fetchRequest();
