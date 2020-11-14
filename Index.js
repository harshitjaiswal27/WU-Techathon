// https://api.sandbox.transferwise.tech/v1/quotes?source=INR&target=USD&targetAmount=2000&rateType=FIXED
// https://api.transferwise.com/v3/comparisons/?sourceCurrency=GBP&targetCurrency=EUR&sendAmount=10000
var to = "USD";
var from = "INR";
var amount = 900;
var pro;
let url = `https://api.transferwise.com/v3/comparisons/?sourceCurrency=${to}&targetCurrency=${from}&sendAmount=${amount}`;
const fetchData = async () => {
  const api_call = await fetch(url);
  const data = await api_call.json();

  return {
    data
  };
};


const showData = () => {
  fetchData().then((res) => {

    //object array for providers
    pro = new Array();
    for (let i = 0; i < res.data.providers.length; i++)
      pro.push(res.data.providers[i]);

    console.log("after sorting by ID")
    pro.sort(function(a,b){
      if(a.id>b.id)
        return 1;
      else
        return -1;

    });
    display(pro);


    console.log("after sorting by recieved amount");
    pro.sort(function(a,b){
      if(a.quotes[0].receivedAmount>b.quotes[0].receivedAmount)
        return 1;
      else
        return -1;
    });
    display(pro);


    console.log("after sorting by fee");
    pro.sort(function(a,b){
      if(a.quotes[0].fee>b.quotes[0].fee)
        return 1;
      else
        return -1;
    });
    display(pro);
    HTMLstuff(pro);
  })

}

showData();

//function to print array in console
function display(pro)
{
  for (let i = 0; i < pro.length; i++)
    console.log(pro[i]);
}


//function to append stuff in html
function HTMLstuff(pro)
{


   for(var i=0;i<pro.length;i++)
   {
     var Parentnode = document.createElement("UL");
      var node1 = document.createElement("LI");

      node1.appendChild(document.createTextNode(pro[i].quotes[0].fee));
      node1.appendChild(document.createTextNode(pro[i].alias));

      document.getElementById("myList").appendChild(node1);
   }
}
