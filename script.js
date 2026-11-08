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
// FATWA FORM - FIREBASE & WHATSAPP
// ======================

const fatwaForm = document.getElementById("fatwaForm");

if (fatwaForm) {
    fatwaForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Aapke HTML form ke IDs ke mutabiq fields utha rahe hain
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
            alert("Kripya sabhi details (Naam, Mobile, Address aur Sawal) bharein.");
            return;
        }

        const submitButton = fatwaForm.querySelector('button[type="submit"]');

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Sending...";
            }

            // 1. Firebase Firestore ke 'fatwas' collection mein data save hoga
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

            // 3. WhatsApp par redirect karega
            window.open(whatsappURL, "_blank");
        }
        catch (error) {
            console.error("Firebase Error:", error);
            alert("Kuch technical problem aayi. Dobara koshish karein.");
        }
        finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "WhatsApp par Sawal Bhejein";
            }
        }
    });
}

console.log("Darul Ifta Form Script Loaded Successfully!");
