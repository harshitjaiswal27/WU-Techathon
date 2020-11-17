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

function submitIt(){
    amount =  parseInt(document.getElementById("amount").value);
    
    from = document.getElementById("source").value;
    to = document.getElementById("destination").value;
    url = `https://api.transferwise.com/v3/comparisons/?sourceCurrency=${from}&targetCurrency=${to}&sendAmount=${amount}`;
    console.log(from,to,amount);
    custom_sort();
}

function custom_sort(){
    fetchData().then((res) => {
        var data = new Array();
        for (let i = 0; i < res.data.providers.length; i++)
            data.push(res.data.providers[i]);
        
            display(data);

        switch(document.getElementById('sort').value){
            case 'sortByReceivedAmount_Asc': sortByReceivedAmount_Asc(data);    break;
            case 'sortByReceivedAmount_Dsc': sortByReceivedAmount_Dsc(data);    break;
            case 'sortByRate_Asc': sortByRate_Asc(data);    break;
            case 'sortByRate_Dsc': sortByRate_Dsc(data);    break;
            case 'sortByFee_Asc': sortByFee_Asc(data);    break;
            case 'sortByFee_Dsc': sortByFee_Dsc(data);    break;
            default: sortById(data);
        }
    });
}

// function to append stuff in html
function manipulateDOM(pro)
{
    document.getElementById("myList").innerHTML="";

    for(var i=0;i<pro.length;i++){

        const cardRow = document.createElement("div"); 
        cardRow.className = "row";

        const itemDiv1 = document.createElement("div");
        itemDiv1.className = "col-3";
        var logo = document.createElement("IMG");
        logo.className = "my-3 ";
        logo.style = " max-width: 170px; height:35px; display: block; margin:0 auto;";
        logo.setAttribute("src", pro[i].logo);
        itemDiv1.appendChild(logo);
        cardRow.appendChild(itemDiv1);

        const itemDiv2 = document.createElement("div");
        itemDiv2.className = "col-2";
        itemDiv2.style = "margin: auto; text-align:center;";
        itemDiv2.appendChild(document.createTextNode(pro[i].quotes[0].fee));
        cardRow.appendChild(itemDiv2);

        const itemDiv3 = document.createElement("div");
        itemDiv3.className = "col-2";
        itemDiv3.style = "margin:auto; text-align:center;";
        itemDiv3.appendChild(document.createTextNode(pro[i].quotes[0].rate));
        cardRow.appendChild(itemDiv3);

        const itemDiv4 = document.createElement("div");
        itemDiv4.className = "col-2";
        itemDiv4.style = "margin:auto; text-align:center;";
        itemDiv4.appendChild(document.createTextNode(pro[i].quotes[0].receivedAmount));
        cardRow.appendChild(itemDiv4);

        const itemDiv5 = document.createElement("div");
        itemDiv5.className = "col-3";
        itemDiv5.style = "margin:auto; text-align:center;";
        itemDiv5.appendChild(document.createTextNode(deliveryEstimation(pro[i].quotes[0].deliveryEstimation.duration)));
        cardRow.appendChild(itemDiv5);

        const newCard = document.createElement("div"); 
        newCard.className = "card my-2 ";
        newCard.style = "max-width: 1000px; margin: 0 auto;";
        newCard.appendChild(cardRow);
        document.getElementById("myList").appendChild(newCard);
    }  
}



//function to print array in console
function display(pro)
{
  for (let i = 0; i < pro.length; i++)
    console.log(pro[i]);
}

function sortByFee_Asc(data){
    data.sort(function(a,b){
        if(a.quotes[0].fee>b.quotes[0].fee)
          return 1;
        else
          return -1;
    });
    manipulateDOM(data);
}

function sortByFee_Dsc(data){
    data.sort(function(a,b){
        if(a.quotes[0].fee>b.quotes[0].fee)
          return -1;
        else
          return 1;
    });
    manipulateDOM(data);
}

function sortByRate_Asc(data){
    data.sort(function(a,b){
        if(a.quotes[0].fee>b.quotes[0].rate)
          return -1;
        else
          return 1;
    });
    manipulateDOM(data);
}

function sortByRate_Dsc(data){
    data.sort(function(a,b){
        if(a.quotes[0].fee>b.quotes[0].rate)
          return 1;
        else
          return -1;
    });
    manipulateDOM(data);
}

function sortByReceivedAmount_Asc(data){
    data.sort(function(a,b){
        if(a.quotes[0].receivedAmount>b.quotes[0].receivedAmount)
            return 1;
        else
            return -1;
    });
    manipulateDOM(data);
}

function sortByReceivedAmount_Dsc(data){
    data.sort(function(a,b){
        if(a.quotes[0].receivedAmount>b.quotes[0].receivedAmount)
            return -1;
        else
            return 1;
    });
    manipulateDOM(data);
}

function sortById(data){
    data.sort(function(a,b){
        if(a.id>b.id)
          return 1;
        else
          return -1;
    });
    manipulateDOM(data);
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

function deliveryEstimation(duration){
    var s="";
    if(duration.min == null)
        s+="Upto "+ convertDuration(duration.max);
    else if(duration.max == null)
        s+="Minimum "+ convertDuration(duration.min);
    else
        s+="Within "+ convertDuration(duration.max);
    
    return s;
}