const commands = require("commands");
const fs = require("uxp").storage.localFileSystem;

async function JSONSelected(selected) {
    if (selected.items.length !== 0) {
        let array = []
        let jsonB = false;
        let jsonString = "";
        let jsonFinal = ""
        let count = 0
        selected.items.forEach(node => {
            count += 1
            console.log(node)
            let stringNode = node.toString()
            for (var i = 0; i < stringNode.length; i++) {
                if (stringNode[i] == '{') {
                    jsonB = true
                }
                if (stringNode[i] == ',' && stringNode[i + 1] == ' ' && stringNode[i + 2] == 'h') {
                    jsonString = jsonString + '"'
                }
                if (stringNode[i - 2] == ',' && stringNode[i - 1] == ' ' && stringNode[i] == 'h') {
                    jsonString = jsonString + '\n  "'
                }
                if (stringNode[i - 2] == ':' || stringNode[i] == ':' || stringNode[i - 3] == '\n') {
                    jsonString = jsonString + '"'
                }
                if (stringNode[i] == '\n' && stringNode[i - 1] != '{') {
                    jsonString = jsonString + '"'
                }
                if (stringNode[i] == '}') {
                    jsonB = false
                    if(count === selected.items.length ){
                        jsonString = jsonString + '}\n'
                    }
                    else{
                        jsonString = jsonString + '},\n'
                    }
                }
                if (jsonB) {
                    jsonString = jsonString + stringNode[i]
                }
            }
        });
        jsonString = '[' + jsonString + ']'
        for (var y = 0; y < jsonString.length; y++) {
            jsonFinal = jsonFinal + jsonString[y]
            if (jsonString[y] == '"' && jsonString[y + 1] == '\n' && jsonString[y + 2] != '}') {
                jsonFinal = jsonFinal + ','
            }
        }
        console.log(array)
        const dialog = showAlert(jsonFinal);
        return dialog.showModal();

    }
    else {
        const dialog = showModalNotSelected();
        return dialog.showModal();
    }

}

function showModalNotSelected() {
    document.body.innerHTML = `
        <style>
            .dialog{
                height: 120px;
            }
            form {
                width: 400px;
            }
        </style>
        <dialog id="dialog" class="dialog">
        <form method="dialog">
            <h1>Debe tener al menos 1 elemento seleccionado</h1>
            <button type="submit" id="cancelar-button">Cerrar</button>  
        </form>
        </dialog>
  `;
    const dialog = document.getElementById("dialog");
    const btnCancelar = document.getElementById('cancelar-button')
    dialog.addEventListener("close", e => dialog.remove());
    btnCancelar.addEventListener("click", e => dialog.remove());
    return dialog;
}

function showAlert(message) {
    document.body.innerHTML = `
    <style>
    form {
        width: 400px;
    }
    .area{
        height: 200px;
    }
    .dialog{
        height: 500px;
    }
    </style>
    <dialog id="dialog" class="dialog">
    <form method="dialog">
    <h1>Export JSON</h1>
    <p>Informacion en formato json</p>
    <textarea class="area" type="text" uxp-quiet="true" readonly >"${message}"</textarea>
    <button type="submit" class="button" id="import-button" >Exportar</button>  
    <button type="submit" class="button" id="cancelar-button" >cerrar</button>  
    </form>
    </dialog>
  `;
    const dialog = document.querySelector("#dialog");
    const btnImport = document.getElementById('import-button')
    const btnCancelar = document.getElementById('cancelar-button')
    dialog.addEventListener("close", e => dialog.remove());
    btnCancelar.addEventListener("close", e => dialog.remove());
    btnImport.addEventListener("click", e => fileJson(message));

    return dialog;
}

async function fileJson(json) {
    const folder = await fs.getFolder()
    const file = await folder.createFile("AdobeXD.json", { overwrite: true });
    file.write(json);

    const dialog = succesModal(folder);
    return dialog.showModal();
}


function succesModal(rute) {
    document.body.innerHTML = `
    <style>
    form {
        width: 400px;
    }
    .area{
        height: 200px;
    }
    .dialog{
        height: 200px;
    }
    </style>
    <dialog id="dialog" class="dialog">
    <form method="dialog">
    <h1>Export JSON</h1>
    <p>El archivo "AdobeXD.json" a sido creado en ${rute.nativePath} con exito</p>
    <button type="submit" class="button" id="cancelar-button" >cerrar</button>  
    </form>
    </dialog>
  `;
    const dialog = document.querySelector("#dialog");
    const btnCancelar = document.getElementById('cancelar-button')
    dialog.addEventListener("close", e => dialog.remove());
    btnCancelar.addEventListener("close", e => dialog.remove());
    return dialog;
}


module.exports = {
    commands: {
        JSONSelected
    }
}