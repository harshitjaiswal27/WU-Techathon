// $(function () {
    
//   });
$(document).ready(function (){
    $("#getRate").click(function (){
        alert($("#datepicker").val());
        
        });
    $("#datepicker").datepicker({ 
            autoclose: true, 
            todayHighlight: true
      }).datepicker('update', new Date());
});

