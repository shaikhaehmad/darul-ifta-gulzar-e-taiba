        file: "kabr_par_fateha_padhvano_sahi_tariko.pdf"
    }
];


// ======================
// SEARCH SYSTEM
// ======================

const search = document.getElementById("search");
const results = document.getElementById("search-results");

if (search && results) {
    search.addEventListener("input", function () {
        const value = this.value.toLowerCase().trim();
        results.innerHTML = "";

        if (!value) return;

        const filteredData = masterData.filter(item =>
            item.title.toLowerCase().includes(value) ||
            item.keywords.toLowerCase().includes(value)
        );

        if (filteredData.length === 0) {
            results.textContent = "Koi result nahi mila.";
            return;
        }

        filteredData.forEach(item => {
            const card = document.createElement("div");
            card.className = "result";

            const heading = document.createElement("h3");
            heading.textContent = item.title + " (" + item.type + ")";

            const link = document.createElement("a");
            link.href = item.file;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "📖 Kholen";

            card.appendChild(heading);
            card.appendChild(link);
            results.appendChild(card);
        });
    });
}


// ======================
// FATWA FORM - FIREBASE & WHATSAPP
// ======================

const fatwaForm = document.getElementById("fatwaForm");

if (fatwaForm) {
    fatwaForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const mobile = document.getElementById("mobile").value.trim();
        const address = document.getElementById("address").value.trim();
        const question = document.getElementById("question").value.trim();
        
        const fileInput = document.getElementById("fileInput"); 
        let fileName = "Koi file select nahi ki gayi";
        
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            fileName = fileInput.files[0].name;
        }

        if (!name || !mobile || !address || !question) {
            alert("Sabhi details (Naam, Mobile, Address aur Sawal) bharein.");
            return;
        }

        const submitButton = fatwaForm.querySelector('button[type="submit"]');

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            // 1. Firebase mein data save karein
            await addDoc(collection(db, "fatwas"), {
                name: name,
                mobile: mobile,
                address: address,
                question: question,
                file: fileName,
                date: serverTimestamp(),
                status: "pending"
            });

            // 2. WhatsApp Message Format
            const adminWhatsAppNumber = "918758647929"; 

            const whatsappMessage = 
`*دارالافتاء گلزار طیبہ*
*--- جدید سوال / مسئلہ ---*

👤 *Naam:* ${name}
📱 *Mobile:* ${mobile}
🏠 *Address:* ${address}

❓ *Sawal / Masla:*
${question}

📎 *Attachment:* ${fileName}
*(Note: Agar koi photo/document hai, toh kripya is message ke sath ya alag se WhatsApp par bhej dein.)*`;

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://api.whatsapp.com/send?phone=${adminWhatsAppNumber}&text=${encodedMessage}`;

            alert("Aapka sawal kamyabi se bhej diya gaya hai. Ab WhatsApp khul raha hai...");
            fatwaForm.reset();

            // 3. WhatsApp redirect
            window.open(whatsappURL, "_blank");
        }
        catch (error) {
            console.error("Firebase Error:", error);
            alert("Kuch problem aayi. Dobara koshish karein.");
        }
        finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "📨 Fatwa Puchhe";
            }
        }
    });
}


// ======================
// DARK MODE
// ======================

const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {
    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark");
        if (document.body.classList.contains("dark")) {
            themeToggle.textContent = "☀️ Light Mode";
        } else {
            themeToggle.textContent = "🌙 Dark Mode";
        }
    });
}


// ======================
// PDF LIBRARY & CATEGORY FILTER
// ======================

const pdfList = document.getElementById("pdfList");
const searchInput = document.getElementById("searchInput");

function loadPDFs(filterCategory = "") {
    if (!pdfList) return;

    pdfList.innerHTML = "";

    const filteredPDFs = masterData.filter(item => {
        if (!filterCategory || filterCategory === "All") return true;
        return item.category.toLowerCase() === filterCategory.toLowerCase();
    });

    if (filteredPDFs.length === 0) {
        pdfList.textContent = "Is category mein koi PDF nahi mili.";
        return;
    }

    filteredPDFs.forEach(pdf => {
        const card = document.createElement("div");
        card.className = "quick-card";

        const icon = document.createElement("div");
        icon.className = "icon";
        icon.textContent = "📄";

        const heading = document.createElement("h3");
        heading.textContent = pdf.title;

        const category = document.createElement("p");
        category.textContent = "Category: " + pdf.category;

        const link = document.createElement("a");
        link.href = pdf.file;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "btn";
        link.textContent = "📥 Download / Read";

        card.appendChild(icon);
        card.appendChild(heading);
        card.appendChild(category);
        card.appendChild(link);

        pdfList.appendChild(card);
    });
}

// PDF Section ke Category Buttons ke liye click events
const pdfCategoryButtons = document.querySelectorAll("#pdf .hero-buttons .btn");
pdfCategoryButtons.forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault();
        const categoryName = this.textContent.trim().replace("📄 ", "").replace("📚 ", "").replace("🕌 ", "").replace("📖 ", "");
        loadPDFs(categoryName === "Fatwa" ? "Nikah" : categoryName); // Category mapping
    });
});

loadPDFs();


// ======================
// SCRIPT LOADED
// ======================

console.log("Darul Ifta Gulzar-e-Taiba Fully Functional Script Loaded!");
