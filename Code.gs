//basic function that builds the form using index.html as the template

var testFormId = "1C0882zYyilE7vCelgy47wIl3o_fAeIfXCuXhOE39-fw";

var staffChecklistId = "1pIXC9_202q1gl6InGSDpfrXaddvjG4Or0El1eYwW7CM";
var signinFormId = "1mxt8N1dVohK5alXzmTxQKnzOTioz_dwyxbc2MSgDwBU";
var iHelpedSomeoneId = "120F1E_ckvxBWKPNHS9Ia9mXSdRuefnEasR7zKqT1dSk";
var meritBadgeIconListId= "10Whhc_Ps_G7z5IqOHXezTQNdDPON6fNiC0i-VrgHKXc";
var swipeIdsId = "1DhFiBHIBKesnynMshf8ziKlFJUBb5CUyAR7BA_hpP3E";

var meritBadgeIconList = SpreadsheetApp
        .openById(meritBadgeIconListId);

var staffChecklist = SpreadsheetApp
        .openById(staffChecklistId);

var signIn = SpreadsheetApp
        .openById(signinFormId);

var iHelpedSomeone = SpreadsheetApp
        .openById(iHelpedSomeoneId);

var swipeIds = SpreadsheetApp
        .openById(swipeIdsId);


var MeritBadges = [
  'Laser Cutter',
  '3D Printing',	
  'Hand Tools',	
  'HandiBot',	
  'Power Tools',
  'Print Shop',	
  'Sewing Machine',
  'Embroidery Machine',	
  'Vinyl Cutter',
  'FormLabs',	
  'Soldering',
  'Arduino',
  'Button Maker',
  'Raspberry Pi'
];

  var staffToDoItems = {
  "Phone Number" : "Send your phone number to Maker Hub Manager.",
  "Staff Orientation" : "Do Staff/Volunteer Orientation.",
  "Headshot" : "Send Maker Hub Manager a headshot.",
  "Trello ID" : "Send Maker Hub Manager your Trello ID",
  "On Facebook Group" : "Join the Maker Hub Facebook Group https://www.facebook.com/groups/gumakerhub/ .",
  "Pic on Website" : "Make sure your picture is up on the website http://library.georgetown.edu/makerhub/community.",
  "Bio/MH Sentence" : "Send the Maker Hub Manager a Quote about why you love the Maker Hub :).",	
  "Quote on Website" : "Make Sure your quote is on the community section of our website, under your picture.",
  "Year, Major" : "Provide your year and major to Maker Hub Manager",
  "Available Hours" : "Fill out the 'Available Hours' spreadsheet",
  "shift on google calendar" : "Make sure the Maker Hub Manager has put your shift on the Google Calendar.",
  "On Share Drive" : "Make sure the Maker Hub Manager has shared the Maker Hub Google Drive folder with you.",
  "On Mailing List" : "Make sure the Maker Hub Manager has put you on his mailing list",
  "In Google Group" : "Join the Maker Hub google Group https://groups.google.com/forum/#!forum/maker-hub",
  "Signed Agreement" : "Sign the Staff Agreement to get your Keycode",
  "Assigned Keycode" : "Make sure the Maker Hub Manager has given you a keycode",
  "Added to Trello" : "Make sure the Maker Hub Manager has invited you to Trello",
  "Sent link re Minors" : "Make sure the Maker Hub Manager has sent you a link to sign the form re: Working with Minors",
  "Completed Minors form" : "Complete the Maker Hub form re Working with Minors",
  "WebCheckout Training" : "Do the Webcheckout Training",
  "WebCheckout User" : "Make sure the Maker Hub Manager adds you as a Webcheckout Users (Staff Only)"
  };


/*
var staffChecklistData = staffChecklist.getActiveSheet()
        .getDataRange()
        .getValues();

var signInFormData = signInForm.getActiveSheet()
        .getDataRange()
        .getValues();
*/


var parameter;

function doGet(e) {
  
  parameter = e.parameter;
  var page= e.parameter.page;
  if(!page){
    page = 'onepage';
  }
  
     return HtmlService
     .createTemplateFromFile(page)
    // .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
     .evaluate();
}


function writeForm(form) {
  try {  
    var distinguishedName = form.distinguishedName; //these match to the named fields in your form
    var moreDetails = form.moreDetails;
 
    var ss = SpreadsheetApp.openById(testFormId); //the ID of the spreadsheet you want to write to
    var sheet = ss.getActiveSheet();
    var newRow = sheet.getLastRow()+1;//go to the first blank row           
     
    //writes the form data to the spreadsheet
    var range = sheet.getRange(newRow, 1);    
    range.setValue(distinguishedName);
    range = sheet.getRange(newRow, 2);
    range.setValue(moreDetails);
     
   //an array of confirmation messages that will display as HTML 
    var confirmationMessage = ['<img src="http://bionicteaching.com/wp-content/uploads/2010/12/powerogskull.gif"><h2>A statement!</h2>', 
                               '<img src="http://bionicteaching.com/wp-content/uploads/2011/01/beachsomethingsomething.gif"><br><a href="https://pinboard.in">A Link</a>',
                               '<img src="https://c2.staticflickr.com/8/7486/27750752903_08b9a7daaa_s.jpg">'
                              ];
    var len = confirmationMessage.length-1;
    Logger.log('len= ' + len);
    var i = Math.floor(Math.random() * len);//randomizes from the array
     
    return confirmationMessage[i]; //displays randomized message
  } catch (error) {
     
    return error.toString();
  }
}


function dataIntoHashRows(data, keysRow, startRow, filterFunction){
  var idKey= {};
  var keyId= {};
  var newData = [];
  Logger.log("data");

  for (var k = 0; k < data[keysRow].length; k++) { 
    var key = data[keysRow][k];
    key = key.replace("?","");
    key = key.replace("'","");
    key = key.replace(":","");
    if(key.trim() == ""){
       continue;
    }
    
    idKey[k] = key;
    keyId[key] = k;
  }
    
  for (var i = startRow; i < data.length; i++) { 
    var newRow = {};
    for (var j = 0; j < data[i].length; j++) { 
      if(!idKey[j] || idKey[j].trim() == ""){
        continue; 
      }
      newRow[idKey[j]] = data[i][j];
    }
    if(!filterFunction || filterFunction(newRow) == true){
      newData.push(newRow);
    }
  }
  
  return {data:newData, keyId: keyId, idKey: idKey};
  
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function toReadableDate(dateString){
  // on March 3, 2017 15:00"
 var myDate = new Date(dateString);
  var dateString = myDate.getMonth() + 1 + "/" + myDate.getDate() + "/" + myDate.getYear() + " " + myDate.getHours() + ":" + myDate.getMinutes();
  return dateString;
}



function getStaffData(netId){
  var staffData = {foo:"va"};

  var allStaffData = staffChecklist
  .getActiveSheet()
  .getDataRange()
  .getValues();
  
  var allHelpData = iHelpedSomeone
  .getActiveSheet()
  .getDataRange()
  .getValues();

  var allSignInData = signIn
  .getActiveSheet()
  .getDataRange()
  .getValues();


  var checklistData = dataIntoHashRows(allStaffData, 1, 2, function(row){
    if(row["NetId"].match(new RegExp(netId, "i"))){
      return true;
    }
  return false;
  }); //, function(row){ return row['NetId'] == netId;}).data;
  checklistData.data = checklistData.data[0];
  
   var theirHelpData = dataIntoHashRows(allHelpData,0, 1, function(row){
     if(row["My NetID"].match(new RegExp(netId, "i"))){
      return true;
    }
   });

   checklistData.data["number of helps"] = theirHelpData.data.length;

   var theirSignInData = dataIntoHashRows(allSignInData,0, 1, function(row){
     if(row["Net ID"].toString().match(new RegExp(netId, "i"))){
      return true;
    }
   });
   
   theirSignInData.data = theirSignInData.data.sort(function(a,b){
     if(a['Timestamp'] > b['Timestamp']){
       return -1;
     }
     if(a['Timestamp'] < b['Timestamp']){
       return 1;
     }
     return 0;
   });
   checklistData.data["number of signins"] = theirSignInData.data.length;
   checklistData.data["last signin"] = JSON.parse(JSON.stringify(theirSignInData.data[0]));
   checklistData.data["first signin"] = JSON.parse(JSON.stringify(theirSignInData.data[theirSignInData.data.length - 1]));
 
   staffData.checklistData = JSON.parse(JSON.stringify(checklistData));
   staffData.helpData = JSON.parse(JSON.stringify(theirHelpData));
   staffData.signInData = JSON.parse(JSON.stringify(theirSignInData));
  
   return staffData;
}

function getStaffList(filter, sort){
  var stafflist = {};
  

    var allStaffData = staffChecklist
  .getActiveSheet()
  .getDataRange()
  .getValues();
 
  var checklistData = dataIntoHashRows(allStaffData, 1, 2); //, function(row){ return row['NetId'] == netId;}).data;  
  
  stafflist.checklistData = checklistData;
  
  return stafflist;
}


function getMeritBadgeIconList(filter, sort){

   var allmeritBadgeIconData = meritBadgeIconList
  .getActiveSheet()
  .getDataRange()
  .getValues();
 
  var meritbadgeiconlist = dataIntoHashRows(allmeritBadgeIconData, 0, 1).data; //, function(row){ return row['NetId'] == netId;}).data;  
  var meritBadgeIconHash = {};
  for (var i = 0; i < meritbadgeiconlist.length; i++){
   meritBadgeIconHash[meritbadgeiconlist[i]["Badge Name"]] = meritbadgeiconlist[i];
  }  
  var meritBadgeHash = {};
  for (var j = 0; j < MeritBadges.length; j++){
    if(meritBadgeIconHash[MeritBadges[j]]){
      meritBadgeHash[MeritBadges[j]] = meritBadgeIconHash[MeritBadges[j]];
    }else{
      meritBadgeHash[MeritBadges[j]] = {};
    }
  }
  return meritBadgeHash;
}


function getSwipeIds(filter, sort){

   var allSwipeIdData = swipeIds
  .getActiveSheet()
  .getDataRange()
  .getValues();
 
  var swipeIdList = dataIntoHashRows(allSwipeIdData, 0, 1).data; //, function(row){ return row['NetId'] == netId;}).data;  
  var swipeIdHash = {};
  for (var i = 0; i < swipeIdList.length; i++){
   swipeIdHash[swipeIdList[i]["SwipeID"]] = swipeIdList[i];
  }  
  return swipeIdHash;
}

function enterNewSwipeId(netid, swipeid){
  swipeIds.getActiveSheet().appendRow([netid, swipeid]);
  
  
}


function getTrelloCards(trelloID){
  var key = "1403bf837c0705e7cca69004b84c0cfc";
  var token = "73f9e12053f852e7dcf40480045bb4202fb5785dadfa1d481aa11f51df173272";
  var staffBoardID = "fnSAa2kH";
//  var trelloID = "donundeenwork";
  var urlauth = "key="+key+"&token="+token;
  var query = "board:"+staffBoardID+"+@"+trelloID+"+-list:OnHold+-list:WaitingToStart+-list:Done+is:open";
  var card_fields = "desc,name,shortUrl,ShortLink,url,idList";
//  var url = "https://api.trello.com/1/members/denny221/cards?"+urlauth;
  var url = "https://api.trello.com/1/search?query="+query+"&card_fields="+card_fields+"&"+urlauth;

  Logger.log("testing treoll"); 
  var responseJSON = UrlFetchApp.fetch(url);
  var trelloCards = JSON.parse(responseJSON);
  Logger.log(JSON.stringify(JSON.parse(responseJSON), null, "  "));
  return trelloCards;
  //https://api.trello.com/1/members/denny221/cards
}




function getStaffSchedules(){
  var calName = 'Maker Hub Staff and Volunteer Schedule';
  var calendars = CalendarApp.getCalendarsByName(calName);
  
  var staffSchedules = {};
  var staffCal = calendars[0];
  
  var now = new Date();
  var sevenDaysFromNow = new Date(now.getTime() + (7 * 60 * 60 * 1000 * 24));
  var eightHoursAgo = new Date(now.getTime() - (8 * 60 * 60 * 1000));
  var events = staffCal.getEvents(eightHoursAgo, sevenDaysFromNow);  
  
  for(var i = 0; i < events.length; i++){
    var guests = events[i].getGuestList(true);
    for(var j = 0; j < guests.length; j++){
      var guest = guests[j];
      var email  = guest.getEmail().toLowerCase();
      var eventDetails = {title: events[i].getTitle(),
                          startTime: events[i].getStartTime(),
                          endTime: events[i].getEndTime()
                         };
      if(!staffSchedules[email]){
        staffSchedules[email] = [];
      }
      staffSchedules[email].push(eventDetails);
    }    
  }
  return JSON.parse(JSON.stringify(staffSchedules));
}