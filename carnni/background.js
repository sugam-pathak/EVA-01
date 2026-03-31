chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;

    try {
        const res = await chrome.tabs.sendMessage(tab.id, { type: "EVA_QUERY" });

        if (res?.active) {
            await chrome.tabs.sendMessage(tab.id, { type: "EVA_DISABLE" });
            return;
        }
    } catch (e) {
        console.log("No content script yet");
    }

    // Inject script
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content/inject.js"]
    });

    // Wait before enabling
    setTimeout(() => {
        chrome.tabs.sendMessage(tab.id, { type: "EVA_ENABLE" });
    }, 100);
});