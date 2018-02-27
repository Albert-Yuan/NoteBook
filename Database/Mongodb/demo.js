db.xxx.group({
 key:{dioutDate:true,tenantNum:true},
 cond:{tenantNum:'xxx',dioutDate:'2017-12-14',skillGroupName:'xxx'},
 reduce:function(obj,prev){
  prev.totalSum += obj.statusDuration;
  if(obj.phoneStatus == 'READY'){
   prev.readySum += obj.statusDuration;
  };
  if(obj.phoneStatus == 'PAUSE_CALLING'){
   prev.pauseSum += obj.statusDuration;
  };
  if(obj.phoneStatus == 'UNREADY'){
   prev.unreadySum += obj.statusDuration;
  };
  if(obj.phoneStatus == 'CALL_AFTER'){
   prev.afterSum += obj.statusDuration;
  };
  
  if(obj.phoneStatus == 'CALLING'){
   prev.dioutCount++;
  };
  
  if(obj.phoneStatus == 'ACCEPT_CALLING'){
   prev.connectCount++;
  };
  
  if(obj.phoneStatus == 'ACCEPT_CALLING' && obj.callCategory == 2){
    prev.callOutSum += obj.statusDuration;
    prev.callOutConnectCount +=1;
  }
  
   if(obj.phoneStatus == 'ACCEPT_CALLING' && obj.callCategory == 1){
    prev.incomingCallSum += obj.statusDuration;
    prev.incomingCallConnectCount += 1;
  }
  
  if(obj.phoneStatus == 'ACCEPT_CALLING' && obj.callCategory == 3){
    prev.callOutForecastSum += obj.statusDuration;
    prev.callOutForecastConnectCount +=1;
  }
  
  if(obj.phoneStatus == 'SCREEN_POP' && obj.callCategory == 1){
    prev.incomingCallCount += 1;
  }
  
  
  if(obj.phoneStatus == 'ACCEPT_CALLING' && obj.callCategory == 2){
    prev.callOutForecastCount += 1;
  }
  
  prev.dioutDate = obj.dioutDate;
  prev.tenantNum  = obj.tenantNum;
  prev.tenantName = obj.tenantName;
  prev.skillGroupName = obj.skillGroupName;
 },
 initial:{totalSum:0,readySum:0,pauseSum:0,unreadySum:0,afterSum:0,dioutDate:'',tenantNum:'',tenantName:'',
 skillGroupName:'',dioutCount:0,connectCount:0,count:0,callOutSum:0,incomingCallSum:0,callOutForecastSum:0,
 incomingCallCount:0,callOutForecastCount:0,callOutConnectCount:0,incomingCallConnectCount:0,callOutForecastConnectCount:0},
 finalize:function(result){
   result.count = result.count + 1;
 }
}); 
