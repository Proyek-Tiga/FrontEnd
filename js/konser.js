const API_URL = 'https://tiket-backend-theta.vercel.app/api/konser';

// Function to fetch and display data
async function fetchConcerts() {
    try {
        const response = await fetch(API_URL);
        const concerts = await response.json();

        const container = document.querySelector('.card-container');
        container.innerHTML = ''; // Clear existing content

        concerts.forEach(concert => {
            const concertCard = document.createElement('div');
            concertCard.classList.add('concert-card');

            // Format the date for better readability
            const formattedDate = new Date(concert.tanggal_konser).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });

            concertCard.innerHTML = `
                <img src="${concert.image || 'https://via.placeholder.com/300x200'}" alt="Concert Image" class="concert-image">
                <div class="concert-header">
                    <h3>${concert.nama_konser}</h3>
                    <span class="status">${concert.status}</span>
                </div>
                <div class="concert-details">
                    <p><strong>Tanggal:</strong> ${formattedDate}</p>
                    <p><strong>Jumlah Tiket:</strong> ${concert.jumlah_tiket}</p>
                    <p><strong>Harga:</strong> Rp ${concert.harga.toLocaleString('id-ID')}</p>
                    <p><strong>Bank:</strong> ${concert.jenis_bank}</p>
                    <p><strong>Atas Nama:</strong> ${concert.atas_nama}</p>
                </div>
                <div class="concert-actions">
                    <button class="btn edit">Edit</button>
                    <button class="btn delete">Hapus</button>
                </div>
            `;
            container.appendChild(concertCard);
        });
    } catch (error) {
        console.error('Error fetching concert data:', error);
    }
}

// Load data when the page loads
document.addEventListener('DOMContentLoaded', fetchConcerts);
