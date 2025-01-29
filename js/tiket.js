const token = localStorage.getItem("authToken");
const btnTambahTiket = document.getElementById("btnTambahTiket");
const popupTambahTiket = document.getElementById("popupTambahTiket");
const btnBatalTambahTiket = document.getElementById("btnBatalTambahTiket");

// Fetch data from API and populate dropdown
async function fetchKonser() {
  try {
    const response = await fetch("https://tiket-backend-theta.vercel.app/api/konser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const konserList = await response.json();
    const konserDropdown = document.getElementById("konser");
    konserDropdown.innerHTML = '<option value="">-- Pilih Konser --</option>';

    konserList.forEach((konser) => {
      const option = document.createElement("option");
      option.value = konser.konser_id;
      option.textContent = konser.nama_konser;
      konserDropdown.appendChild(option);
    });
  } catch (error) {
    console.error("Error mengambil konser:", error);
    alert("Gagal mengambil konser. Silakan coba lagi.");
  }
}

// Tambahkan event listener ke tombol
if (btnTambahTiket) {
  btnTambahTiket.addEventListener("click", () => {
    if (popupTambahTiket) {
      popupTambahTiket.style.display = "block";
      fetchKonser(); // Panggil fetchKonser saat popup ditampilkan
    } else {
      console.error("Popup tambah tiket tidak ditemukan di DOM.");
    }
  });
} else {
  console.error("Tombol tambah tiket tidak ditemukan di DOM.");
}

// Tambahkan event listener ke tombol batal
if (btnBatalTambahTiket) {
  btnBatalTambahTiket.addEventListener("click", () => {
    if (popupTambahTiket) {
      popupTambahTiket.style.display = "none";
    } else {
      console.error("Popup tambah tiket tidak ditemukan di DOM.");
    }
  });
}

document.querySelector(".btn-submit").addEventListener("click", async function (event) {
  event.preventDefault();

  const konserDropdown = document.getElementById("konser");
  const konserId = konserDropdown.value.trim(); // Ambil ID konser yang dipilih
  const namaTiket = document.getElementById("namaTiket").value;
  const harga = parseInt(document.getElementById("harga").value);
  const jumlahTiket = parseInt(document.getElementById("jumlahTiket").value);

  if (!konserId || !namaTiket || isNaN(harga)) {
    alert("Harap isi semua data dengan benar!");
    return;
  }

  console.log("konserId:", konserId); // Debugging untuk melihat konser_id sebelum dikirim

  const tiketData = JSON.stringify({
    konser_id: konserId,
    nama_tiket: namaTiket,
    harga: harga,
    jumlah_tiket: jumlahTiket,
  });

  try {
    const response = await fetch("https://tiket-backend-theta.vercel.app/api/tiket", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: tiketData,
    });

    const responseText = await response.text();

    if (!response.ok) {
      // Periksa apakah pesan error berisi "Jumlah tiket melebihi kapasitas konser"
      if (responseText.includes("Jumlah tiket melebihi kapasitas konser")) {
        alert("Gagal menambahkan tiket: Jumlah tiket melebihi kapasitas konser.");
      } else {
        throw new Error(`HTTP error! Status: ${response.status} - ${responseText}`);
      }
    } else {
      alert("Tiket berhasil ditambahkan!");
      popupTambahTiket.style.display = "none";
      loadTiketData();
    }
  } catch (error) {
    console.error("Error menambahkan tiket:", error);
    alert("Gagal menambahkan tiket. Silakan coba lagi.");
  }
});

async function loadTiketData() {
  const apiUrl = "https://tiket-backend-theta.vercel.app/api/tiket";
  const tableBody = document.getElementById("tiketTableBody");

  try {
    const response = await fetch(apiUrl);
    const tikets = await response.json();

    tableBody.innerHTML = ""; // Clear table body

    tikets.forEach((tiket, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${index + 1}</td>
                <td>${tiket.nama_tiket}</td>
                <td>${tiket.harga}</td>
                <td>${tiket.nama_konser}</td>
                <td>${tiket.jumlah_tiket}</td>
                <td>
                <button class="btn edit" onclick="openEditPopup('${tiket.tiket_id}', '${tiket.nama_tiket}', ${tiket.harga}, '${tiket.jumlah_tiket}', '${tiket.konser_id}')" aria-label="Edit">
                  <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn delete" onclick="openDeletePopup('${tiket.tiket_id}')" aria-label="Hapus">
                  <i class="fas fa-trash"></i> Hapus
                </button>
              </td>
        `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fetch konser untuk dropdown bagian edit
async function fetchKonserForEdit(selectedKonserId = "") {
  try {
    const response = await fetch("https://tiket-backend-theta.vercel.app/api/konser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const konserList = await response.json();
    const editKonserDropdown = document.getElementById("editKonser");

    // Kosongkan dropdown sebelum mengisi
    editKonserDropdown.innerHTML = "";

    // Tambahkan konser yang dipilih sebelumnya sebagai pilihan pertama
    const selectedKonser = konserList.find((konser) => konser.konser_id === selectedKonserId);
    if (selectedKonser) {
      const selectedOption = document.createElement("option");
      selectedOption.value = selectedKonser.konser_id;
      selectedOption.textContent = selectedKonser.nama_konser;
      selectedOption.selected = true;
      editKonserDropdown.appendChild(selectedOption);
    }

    // Tambahkan konser lainnya, kecuali konser yang sedang dipilih
    konserList.forEach((konser) => {
      if (konser.konser_id !== selectedKonserId) {
        const option = document.createElement("option");
        option.value = konser.konser_id;
        option.textContent = konser.nama_konser;
        editKonserDropdown.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Error mengambil konser untuk edit:", error);
    alert("Gagal mengambil konser untuk edit. Silakan coba lagi.");
  }
}

function openEditPopup(tiketId, namaTiket, harga, jumlahTiket, konserId) {
  const popupEditTiket = document.getElementById("popupEditTiket");
  const editTiketId = document.getElementById("editTiketId");
  const editNamaTiket = document.getElementById("editNamaTiket");
  const editHargaTiket = document.getElementById("editHargaTiket");
  const editJumlahTiket = document.getElementById("editJumlahTiket");

  // Isi data tiket ke dalam form
  editTiketId.value = tiketId;
  editNamaTiket.value = namaTiket;
  editHargaTiket.value = harga;
  editJumlahTiket.value = jumlahTiket;

  // Tampilkan popup
  popupEditTiket.style.display = "block";

  // Muat dropdown konser dan tandai konser yang dipilih
  fetchKonserForEdit(konserId);
}

// Close edit popup
document.getElementById("btnBatalEditTiket").addEventListener("click", () => {
  document.getElementById("popupEditTiket").style.display = "none";
});

// Open delete popup
function openDeletePopup(id) {
  document.getElementById("popupHapusTiket").style.display = "block";
  document.getElementById("btnKonfirmasiHapusTiket").setAttribute("data-id", id);
}

// Close delete popup
document.getElementById("btnBatalHapusTiket").addEventListener("click", () => {
  document.getElementById("popupHapusTiket").style.display = "none";
});

// Handle delete confirmation
document.getElementById("btnKonfirmasiHapusTiket").addEventListener("click", async () => {
  const id = document.getElementById("btnKonfirmasiHapusTiket").getAttribute("data-id");

  try {
    const response = await fetch(`https://tiket-backend-theta.vercel.app/api/tiket/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "DELETE",
    });

    if (response.ok) {
      alert("Tiket berhasil dihapus!");
      document.getElementById("popupHapusTiket").style.display = "none";
      loadTiketData(); // Reload table
    } else {
      alert("Gagal menghapus tiket.");
    }
  } catch (error) {
    console.error("Error deleting tiket:", error);
  }
});

// Handle edit form submission
document.getElementById("formEditTiket").addEventListener("submit", async (e) => {
  e.preventDefault();

  const tiketId = document.getElementById("editTiketId").value;
  const namaTiket = document.getElementById("editNamaTiket").value;
  const harga = parseInt(document.getElementById("editHargaTiket").value);
  const jumlahTiket = parseInt(document.getElementById("editJumlahTiket").value);
  const konserId = document.getElementById("editKonser").value;

  try {
    const data = JSON.stringify({
      konser_id: konserId,
      nama_tiket: namaTiket,
      harga: harga,
      jumlah_tiket: jumlahTiket,
    });
    const response = await fetch(`https://tiket-backend-theta.vercel.app/api/tiket/${tiketId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: data,
    });

    console.log(data);
    

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    alert("Tiket berhasil diperbarui!");
    location.reload(); // Refresh halaman setelah update berhasil
  } catch (error) {
    console.error("Error memperbarui tiket:", error);
    alert("Gagal memperbarui tiket. Silakan coba lagi.");
  }
});

// Load data on page load
loadTiketData();
