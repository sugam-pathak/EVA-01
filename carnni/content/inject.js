let EVA_ACTIVE = false;
function loadCoreCSS() {
    if (document.getElementById("eva-core-style")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("content/hud.css");
    link.id = "eva-core-style";
    document.head.appendChild(link);
}


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "EVA_QUERY") {
        sendResponse({ active: EVA_ACTIVE});
    }

    if (msg.type === "EVA_ENABLE") {
        if (!EVA_ACTIVE) initEVA();
    }

    if (msg.type === "EVA_DISABLE"){
        removeEVA();
    }
        
});

function initEVA() {
    EVA_ACTIVE = true;

    const existingRoot = document.getElementById("eva-hud-root");
    if (existingRoot) {
        existingRoot.remove();
    }
        if (!document.getElementById("eva-style")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = chrome.runtime.getURL("content/hud.css");
        link.id = "eva-style";
        document.head.appendChild(link);
     }

    const root = document.createElement("div");
    root.id = "eva-hud-root";

     root.innerHTML = `

    <div class="eva-overlay">
    <div class="eva-noise"></div>
    <div class="eva-scanlines"></div>
    <div class="eva-center">
    <div class="eva-loader-circle"></div>
    <div id="eva-text"></div>
     <div class="eva-cursor"></div>
    </div>
    </div>
`;
document.body.appendChild(root);

    runBootSequence();

}

function removeEVA() {
    EVA_ACTIVE = false;
    document.getElementById("eva-hud-root")?.remove();

}

// cenematic sequence  
async function  runBootSequence() {
    const steps = [
        "Initializing EVA system......",
        "Establishing neural link.....",
        "Scanning target environment....",
        "Injecting interface protocols...",
        "Decrypting UI layers....",
        "Bypassing visual firewall....",
        "Access granted"
    ];

    const textEl = document.getElementById("eva-text");
    if (!textEl) return; 

    for (let step of steps) {
     await typeText(textEl, step);
     await delay(random(400, 900));
     glitchFlash();
    }

    await delay(800);

    // fade out cinematic 
    const overlay = document.querySelector(".eva-overlay");
    if (overlay) {
     overlay.classList.add("eva-fade-out");

     setTimeout(() => {
        overlay.remove();
        buildHUD();
     }, 800);
    }else {
        buildHUD();
    }


    
}

//typewriter effect 
//  typeText FUNCTION
function typeText(el, text) {
    return new Promise(resolve => {
        let i = 0;
        el.textContent = "";
        const interval = setInterval(() => {
            if (i < text.length) {
                el.textContent += text[i];
                i++;
                if (Math.random() < 0.08) glitchFlash();
            } else {
                clearInterval(interval);
                resolve();
            }
        }, random(20, 45));
    });
}

// flash for glitch animation, 

function glitchFlash() {
    const root = document.getElementById("eva-hud-root");
    if (root) {
        root.classList.add("glitch");
        setTimeout(() => root.classList.remove("glitch"), 120);
    }
}

function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


// load orginal hud after boot 
function buildHUD() {
    console.log("Building hud....");

    const hudRoot = document.getElementById("eva-hud-root");
    if (!hudRoot) {
        console.error("eva-hud-root not found");
        return;
    }

    fetch(chrome.runtime.getURL("content/hud.html"))
        .then(r => r.text())
        .then(html => {
            console.log("HUD HTML loaded");
            hudRoot.innerHTML = "";
            hudRoot.insertAdjacentHTML("beforeend", html);
            console.log("HUD HTML inserted");
            //load hud js 
            const script = document.createElement("script");
            script.src = chrome.runtime.getURL("content/hud.js");
            script.onload = () => {
                console.log("HUD script loaded");
                    
            };
            script.onerror = (error) => {
                ("Failed to load HUD script", error);
            };
            document.head.appendChild(script);

     })
        .catch(error => console.error("Failed to build HUD:", error));
    }