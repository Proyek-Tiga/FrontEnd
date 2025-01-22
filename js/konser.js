document.addEventListener('DOMContentLoaded', async () => {
    const API_URL = 'https://tiket-backend-theta.vercel.app/api/konser';
    const API_LOKASI = 'https://tiket-backend-theta.vercel.app/api/lokasi';
    const token = localStorage.getItem("authToken");
    if (!token) {
        alert('Token tidak ditemukan. Harap login ulang.');
        return;
    }

    // Dekode token untuk mendapatkan user_id
    function decodeToken(token) {
        try {
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            return decodedPayload.user_id;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    const userId = decodeToken(token);
    if (!userId) {
        alert('Gagal mendapatkan user_id dari token. Harap login ulang.');
        return;
    }

    console.log('Decoded user_id:', userId);

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
            console.log('API Response:', concerts);

            const container = document.querySelector('.card-container');

            container.querySelectorAll('.concert-card').forEach(card => card.remove());

            concerts.forEach(concert => {
                console.log('Concert ID:', concert.id, 'Concert Name:', concert.nama_konser);
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
                        <select class="status-dropdown" data-id="${concert.id}">
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

            container.querySelectorAll('.status-dropdown').forEach(dropdown => {
                dropdown.addEventListener('change', (e) => {
                    const concertId = e.target.getAttribute('data-id'); // Gunakan getAttribute
                    const newStatus = e.target.value; // Ambil nilai status baru
                    if (!concertId) {
                        console.error('Concert ID tidak ditemukan pada dropdown.');
                        return;
                    }
                    console.log('Concert ID:', concertId, 'New Status:', newStatus);
                    updateConcertStatus(concertId, newStatus); // Panggil fungsi update
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
            // Reset dropdown sebelum menambahkan opsi
            lokasiDropdown.innerHTML = '<option value="">Pilih Lokasi</option>';

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
        const concertName = document.getElementById('concert-name').value;
        const rawDate = document.getElementById('concert-date').value;
        const locationId = document.getElementById('concert-location').value;
        const ticketPrice = document.getElementById('ticket-price').value;
        const imageInput = document.getElementById('concert-image');

        // Validasi input
        if (!concertName) {
            alert('Harap masukkan nama konser.');
            return;
        }
        if (!rawDate) {
            alert('Harap masukkan tanggal konser.');
            return;
        }
        if (!locationId || locationId === "") {
            alert('Harap pilih lokasi konser.');
            return;
        }
        if (!ticketPrice || isNaN(ticketPrice)) {
            alert('Harap masukkan harga tiket yang valid.');
            return;
        }
        if (imageInput.files.length === 0) {
            alert('Harap unggah gambar konser.');
            return;
        }

        // Tambahkan data ke FormData
        formData.append('nama_konser', concertName);
        formData.append('tanggal_konser', new Date(rawDate).toISOString());
        formData.append('lokasi_id', locationId);
        formData.append('harga', ticketPrice);
        formData.append('image', imageInput.files[0]);
        formData.append('user_id', userId); // Tambahkan user_id ke FormData

        console.log('FormData:', [...formData.entries()]);

        try {
            const response = await fetch('http://localhost:5000/api/konser', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Token harus valid
                },
                body: formData,
            });

            const responseText = await response.text(); // Ambil respon mentah
            console.log('Response text:', responseText);

            if (response.ok) {
                const data = JSON.parse(responseText); // Parse respons jika JSON valid
                console.log('Konser berhasil ditambahkan:', data);
                alert('Konser berhasil ditambahkan!');
                document.getElementById('add-concert-form').reset();
                document.getElementById('add-concert-modal').style.display = 'none';
                fetchConcerts(); // Refresh daftar konser
            } else {
                console.error('Error response:', responseText);
                alert(`Gagal menambahkan konser: ${responseText}`);
            }
        } catch (error) {
            console.error('Error adding concert:', error);
            alert('Gagal menambahkan konser. Silakan coba lagi.');
        }
    }

    // Event listeners
    document.getElementById('add-concert-form').addEventListener('submit', addConcert);

    async function updateConcertStatus(concertId, newStatus) {
        if (!concertId || !newStatus) {
            console.error('Concert ID or new status is invalid:', { concertId, newStatus });
            return;
        }

        console.log('Updating concert status:', { concertId, newStatus });

        try {
            const response = await fetch(`https://tiket-backend-theta.vercel.app/api/konser/${concertId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error Response:', errorText);
                alert(`Gagal mengubah status konser: ${errorText}`);
                return;
            }

            const responseData = await response.json();
            console.log('Status konser berhasil diubah:', responseData);
            alert('Status konser berhasil diubah!');
            fetchConcerts(); // Refresh daftar konser
        } catch (error) {
            console.error('Error updating concert status:', error);
            alert('Gagal mengubah status konser. Silakan coba lagi.');
        }
    }

    // Event delegation untuk dropdown status
    document.querySelector('.card-container').addEventListener('change', (event) => {
        if (event.target.classList.contains('status-dropdown')) {
            const concertId = event.target.dataset.id; // Ambil ID dari data-id
            const newStatus = event.target.value; // Ambil nilai status baru

            if (concertId) {
                updateConcertStatus(concertId, newStatus);
            } else {
                console.error('Concert ID tidak ditemukan untuk dropdown status.');
                alert('Gagal menemukan ID konser. Silakan coba lagi.');
            }
        }
    });

    await fetchConcerts();
    await fetchLokasi(); // Panggil fetchLokasi di sini
});