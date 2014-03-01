
var currentCustomer;

function getVocabularyData(directoryName, callback){
 client.operation("Directory.Entries").params({"directoryName":directoryName}).execute(function(error,data){ callback(data)});

}



function drawDropZone(){

var myDropzone = new Dropzone("#droparea", {"url":"#","createImageThumbnails":true,accept:function (file, done) {
    if (file.name != "justinbieber.jpg") {
      importOp = client.operation('Blob.Attach').params({
        document : currentDocId,
        save : 'true',
        xpath : 'npi:screenshot1'
      })
      importOp.uploader().uploadFile(file,null);
      importOp.uploader().execute(function(error, data){});
    }
    else { done(); }
  }});

  
}

//helper functions
function switchEdit(formFieldId,value, widgetType , options){

  var templateData ={};


  templateData["fieldValue"]= value;

  if (widgetType=="vocabulary"){
   var vocabularyEntries={};
   getVocabularyData(options['directoryName'],function (data){
 templateData['vocabularyEntries']= data;
 var formField = $.Mustache.render('editField-'+formFieldId, templateData);
  $('#formField-'+formFieldId).html(formField);
   });

  }
   else {
    var formField = $.Mustache.render('editField-'+formFieldId, templateData);
  $('#formField-'+formFieldId).html(formField);
   }

}

function switchRead(currentField,field, propertyId){
  var formField = $.Mustache.render('displayReadValue', currentField.value);
            $('#formField-'+field).html(formField);
            updateDocumentProperty(currentCustomer, propertyId, currentField.value);

}

//main functions
var currentDocId;
function browseCustomer(customerId){
  
	 client.document(customerId)
      .fetch(function(error, data) {
        if (error) {
          throw error;
        }
        currentDocId=data.uid;
        doc = data;
        currentCustomer = data.uid;
       
        $.Mustache.load('./templates/customer.html').done(function(){
          var content = $.Mustache.render('customers-view', doc);
            $('body').html(content);
             drawDropZone();
          	})
      });
     
  }

  function browseListOfCustomers(){

  	client.operation("Document.Query")
        .params({
          query: "select * from Customer where ecm:currentLifeCycleState != 'deleted'"
         
        })
        .execute(function(error, data) {
        
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