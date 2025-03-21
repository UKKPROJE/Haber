// Kullanılacak RSS haber kaynakları
const RSS_FEEDS = [
    { name: "BBC Türkçe", url: "https://www.bbc.com/turkce/rss.xml" },
    { name: "Anadolu Ajansı", url: "https://www.aa.com.tr/tr/rss/default?cat=guncel" },
    { name: "NTV", url: "https://www.ntv.com.tr/gundem.rss" }
];

// Haberleri çek ve göster
async function haberleriGetir() {
    const haberlerDiv = document.getElementById("haberler");
    haberlerDiv.innerHTML = "<p>Haberler yükleniyor...</p>";

    for (const feed of RSS_FEEDS) {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`);
            const data = await response.json();
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");
            const items = xml.querySelectorAll("item");

            // Haber başlıklarını ve açıklamalarını listele
            items.forEach((item, index) => {
                if (index < 5) { // Her kaynaktan ilk 5 haberi al
                    const title = item.querySelector("title").textContent;
                    const link = item.querySelector("link").textContent;
                    const description = item.querySelector("description") ? item.querySelector("description").textContent : "Açıklama yok";

                    const article = document.createElement("article");
                    article.innerHTML = `
                        <h2>${title}</h2>
                        <p>${description}</p>
                        <button onclick="window.open('${link}', '_blank')">Haberi Oku</button>
                        <p><small>Kaynak: ${feed.name}</small></p>
                    `;
                    haberlerDiv.appendChild(article);
                }
            });
        } catch (error) {
            console.error(`Haberler yüklenirken hata oluştu: ${feed.name}`, error);
        }
    }
}

haberleriGetir();