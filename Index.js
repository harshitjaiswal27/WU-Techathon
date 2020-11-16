// https://api.sandbox.transferwise.tech/v1/quotes?source=INR&target=USD&targetAmount=2000&rateType=FIXED
// https://api.transferwise.com/v3/comparisons/?sourceCurrency=GBP&targetCurrency=EUR&sendAmount=10000

var from = "GBP" ;
var to = "EUR";
var amount = 1000;
var url;

url = `https://api.transferwise.com/v3/comparisons/?sourceCurrency=${to}&targetCurrency=${from}&sendAmount=${amount}`;

const fetchData = async () => {
  const api_call = await fetch(url);
  const data = await api_call.json();
  return{
      data
  };
};

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

function custom_sort(){
    console.log(document.getElementById('sort').value);
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

// custom_sort();

//function to print array in console
function display(pro)
{
  for (let i = 0; i < pro.length; i++)
    console.log(pro[i]);
}

function submitIt(){
    amount =  parseInt(document.getElementById("amount").value);
    
    from = document.getElementById("source").value;
    to = document.getElementById("destination").value;
    url = `https://api.transferwise.com/v3/comparisons/?sourceCurrency=${to}&targetCurrency=${from}&sendAmount=${amount}`;
    console.log(from,to,amount);
    custom_sort();
}

// function to append stuff in html
function manipulateDOM(pro)
{
    document.getElementById("myList").innerHTML="";

    for(var i=0;i<pro.length;i++){
        
        const newCard = document.createElement("div"); 
        newCard.className = "card mb-3";

        const cardRow = document.createElement("div"); 
        cardRow.className = "row no-gutters";

        const itemDiv1 = document.createElement("div");
        itemDiv1.className = "col-md-3";
        var logo = document.createElement("IMG");
        logo.className = "mx-4 my-4";
        logo.setAttribute("src", pro[i].logo);
        itemDiv1.appendChild(logo);
        cardRow.appendChild(itemDiv1);

        const itemDiv2 = document.createElement("div");
        itemDiv2.className = "col-md-2";
        itemDiv2.style = "margin:auto;";
        itemDiv2.appendChild(document.createTextNode(pro[i].quotes[0].fee));
        cardRow.appendChild(itemDiv2);

        const itemDiv3 = document.createElement("div");
        itemDiv3.className = "col-md-2";
        itemDiv3.style = "margin:auto;";
        itemDiv3.appendChild(document.createTextNode(pro[i].quotes[0].rate));
        cardRow.appendChild(itemDiv3);

        const itemDiv4 = document.createElement("div");
        itemDiv4.className = "col-md-2";
        itemDiv4.style = "margin:auto;";
        itemDiv4.appendChild(document.createTextNode(pro[i].quotes[0].receivedAmount));
        cardRow.appendChild(itemDiv4);

        newCard.appendChild(cardRow);
        
        var listnode = document.createElement("LI");
        listnode.appendChild(newCard);
        document.getElementById("myList").appendChild(listnode);
    }  
}

