// Callback reads runtime.lastError to prevent an unchecked error from being 
// logged when the extension attempt to register the already-registered menu 
// again. Menu registrations in event pages persist across extension restarts.
browser.contextMenus.create({
        id: "upload-to-uwu-so",
        title: "Upload to uwu.so",
        contexts: ["image"],
        icons: {
            "48": "icons/48.png"
        },
    },
    () => void browser.runtime.lastError,
);

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId)
    {
        case "upload-to-uwu-so":
            if ( !((await browser.storage.local.get("userkey"))['userkey']) )
            {
                browser.notifications.create({
                    type: "basic",
                    iconUrl: browser.extension.getURL("icons/48.png"),
                    title: 'Image NOT uploaded!',
                    message: 'You need to set your key first.'
                });
                return;
            }
            let imageUrl = info.srcUrl;
            let imageFile = await fetch(imageUrl);

            let imageBuffer = await imageFile.arrayBuffer();
            let imageBlob = new Blob([imageBuffer]);
            imageBlob = imageBlob.slice(0, imageBlob.size, 'image/jpeg');

            let formData = new FormData();
            formData.append("file", imageBlob, 'image.jpg');

            let uwuSoResponse = await fetch(`${(await browser.storage.local.get("serverurl"))['serverurl']}/api/private/uploads/new`,
                {
                    'Content-Type': 'multipart/form-data',
                    'method': 'POST',
                    'headers':
                    {
                        'Authorization': (await browser.storage.local.get("userkey"))['userkey'],
                        'Access-Control-Allow-Origin': 'https://twitter.com',
                        'Access-Control-Allow-Credentials': 'true'
                    },
                    "body": formData
                });
            let jsonResponse = await uwuSoResponse.json();
            copyToClipboard(jsonResponse.data.link);
            browser.notifications.create({
                type: "basic",
                iconUrl: browser.extension.getURL("icons/48.png"),
                title: 'Image uploaded!',
                message: 'Image has been uploaded.'
            });
            break;
        default:
            break;
    }
});

function copyToClipboard(text) {
    function oncopy(event) {
        document.removeEventListener("copy", oncopy, true);
        event.stopImmediatePropagation();

        event.preventDefault();
        event.clipboardData.setData("text/plain", text);
    }
    document.addEventListener("copy", oncopy, true);

    document.execCommand("copy");
}