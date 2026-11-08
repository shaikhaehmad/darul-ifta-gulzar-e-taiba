import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// ======================
// FIREBASE CONFIGURATION
// ======================

const firebaseConfig = {
    apiKey: "AIzaSyCHn1wyyuJCqIV2BH6MoMt7oCjfl_15-9s",
    authDomain: "darul-ifta-gulzar-e-taiba.firebaseapp.com",
    projectId: "darul-ifta-gulzar-e-taiba",
    storageBucket: "darul-ifta-gulzar-e-taiba.firebasestorage.app",
    messagingSenderId: "129078877979",
    appId: "1:129078877979:web:d47d60a74123c828ccfdbe"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ======================
// IMAGE SLIDER
// ======================

const slides = document.querySelectorAll(".slide");

let slideIndex = 0;

if (slides.length > 0) {

    setInterval(() => {

        slides[slideIndex].classList.remove("active");

        slideIndex = (slideIndex + 1) % slides.length;

        slides[slideIndex].classList.add("active");

    }, 3000);

}


// ======================
// SEARCH DATA
// ======================

const data = [

    {
        title: "गैर बिरादरी में निकाह का हुक्म",
        keywords: "nikah gair biradri shaadi marriage hukam",
        type: "PDF",
        file: "pdf/gair-biradri-me-nikah-ka-hukam.pdf"
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

        const filteredData = data.filter(item =>

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
            heading.textContent = item.title;

            const link = document.createElement("a");
            link.href = item.file;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "📄 PDF Kholen";

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
        
        // File input check (agar html mein file input hai)
        const fileInput = document.getElementById("fileInput"); 
        let fileName = "Koi file select nahi ki gayi";
        
        if (fileInput && fileInput.files && fileInput.files.length > 0) {
            fileName = fileInput.files[0].name;
        }

        if (!name || !mobile || !address || !question) {

            alert("Sabhi details (Naam, Mobile, Address aur Sawal) bharein.");

            return;

        }

        const submitButton = fatwaForm.querySelector(
            'button[type="submit"]'
        );

        try {

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            // 1. Firebase mein data save hoga
            await addDoc(collection(db, "fatwas"), {

                name: name,
                mobile: mobile,
                address: address,
                question: question,
                file: fileName,
                date: serverTimestamp(),
                status: "pending"

            });

            // 2. WhatsApp message format taiyar karna
            // Yahan apna WhatsApp Number daal dein (Country code ke sath, jaise 91XXXXXXXXXX)
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

            // 3. WhatsApp par redirect karna
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
// PDF LIBRARY
// ======================

const pdfData = [

    {
        title: "गैर बिरादरी में निकाह का हुक्म",
        category: "Nikah",
        file: "pdf/gair-biradri-me-nikah-ka-hukam.pdf"
    }

];

const pdfList = document.getElementById("pdfList");
const searchInput = document.getElementById("searchInput");

function loadPDFs(filter = "") {

    if (!pdfList) return;

    pdfList.innerHTML = "";

    const filteredPDFs = pdfData.filter(pdf =>

        pdf.title.toLowerCase().includes(filter.toLowerCase()) ||

        pdf.category.toLowerCase().includes(filter.toLowerCase())

    );

    if (filteredPDFs.length === 0) {

        pdfList.textContent = "Koi PDF nahi mili.";

        return;

    }

    filteredPDFs.forEach(pdf => {

        const card = document.createElement("div");
        card.className = "pdf-card";

        const heading = document.createElement("h3");
        heading.textContent = pdf.title;

        const category = document.createElement("p");
        category.textContent = "Category: " + pdf.category;

        const link = document.createElement("a");
        link.href = pdf.file;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "📖 Read PDF";

        card.appendChild(heading);
        card.appendChild(category);
        card.appendChild(link);

        pdfList.appendChild(card);

    });

}

if (searchInput) {

    searchInput.addEventListener("input", function () {

        loadPDFs(this.value);

    });

}

loadPDFs();


// ======================
// SCRIPT LOADED
// ======================

console.log("Darul Ifta Gulzar-e-Taiba Website Loaded Successfully!");
