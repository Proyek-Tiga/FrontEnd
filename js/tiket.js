document.addEventListener("DOMContentLoaded", function () {
    const btnTambahTiket = document.getElementById("btnTambahTiket");
    const popupTambahTiket = document.getElementById("popupTambahTiket");
    const formTambahTiket = document.getElementById("formTambahTiket");
    const btnBatalTambahTiket = document.getElementById("btnBatalTambahTiket");
    const tbody = document.querySelector(".data-table tbody");

    let tiketData = [];
    let editIndex = null;

    // Format angka menjadi pemisah ribuan (misalnya, 150000 -> 150.000)
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // Menghapus format angka menjadi bilangan asli (misalnya, 150.000 -> 150000)
    function parseNumber(str) {
        return parseInt(str.replace(/\./g, ""), 10);
    }

    // Tampilkan form tambah tiket
    btnTambahTiket.addEventListener("click", () => {
        popupTambahTiket.style.display = "block";
    });

    // Tutup form tambah tiket
    btnBatalTambahTiket.addEventListener("click", () => {
        popupTambahTiket.style.display = "none";
        formTambahTiket.reset();
    });

    // Tambahkan data tiket
    formTambahTiket.addEventListener("submit", (event) => {
        event.preventDefault();

        const namaTiket = document.getElementById("namaTiket").value;
        const hargaTiketRaw = document.getElementById("hargaTiket").value;
        const hargaTiket = parseNumber(hargaTiketRaw); // Hapus pemisah ribuan
        const konser = document.getElementById("konser").value;

        if (editIndex !== null) {
            tiketData[editIndex] = { namaTiket, hargaTiket, konser };
            editIndex = null;
        } else {
            tiketData.push({ namaTiket, hargaTiket, konser });
        }

        popupTambahTiket.style.display = "none";
        formTambahTiket.reset();
        renderTable();

        // Tampilkan notifikasi menggunakan SweetAlert
        Swal.fire({
            icon: "success",
            title: "Berhasil!",
            text: "Tiket berhasil ditambahkan.",
            timer: 2000,
            confirmButtonText: "Oke",
        });
    });

    // Render tabel
    function renderTable() {
        tbody.innerHTML = "";
        tiketData.forEach((tiket, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${tiket.namaTiket}</td>
                <td>Rp. ${formatNumber(tiket.hargaTiket)}</td>
                <td>${tiket.konser}</td>
                <td>
                    <button class="btn edit" onclick="editTiket(${index})">Edit</button>
                    <button class="btn delete" onclick="hapusTiket(${index})">Hapus</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Edit tiket
    window.editTiket = (index) => {
        const tiket = tiketData[index];
        document.getElementById("namaTiket").value = tiket.namaTiket;
        document.getElementById("hargaTiket").value = formatNumber(tiket.hargaTiket);
        document.getElementById("konser").value = tiket.konser;

        popupTambahTiket.style.display = "block";
        editIndex = index;
    };

    // Hapus tiket
    window.hapusTiket = (index) => {
        Swal.fire({
            title: "Konfirmasi Hapus",
            text: "Apakah Anda yakin ingin menghapus tiket ini?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, hapus",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                tiketData.splice(index, 1);
                renderTable();
                Swal.fire({
                    icon: "success",
                    title: "Berhasil!",
                    text: "Tiket berhasil dihapus.",
                    timer: 2000,
                    confirmButtonText: "Oke",
                });
            }
        });
    };
});
