var propertiesInfo = {
 "dc:title":{"propertyId":"dc:title","cardinality":"mono", "propertyType":"string", "formId":"dc_title","editControl":"input"},
"nsi:industry":{"propertyId":"nsi:industry","cardinality":"mono", "propertyType":"string", "formId":"nsi_industry","editControl":"select","options":{"vocabulary":"industries"}},
"dc:modified":{"propertyId":"dc:modified", "cardinality":"mono","propertyType":"date","formId":"dc_modified","editControl":"calendar"},
"nsi:customer_business":{"propertyId":"nsi:customer_business", "cardinality":"mono","propertyType":"string","formId":"nsi_customer_business","editControl":"textarea"},
"nsi:sales_rep":{"propertyId":"nsi:sales_rep", "cardinality":"mono","propertyType":"string","formId":"nsi_sale_rep","editControl":"input"},
"nsi:customer_since":{"propertyId":"nsi:customer_since", "cardinality":"mono","propertyType":"date","formId":"nsi_customer_since","editControl":"calendar"},
"nsi:sales_history":{"propertyId":"nsi:sales_history", "cardinality":"mono","propertyType":"string","formId":"nsi_sales_history","editControl":"textarea"},
 "nsi:success_factors":{"propertyId":"nsi:success_factors", "cardinality":"multiple","propertyType":"string","formId":"nsi_success_factors","editControl":"textarea"},
"nsi:competitors":{"propertyId":"nsi:competitors", "cardinality":"multiple","propertyType":"string","formId":"nsi_competitors","editControl":"selectMultiple", "options":{"vocabulary":"competitions"}},
"nsi:competitors_comment":{"propertyId":"nsi:competitors_comment", "cardinality":"mono","propertyType":"string","formId":"nsi_competitors_comment","editControl":"textarea"},
};



var currentCustomer;

function getVocabularyData(directoryName, callback){

 client.operation("Directory.Entries").params({"directoryName":directoryName}).execute(function(error,data){ callback(data)});

}

function getBinary(docId, callback){
  client.operation("Blob.Get").params({"xpath":"npi:screenshot1"}).input("doc:"+docId).execute(function(error,data,jqxhr) {callback(data,jqxhr);

  });
  
}

function drawDropZone(zoneId, message){

var myDropzoneScreenshot1 = new Dropzone(zoneId, {url:"#",createImageThumbnails:true, addRemoveLinks:true,maxFiles:1,accept:function (file, done) {
      importOp = client.operation('Blob.Attach').params({
        document : currentDocId,
        save : 'true',
        xpath : 'npi:screenshot1'
      })                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
      importOp.uploader().uploadFile(file,null);
      importOp.uploader().execute(function(error, data){});
  
  },
init: function() {
    this.on("maxfilesexceeded", function(file){
        alert("No more files please!");
    })},dictDefaultMessage:message


});


  
  
}

function switchToEdit(propertyId,value){
  var templateData ={};
templateData["fieldValue"]= value;
widgetType=propertiesInfo[propertyId]["editControl"];
formFieldId=propertiesInfo[propertyId]["formId"];
  if (widgetType=="select"||widgetType=="selectMultiple") {
    var vocabularyEntries={};
   
   getVocabularyData(propertiesInfo[propertyId]["options"]["vocabulary"],function (data){
   templateData['vocabularyEntries']= data;
  var formField = $.Mustache.render('editField-'+formFieldId, templateData);
  $('#formField-'+formFieldId).html(formField);

 }); 

 }else{
var formField = $.Mustache.render('editField-'+formFieldId, templateData);
  $('#formField-'+formFieldId).html(formField);
  }
    
}


function switchRead(currentField,field, propertyId){

  injectedValue=currentField.value;
  if(propertyId=="nsi:competitors"){
    injectedValue=[];
  for (x=0;x<currentField.length;x++){
     if(currentField[x].selected){injectedValue.push(currentField[x].value);


     }
  }}  
  console.log(injectedValue);

  var formField = $.Mustache.render('displayList', injectedValue);

            $('#formField-'+field).html(formField);
            updateDocumentProperty(currentCustomer, propertyId, injectedValue);
  }

 function base64Encode(inputStr) 
            {
               var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
               var outputStr = "";
               var i = 0;
               
               while (i < inputStr.length)
               {
                   //all three "& 0xff" added below are there to fix a known bug 
                   //with bytes returned by xhr.responseText
                   var byte1 = inputStr.charCodeAt(i++) & 0xff;
                   var byte2 = inputStr.charCodeAt(i++) & 0xff;
                   var byte3 = inputStr.charCodeAt(i++) & 0xff;
            
                   var enc1 = byte1 >> 2;
                   var enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
                   
                   var enc3, enc4;
                   if (isNaN(byte2))
                   {
                       enc3 = enc4 = 64;
                   }
                   else
                   {
                       enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
                       if (isNaN(byte3))
                       {
                           enc4 = 64;
                       }
                       else
                       {
                           enc4 = byte3 & 63;
                       }
                   }
            
                   outputStr += b64.charAt(enc1) + b64.charAt(enc2) + b64.charAt(enc3) + b64.charAt(enc4);
                } 
               
                return outputStr;
            }


//main functions
var currentDocId;
function browseCustomer(customerId){
   $.Mustache.clear();
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
            var test = document.getElementById("image");
        

      // getBinary(customerId, function (data,jqxhr) {console.log(jqxhr);test.src = "data:image/jpg;base64,"+Base64.encode(jqxhr.response) ;});
      // getBinary(customerId, function (data) {console.log(base64Encode(data));test.src = "http://www.location-voitures-de-luxe.com/images/commun/location-voiture.jpg"});
             drawDropZone("#droparea-screenshot1","Insert here a screenshot of the customer's app");
              drawDropZone("#droparea-screenshot2","Insert here a second screenshot of the customer's app");
          	})
      });

       
      
     
     
  }

  function listProperties(obj) {
   var propList = "";
   for(var propName in obj) {
      if(typeof(obj[propName]) != "undefined") {
         propList += (propName + ", ");
      }
   }
   
}


  function browseListOfCustomers(){
   $.Mustache.clear();

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