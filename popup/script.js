window.onload = async () => {
    let locstorage = await browser.storage.local.get();

    if ('serverurl' in locstorage && locstorage['serverurl'])
        document.querySelector('#serverurl').value = locstorage['serverurl'];
    else
    {
        document.querySelector("#serverurl").value = "https://uwu.so";
        await browser.storage.local.set({ "serverurl": "https://uwu.so" });
    }

    if ('userkey' in locstorage && locstorage['userkey'])
        document.querySelector('#userkey').value = locstorage['userkey'];
    else
    {
        document.querySelector("#userkey").value = "";
        await browser.storage.local.set({ "userkey": "" });
    }

    document.querySelector(".input-button").onclick = async () => {
        let newServerURL = document.querySelector('#serverurl').value;
        let newUserKey = document.querySelector('#userkey').value;
        await browser.storage.local.set({ "userkey": newUserKey, "serverurl": newServerURL });
        document.querySelector(".input-button").innerText = "Saved!";
        document.querySelector(".input-button").disabled = true;

        setTimeout(() => { document.querySelector(".input-button").disabled = false; document.querySelector(".input-button").innerText = "Save"; }, 1000);
    };
};