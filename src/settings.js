$.when( $.ready ).then(function() {
    // Document is ready.
    $('#closeBtn').on('click',function(){
        window.close();
    });
    
  });