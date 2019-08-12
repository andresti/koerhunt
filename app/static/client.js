var el = x => document.getElementById(x);

function showPicker(inputId) { el('file-input').click(); }

function showPicked(input) {
    el('upload-label').innerHTML = input.files[0].name;
    el('result-label').innerHTML = '';
    var reader = new FileReader();
    reader.onload = function (e) {
        el('image-picked').src = e.target.result;
        el('image-picked').className = '';
    }
    reader.readAsDataURL(input.files[0]);
}

function analyze() {
    var uploadFiles = el('file-input').files;
    if (uploadFiles.length != 1) alert('Vali fail analüüsimiseks!');

    el('analyze-button').innerHTML = 'Analüüsin...';
    var xhr = new XMLHttpRequest();
    var loc = window.location
    xhr.open('POST', `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`, true);
    xhr.onerror = function() {alert (xhr.responseText);}
    xhr.onload = function(e) {
        if (this.readyState === 4) {
            var response = JSON.parse(e.target.responseText);
            if (response['error_code'] == 0) {
                el('result-label').style.color = '#000000'
                el('result-label').innerHTML = `Olen ${response['prob']}% kindel, et pildil on ${response['result']}.`;
            }
            else {
                el('result-label').style.color = '#ff0000'
                el('result-label').innerHTML = `${response['error_msg']}`;
            }
        }
        el('analyze-button').innerHTML = 'Analüüsi';
    }

    var fileData = new FormData();
    fileData.append('file', uploadFiles[0]);
    xhr.send(fileData);
}

