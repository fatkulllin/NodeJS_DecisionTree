function pdf() {
    html2canvas(document.body).then(function(canvas) {
        var img = canvas.toDataURL('image/png');
        var doc = new jsPDF({
            format: 'a4',
        });
        doc.addImage(img, 'JPEG', 5, 5, 200, 260);
        doc.save('result.pdf');
    });
}


