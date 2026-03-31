if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initHUD());
    } else {
    initHUD();
}

const initHUD = () => {
    const btn = document.getElementById("eva-toggle");
    const root = document.getElementById("eva-hud-root");

    if (!btn || !root) return;

    btn.addEventListener("click", () => {
        root.classList.toggle("hidden");
        if (btn.textContent === "HUD OFF") {
            btn.textContent = "HUD ON"
        } else {
            btn.textContent = "HUD OFF"
        }
    });
    addSparkEffect();
};



// Live clock
setInterval(() => {
    const timeElement = document.getElementById("eva-time");
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        timeElement.textContent = timeString;
    }
}, 1000);

// spark effect function 
function addSparkEffect() {
    //function to create spark 
    function createSpark(x,y) {
        const sparkCount = 6;

        for (let i=0; i<sparkCount; i++) {
            const spark = document.createElement("div");

            //random angle and distance 
            const angle = Math.random() *Math.PI * 2;
            const distance = Math.random() * 40+10;
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            spark.style.position = "fixed";
            spark.style.left = x + "px";
            spark.style.top = y + "px";
            spark.style.width = "4px";
            spark.style.height = "4px";
            spark.style.background = `radial-gradient(circle, #ff6600, #ff3300)`;
            spark.style.borderRadius = "50%";
            spark.style.pointerEvents = "none";
            spark.style.zIndex = "2147483647";

            let startTime = performance.now();
            const startX = x;
            const startY = y;

            function animateSpark(currentTime) {
                const elapsed = currentTime - startTime;
                const duration = 500;

                if (elapsed >= duration) {
                    spark.remove();
                    return;

                }

                const progress = elapsed / duration;
                const currentX = startX + dx * progress;
                const currentY = startY + dy * progress;
                const size = 4 * (1 - progress);
                const opacity = 1 - progress;

                spark.style.left = currentX + "px";
                spark.style.top = currentY + "px";
                spark.style.width = size + "px";
                spark.style.height = size + "px";
                spark.style.opacity = opacity;

                requestAnimationFrame(animateSpark);
            }

            document.body.appendChild(spark);
            requestAnimationFrame(animateSpark);

        }
    }

    // hover effect to all HUD elements 
    const addHoverEffect = () => {
        const hudElements = document.querySelectorAll(".eva-hud *");
        hudElements.forEach(element => {
            if (!element.hasSpark) {
                element.hasSpark = true;
                element.addEventListener("mouseenter", (e) => {
                    createSpark(e.clientX, e.clientY);
                });
            }
        });
    }

    addHoverEffect();


    //wtch for new wlwmens dynamically 
     const observer = new MutationObserver(() => {
      addHoverEffect();
        });

    const hudContainer = document.querySelector(".eva-hud");
    if (hudContainer) {
        observer.observe(hudContainer, {
        childList: true,
        subtree: true
        });
    }
}
// glow effect on hover in css 

const addGlowStyle = () => {
    const style = document.createElement('style');
    style.textContent = `
    .eva-hud *:hover {
        text-shadow: 0 0 8px #ff3300, 0 0 12px #ff6600;
        transition: text-shadow 0.1s ease;   
     }
    `;
    document.head.appendChild(style);
};
addGlowStyle();
//add sound  mp3

const playWarning = () => {
    const audio = new Audio(chrome.runtime.getURL("content/eva-warning.mp3"));
    audio.volume = 0.6;
    audio.play().catch(() => {});
};

const setupAI = () => {
    const input = document.getElementById("eva-input");
    const output = document.getElementById("eva-output");

    if (!input || !output) return;

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const cmd = input.value.toLowerCase();
            input.value = "";

            if (cmd.includes("time")) {
                output.textContent = "TIME: " + new Date().toLocaleTimeString();
            }
            else if (cmd.includes("status")) {
                output.textContent = "ALL SYSTEMS NOMINAL";
            }
            else if (cmd.includes("clear")){
                output.textContent = "";
            }
            else {
                output.textContent = "UNKNOWN COMMAND";
            }
        }
    });

};

setTimeout(setupAI, 500)

setInterval(() => {
    const stats = document.querySelectorAll(".eva-stat strong");

    if (stats.length >= 3) {
        stats[0].textContent = (70 + Math.random() * 20).toFixed(1) + "%";
    }
}, 1000);