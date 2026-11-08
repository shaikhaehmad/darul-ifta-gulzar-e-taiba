// ======================
// FATWA FORM - DIRECT WHATSAPP REDIRECT
// ======================

const fatwaForm = document.getElementById("fatwaForm");

if (fatwaForm) {
    fatwaForm.addEventListener("submit", function (e) {
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
            alert("Kripya sabhi details (Naam, Mobile, Address aur Sawal) bharein.");
            return;
        }

        const adminWhatsAppNumber = "918758647929"; 

        const whatsappMessage = 
            "*دارالافتاء گلزار طیبہ*%0A" +
            "*--- جدید سوال / مسئلہ ---*%0A%0A" +
            "👤 *Naam:* " + encodeURIComponent(name) + "%0A" +
            "📱 *Mobile:* " + encodeURIComponent(mobile) + "%0A" +
            "🏠 *Address:* " + encodeURIComponent(address) + "%0A%0A" +
            "❓ *Sawal / Masla:*%0A" + encodeURIComponent(question) + "%0A%0A" +
            "📎 *Attachment:* " + encodeURIComponent(fileName) + "%0A" +
            "*(Note: Agar koi photo/document hai, toh kripya is message ke sath ya alag se WhatsApp par bhej dein.)*";

        const whatsappURL = `https://api.whatsapp.com/send?phone=${adminWhatsAppNumber}&text=${whatsappMessage}`;

        alert("Aapka sawal bhej diya gaya hai. Ab WhatsApp khul raha hai...");
        fatwaForm.reset();

        // WhatsApp par redirect karega
        window.open(whatsappURL, "_blank");
    });
}

console.log("Darul Ifta Form Script Loaded Successfully!");
