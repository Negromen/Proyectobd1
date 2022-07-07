function elegirPS() {
    let CS = document.getElementById('inputCS');
    let valueCS = CS.value;
    const valor = 4;
    const select = document.getElementById('inputPS');
    for (var i = 1; i <= valor; i++) {
        const option = document.createElement('option');
        option.text = i;
        select.appendChild(option);
    }
    document.getElementById('divPS').style.display = 'block';
}