/* Import value of blueprintString textbox to device's clipboard */
function copyBlueprint() { 
    /* Get the text field */
    var copyText = document.getElementById("blueprintString");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
}

function toBase64(buf) {
    var binaryString = Array.prototype.map.call(buf, function (ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binaryString);
}

function fromBase64(buf) {
    return Uint8Array.from(atob(buf), c => c.charCodeAt(0))
}

/* Translate JSON into Factorio's Base64 blueprint string */
function createBlueprintString() {
    var blueprintJSON = document.getElementById("blueprintJSON").value;
    if (blueprintJSON == '') {
        document.getElementById("blueprintString").value= ""
        return;
    }
    var json = JSON.stringify(JSON.parse(blueprintJSON));
    console.log(json)

    var enc = new TextEncoder("utf-8").encode(json);
    console.log(enc)

    var data = pako.deflate(enc, { level: 9 });
    console.log(data)

    var encoded = toBase64(data);
    console.log(encoded)

    document.getElementById("blueprintString").value = "0"+encoded
}

/* Translate Base64 blueprint string into JSON */
function createBlueprintJSON() {
    var blueprintString = document.getElementById("blueprintString").value;
    if (blueprintString == '') {
        document.getElementById("blueprintJSON").value = ""
        return;
    }
    if (blueprintString.charAt(0) != 0) {
        document.getElementById("blueprintJSON").value = "Not a valid Blueprint String"
        return;
    }

    let data = fromBase64(blueprintString.substring(1))
    console.log(data)

    let encode = pako.inflate(data)
    console.log(encode)

    var jsonString = new TextDecoder("utf-8").decode(pako.inflate(data));
    console.log(jsonString)

    document.getElementById("blueprintJSON").value = JSON.stringify(JSON.parse(jsonString), null, 2)
}