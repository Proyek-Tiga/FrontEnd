document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://tiket-backend-theta.vercel.app/api/konser';
    const API_LOKASI = 'https://tiket-backend-theta.vercel.app/api/lokasi';
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login ulang.');
        return;
    }
    const addConcertBtn = document.getElementById("add-concert-btn");
    const addConcertModal = document.getElementById("add-concert-modal");
    const closeModal = document.querySelector("#add-concert-modal .close");

    async function fetchConcerts() {
        try {
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const concerts = await response.json();
            const container = document.querySelector('.card-container');

            container.querySelectorAll('.concert-card').forEach(card => card.remove());

            concerts.forEach(concert => {
                const concertCard = document.createElement('div');
                concertCard.classList.add('concert-card');

                const formattedDate = new Date(concert.tanggal_konser).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                });

                concertCard.innerHTML = `
                    <div class="concert-header">
                        <h3>${concert.nama_konser}</h3>
                        <select class="status-dropdown">
                            <option value="approved" ${concert.status === 'approved' ? 'selected' : ''}>Approved</option>
                            <option value="pending" ${concert.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="rejected" ${concert.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                    </div>
                    <div class="concert-image">
                        <img src="${concert.image}" alt="Gambar konser ${concert.nama_konser}" />
                    </div>
                    <div class="concert-details">
                        <p><strong>Lokasi:</strong> ${concert.lokasi_name}</p>
                        <p><strong>Tanggal:</strong> ${formattedDate}</p>
                        <p><strong>Jumlah Tiket:</strong> ${concert.jumlah_tiket}</p>
                        <p><strong>Harga:</strong> Rp ${concert.harga.toLocaleString('id-ID')}</p>
                        <p><strong>Nama Penyelenggara:</strong> ${concert.user_name}</p>
                    </div>
                    <div class="concert-actions">
                        <button class="btn edit" data-id="${concert.id}"><i class="fas fa-edit"></i>Edit</button>
                        <button class="btn delete"><i class="fas fa-trash"></i>Hapus</button>
                    </div>
                `;

                container.appendChild(concertCard);
            });

            container.querySelectorAll('.btn.edit').forEach(button => {
                button.addEventListener('click', (e) => {
                    const concertId = e.target.closest('button').dataset.id;
                    if (concertId) {
                        openEditModal(concertId);
                    } else {
                        console.error('Concert ID tidak ditemukan pada tombol.');
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching concert data:', error);
            alert('Gagal memuat data konser.');
        }
    }

    // Open modal
    addConcertBtn.addEventListener("click", () => {
        addConcertModal.classList.add("show"); // Menambahkan class 'show' untuk menampilkan modal
    });

    // Close modal
    closeModal.addEventListener("click", () => {
        addConcertModal.style.display = "none";
    });

    // Close modal on clicking outside
    window.addEventListener("click", (event) => {
        if (event.target === addConcertModal) {
            addConcertModal.style.display = "none";
        }
    });

    async function fetchLokasi() {
        try {
            const response = await fetch(API_LOKASI, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const lokasiData = await response.json();
            console.log('Data Lokasi:', lokasiData); // Tambahkan log di sini

            const lokasiDropdown = document.getElementById('concert-location');
            if (!lokasiDropdown) {
                console.error('Dropdown lokasi tidak ditemukan.');
                return;
            }
            lokasiData.forEach(lokasi => {
                const option = document.createElement('option');
                option.value = lokasi.lokasi_id;
                option.textContent = `${lokasi.lokasi} (Tiket: ${lokasi.tiket})`;
                lokasiDropdown.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching lokasi:', error);
        }
    }

    // Tambahkan konser
    async function addConcert(event) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('nama_konser', document.getElementById('concert-name').value);
        const rawDate = document.getElementById('concert-date').value;
        const formattedDate = new Date(rawDate).toISOString(); // Konversi tanggal ke ISO format
        formData.append('tanggal_konser', formattedDate);
        formData.append('lokasi_id', document.getElementById('concert-location').value);
        formData.append('harga', document.getElementById('ticket-price').value);

        const imageInput = document.getElementById('concert-image');
        if (imageInput.files.length > 0) {
            formData.append('image', imageInput.files[0]);
        } else {
            alert('Harap unggah gambar konser.');
            return;
        }

        console.log('FormData:', [...formData.entries()]); // Log semua data yang akan dikirim

        try {
            const response = await fetch('http://localhost:5000/api/konser', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Gunakan header Authorization
                },
                body: formData,
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Konser berhasil ditambahkan:', data);
                alert('Konser berhasil ditambahkan!');
                document.getElementById('add-concert-form').reset();
                document.getElementById('add-concert-modal').style.display = 'none';
                // Refresh concert list
                fetchConcerts();
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                alert(`Gagal menambahkan konser: ${errorData.message || 'Error tidak diketahui.'}`);
            }
        } catch (error) {
            console.error('Error adding concert:', error);
            alert('Gagal menambahkan konser. Silakan coba lagi.');
        }
    }

    // Event listeners
    document.getElementById('add-concert-form').addEventListener('submit', addConcert);

    async function openEditModal(concertId) {
        if (!concertId) {
            alert('Terjadi kesalahan, ID konser tidak ditemukan.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${concertId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const concert = await response.json();

            document.getElementById('concert-id').value = concert.id;
            document.getElementById('nama_konser').value = concert.nama_konser;
            document.getElementById('tanggal_konser').value = new Date(concert.tanggal_konser).toISOString().slice(0, 16);
            document.getElementById('harga').value = concert.harga;
            document.getElementById('image').value = concert.image || '';
            document.getElementById('jenis_bank').value = concert.jenis_bank;
            document.getElementById('atas_nama').value = concert.atas_nama;
            document.getElementById('rekening').value = concert.rekening;

            document.getElementById('edit-modal').style.display = 'block';
        } catch (error) {
            console.error('Error fetching concert details:', error);
            alert('Gagal memuat data konser.');
        }
    }

    document.getElementById('edit-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const concertId = document.getElementById('concert-id').value;
        const updatedData = {
            id: concertId,
            nama_konser: document.getElementById('nama_konser').value,
            tanggal_konser: new Date(document.getElementById('tanggal_konser').value).toISOString(),
            harga: parseInt(document.getElementById('harga').value, 10),
            image: document.getElementById('image').value,
            jenis_bank: document.getElementById('jenis_bank').value,
            atas_nama: document.getElementById('atas_nama').value,
            rekening: document.getElementById('rekening').value
        };

        try {
            const response = await fetch(`${API_URL}/${concertId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            alert('Konser berhasil diperbarui.');
            document.getElementById('edit-modal').style.display = 'none';
            await fetchConcerts();
        } catch (error) {
            console.error('Error updating concert:', error);
            alert('Terjadi kesalahan saat memperbarui konser.');
        }
    });

    await fetchConcerts();
    await fetchLokasi(); // Panggil fetchLokasi di sini

    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('edit-modal').style.display = 'none';
    });
});
