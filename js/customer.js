
var currentCustomer;


//helper functions
function switchEdit(field, value){
var formField = $.Mustache.render('editField-'+field, value);
            $('#formField-'+field).html(formField);

}

function switchRead(currentField,field, propertyId){
  var formField = $.Mustache.render('displayReadValue', currentField.value);
            $('#formField-'+field).html(formField);
            updateDocumentProperty(currentCustomer, propertyId, currentField.value);

}

//main functions

function browseCustomer(customerId){
  
	 client.document(customerId)
      .fetch(function(error, data) {
        if (error) {
          throw error;
        }

        doc = data;
        currentCustomer = data.uid
        console.log(data);
        $.Mustache.load('./templates/customer.html').done(function(){
          var content = $.Mustache.render('customers-view', doc);
            $('body').html(content);
          	})
      });
  }

  function browseListOfCustomers(){

  	client.operation("Document.Query")
        .params({
          query: "select * from Customer where ecm:currentLifeCycleState != 'deleted'"
         
        })
        .execute(function(error, data) {
        	console.log(data);  
          if (error) {
            throw error;
          }
          else{
          	var documents=data;
          	$.Mustache.load('./templates/listOfCustomers.html').done(function(){
              var content = $.Mustache.render('customers-listing', documents);
          		 $('body').html(content);
          	})
          }
}
);
  };

function updateDocumentProperty(docId, propertyId, propertyValue){
client.document(docId).fetch(function(error,data){
  var dirtyProperties = {};
  dirtyProperties[propertyId] = propertyValue
  data.set(dirtyProperties);
  data.save();
})
}