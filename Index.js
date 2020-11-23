var from = "GBP" ;
var to = "EUR";
var amount = 1000;
var url;

url = `https://api.transferwise.com/v3/comparisons/?sourceCurrency=${from}&targetCurrency=${to}&sendAmount=${amount}`;

const fetchData = async () => {
  const api_call = await fetch(url);
  const data = await api_call.json();
  return{
      data
  };
};

function compareProviders(){

    document.getElementById("providers").innerHTML="";

    amount =  parseInt(document.getElementById("amount").value);
    
    from = document.getElementById("source").value;
    to = document.getElementById("destination").value;
    url = `https://api.transferwise.com/v3/comparisons/?sourceCurrency=${from}&targetCurrency=${to}&sendAmount=${amount}`;

    fetchData().then((res) => {
        var data = new Array();
        for (let i = 0; i < res.data.providers.length; i++)
            data.push(res.data.providers[i]);
        
            manipulateDOM(data);
            display(data);
    });
}

function display(pro)
{
  for (let i = 0; i < pro.length; i++)
    console.log(pro[i]);
}

function manipulateDOM(data)
{
    if(data.length==0){

        let tr = document.createElement("tr");
        let td = document.createElement("td");
        td.colSpan=5;
        td.appendChild(document.createTextNode("No provider found for given amount & selected combination!"));
        tr.appendChild(td);

        document.getElementById("providers").appendChild(tr);
    }

    for(var i=0;i<data.length;i++){

        let tr = document.createElement("tr");

        let td = document.createElement("td");
        let img = document.createElement("IMG");
        img.style = "max-width:150px ; max-height:50px;"
        img.setAttribute("src", data[i].logo);

        td.appendChild(img);
        tr.appendChild(td);
        
        let fee = data[i].quotes[0].fee;
        let rate = data[i].quotes[0].rate;

        td = document.createElement("td");
        td.appendChild(document.createTextNode(fee.toFixed(2)+" "+from));
        td.appendChild(document.createElement("br"));
        var node = document.createElement("span");
        node.style = "font-size: smaller;";
        node.appendChild(document.createTextNode("("+(fee*rate).toFixed(2)+" "+to+")"));
        td.appendChild(node);

        tr.appendChild(td);

        td = document.createElement("td");
        node = document.createElement("span");
        node.style = "font-size: smaller;";
        node.appendChild(document.createTextNode("1 "+from+" = "))
        td.appendChild(node);
        td.appendChild(document.createElement("br"));
        td.appendChild(document.createTextNode(rate.toFixed(4)+" "+to));

        tr.appendChild(td);

        td = document.createElement("td");
        td.appendChild(document.createTextNode(data[i].quotes[0].receivedAmount.toFixed(2)+" "+to));

        tr.appendChild(td);

        td = document.createElement("td");
        td.appendChild(document.createTextNode(deliveryEstimation(data[i].quotes[0].deliveryEstimation.duration)));

        tr.appendChild(td);

        document.getElementById("providers").appendChild(tr);
    }  
}

function sortTable(n) {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("providers");
    switching = true;
    dir = "asc"; 

    while (switching) {
        switching = false;
        rows = table.rows;

        for (i = 0; i < (rows.length - 1); i++){
            
            shouldSwitch = false;

            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (dir == "asc"){
                if (x.innerHTML > y.innerHTML){
                    shouldSwitch= true;
                    break;
                }
            } 
            else if (dir == "desc"){
                if (x.innerHTML < y.innerHTML){
                    shouldSwitch = true;
                    break;
                }
            }
        }
        
        if (shouldSwitch){
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++; 
        } 
        else{
            if (switchcount == 0 && dir == "asc"){
                dir = "desc";
                switching = true;
            }
        }
    }
}

function deliveryEstimation(duration){
    var s="";
    if(duration == null)
        s+='--';
    else if(duration.min == null)
        s+="Upto "+ convertDuration(duration.max);
    else if(duration.max == null)
        s+="Minimum "+ convertDuration(duration.min);
    else
        s+="Within "+ convertDuration(duration.max);
    return s;
}

function convertDuration(t){ 
    //dividing period from time
    var x = t.split('T'),
        duration = '',
        time = {},
        period = {},
        //just shortcuts
        s = 'string',
        v = 'variables',
        l = 'letters',
        // store the information about ISO8601 duration format and the divided strings
        d = {
            period: {
                string: x[0].substring(1,x[0].length),
                len: 4,
                // years, months, weeks, days
                letters: ['Y', 'M', 'W', 'D'],
                variables: {}
            },
            time: {
                string: x[1],
                len: 3,
                // hours, minutes, seconds
                letters: ['H', 'M', 'S'],
                variables: {}
            }
        };
    //in case the duration is a multiple of one day
    if (!d.time.string) {
        d.time.string = '';
    }

    for (var i in d) {
        var len = d[i].len;
        for (var j = 0; j < len; j++) {
            d[i][s] = d[i][s].split(d[i][l][j]);
            if (d[i][s].length>1) {
                d[i][v][d[i][l][j]] = parseInt(d[i][s][0], 10);
                d[i][s] = d[i][s][1];
            } else {
                d[i][v][d[i][l][j]] = 0;
                d[i][s] = d[i][s][0];
            }
        }
    } 
    period = d.period.variables;
    time = d.time.variables;
    time.H +=   24 * period.D + 
                            24 * 7 * period.W +
                            24 * 7 * 4 * period.M + 
                            24 * 7 * 4 * 12 * period.Y;

    if (time.H) {
        duration = time.H + ':';
        if (time.M < 10) {
            time.M = '0' + time.M;
        }
    }

    if (time.S < 10) {
        time.S = '0' + time.S;
    }

    duration += time.M + ':' + time.S;
    return duration;
}