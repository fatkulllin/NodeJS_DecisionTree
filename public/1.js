
function opentable() {

    document.getElementById('btncreatevaluetab').click();
    filltab1();
    document.getElementById('btncreatevaluetab1').click();
    filltab2();
    document.getElementById('btncreatevaluetab2').click();
    filltab3();
    document.getElementById('btncreatevaluetab3').click();

};

function filltab1() {

    table = document.getElementById('tabvalue');
    strtable =  document.getElementById('inputtabvalue').value;
    str1 = '';
    numcol = 0;

    for (i = 0; i<=strtable.length; i++) {

        if (strtable[i] != ';') {

            str1 += strtable[i];

        }   
        
        else {

            table.rows[0].cells[numcol].innerHTML = str1;
            numcol++;
            str1 = '';  

        }

    }

};

function filltab2() {

    table = document.getElementById('tabvalue1');
    strtable =  document.getElementById('inputtabvalue1').value;
    str1 = '';
    numcol = 0;
    numrow = 1;
    numcols = document.getElementById('cols').value;   
    
    for (i = 0; i<= strtable.length; i++) {

        if (strtable[i] != ';') {

            str1 += strtable[i];

        }  
        
        else {

            table.rows[numrow].cells[numcol].innerHTML = str1;
            numcol++;
            if (numcol == numcols) {

                numcol = 0;
                numrow++;

            }
            str1 = '';     

        }

    }

};

function filltab3() {

    table = document.getElementById('tabvalue2');

    strtable =  document.getElementById('inputtabvalue2').value;
    str1 = '';
    numcol = 0;

    for (i = 0; i<=strtable.length; i++) {

        if (strtable[i] != ';') {

            str1 += strtable[i];

        }   
        
        else {

            table.rows[1].cells[numcol].innerHTML = str1;
            numcol++;
            str1 = '';  

        }

    }

};
