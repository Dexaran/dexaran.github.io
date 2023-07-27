

      //var uri = 'https://api.myetherapi.com/rop';
    var uri = 'https://mewapi.epool.io';
    //var uri = 'https://api.gastracker.io/web3';
    var web3 = new Web3(new Web3.providers.HttpProvider(uri));
    var from = web3.eth.coinbase;
    var contractAddress = '0x2906797a0a56a0c60525245c01788ecd34063b80';
    var contract = web3.eth.contract(abiArray).at(contractAddress);
    var clockingFunc;
    var currentAccount="";
    var Name1;
    var accessGas=200000;
    var contractFunctions = [];
    var selectedFunction;


    window.onload = function() {

    }


    function DexFunc1() {
      $('#output-ECDNA').val("");
      $('#output-Address').val("");
      $('#output-Keccak-256').val("");
      
      var privToDecrypt = $('#ethgenpassword').val();
      var pubToDecrypt = ethUtil.privateToPublic(new Buffer(privToDecrypt, 'hex')).toString('hex');
      $('#output-ECDNA').val(pubToDecrypt);


      var keccak256OfPub = ethUtil.sha3(pubToDecrypt).toString('hex');
      $('#output-Keccak-256').val(keccak256OfPub);
      
      var addressFromEllypticCurve = ethUtil.publicToAddress(ethUtil.privateToPublic(new Buffer(privToDecrypt, 'hex'))).toString('hex');
      var addressToShow = "0x" + addressFromEllypticCurve;
      $('#output-Address').val(addressToShow);


    }

    function initiateNameContract() {
        $('#functionsDropdownList').html("");
        $('#readWriteContract').hide();
      var contractName = $("#customContractName").val();
          
      clearInterval(clockingFunc);
      clockingFunc = setInterval(function(){
        contract.getName(contractName, function(error, result){
          if(!error) {
                  clearInterval(clockingFunc);
                if((result[2][0]=="-") && (result[2][1]=="A") && (result[2][2]==" ")){
                  //alert(result[2]);
                  //$('#readWriteContract').show();
                  var AbiStr = String(result[2]).substring(3);
                  $('#tatAbi').val(AbiStr);
                  $('#customContractAddress').val(result[1]);
                  dropdownContract();
                }
                else {
          $('#contractAbiNameStatus').html('<p class="text-center text-danger"><strong> No valid ABI found! </strong></p>');
          $('#contractAbiStatus').html('<p class="text-center text-danger"><strong> No valid ABI found! </strong></p>');
                }
              }
      });
      }, 900);
    } 



    function generateContractCallTx() {

      if(currentAccount!="") {
        $('#currentAccountCheck').html("Your current account: " + currentAccount);
        $("#contractTxInfo").show();
        $("#tarawCallContractTx").val(getContractTxData());
      }
      else {
        $('#currentAccountCheck').html(`<p> You have no unlocked wallet to send transaction.</p><a id="send-transaction" class="ptabs" showId="paneSendTrans"> Unlock wallet first! </a>`);
      }
      //alert(rdataContractTx.raw);
     // alert(rdataContractTx.signed);


     /* web3.eth.sendRawTransaction(rdataContractTx.signed, function(err, result) {
        if(err) {
          alert(err);
       }
        else {

            var curFunc = selectedFunction;
            var types = [];
            for (var t in curFunc.outputs) {
                types.push(curFunc.outputs[t].type);
                //alert(types[t]);
            }
            //alert("RESULT:  " + result);
            //alert(types[1]);
            var parsedResult = String(result).substring(2);
            var decodedRes = ethUtil.solidityCoder.decodeParams(types, parsedResult);

            for (var i in curFunc.outputs) {
                //alert(decodedRes[i]);
                $('#output-'+i).val(decodedRes[i]);
            }
        }
      }); */ 
    }

    function sendContractTx() {

    $('#sendContractTxResult').html("");
    var addressNonce = web3.eth.getTransactionCount(currentAccount);

    var tmpValue1 = String(web3.toWei($('#etherToContract').val(), 'ether'));
    var nonce1 = padLeftEven(BNtoHex(new BigNumber(addressNonce)));
    var gasPrice1 = padLeftEven(BNtoHex(new BigNumber(0).plus(20000000000).toDigits(1))); 
    var gasLimit1 = padLeftEven(BNtoHex(new BigNumber($('#gasToContract').val())));
    var value1 = padLeftEven(BNtoHex(new BigNumber(tmpValue1)));

      var contractTxData = $('#tarawCallContractTx').val();
      var targetContract = $('#customContractAddress').val();

      var rawContractTx = {
      nonce: '0x'+nonce1,
      gasPrice: '0x'+gasPrice1,
      gasLimit: '0x'+gasLimit1,
      value: '0x' + value1,
      to: targetContract,
      data: contractTxData
    };

    var privateKey = new Buffer(PrivKey, 'hex');
    var contractTx = new Tx(rawContractTx);

    contractTx.sign(privateKey);

    var serializedContractTx = '0x' + contractTx.serialize().toString('hex');
      var rdataContractTx = {
        raw: JSON.stringify(contractTx),
        signed: serializedContractTx
      }
      web3.eth.sendRawTransaction(rdataContractTx.signed, function(err, result) {
        if(err) {
          alert(err);
       }
        else {
          $('#sendContractTxResult').html('<p class="text-center text-success"><strong> Transaction submitted. TX ID:  </strong><a href="http://gastracker.io/tx/'+ result + '">'+ result + '</a></p>');
        }
      });
    }



    function funcSelected(index) {
        $('#readContractBtnDiv').hide();
        $('#writeContractBtnDiv').hide();
        $("#contractTxInfo").hide();


        $('#divParam').html("");
        $('#divOutput').html("");



      var rawAbi = $('#tatAbi').val();
      selectedFunction = contractFunctions[index];
      
      //Readable function with no param inputs
      if (!(contractFunctions[index].inputs.length > 0)) {

        }
        else {

          var divParamStr="";
          divParamStr += String(`<h4>` + transformToFullName(selectedFunction) + ` </h4>`);
    
          for (var i in contractFunctions[index].inputs) {

           switch (contractFunctions[index].inputs[i].type) {
              case "uint256":
                divParamStr += String(`
                          <div class="col-sm-8">
          <p class="item write-unit256">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <input id="param-` +i+ `" class="form-control" type="text" placeholder="number (example: 12345)"/>
          </p>
        </div>`);
                break;
              case "bytes":
                divParamStr += String(`
                          <div class="col-sm-8">
          <p class="item write-bytes">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <input id="param-` +i+ `" class="form-control" type="text" placeholder="bytes (example: 1011011010101010)"/>
          </p>
        </div>`);
                break;
              case "string":
                divParamStr += String(`
                          <div class="col-sm-8">
          <p class="item write-string">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <input id="param-` +i+ `" class="form-control" type="text" placeholder="text (example: Type text here!)"/>
          </p>
        </div>`);
                break;
              case "bool":
                divParamStr += String(`
                          <div class="col-sm-8">
          <p class="item write-boolean">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <span class="radio"><label><input id="param-` +i+ `-true" type="radio" value="true" name="optradio-` +contractFunctions[index].inputs[i].name+ `">True</label></span>
            <span class="radio"><label><input id="param-` +i+ `-false" type="radio" value="false" name="optradio-` +contractFunctions[index].inputs[i].name+ `">False</label></span>
          </p>
        </div>`);
                break;
              case "address":
                divParamStr += String(`
                          <div class="col-sm-8">
          <p class="item write-address">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <input id="param-` +i+ `" class="form-control" type="text" placeholder="address (example: 0x01000b5fe61411c466b70631d7ff070187179bbf)"/>
          </p>
        </div>`);
                break;
              default:
                divOutputStr += String(`
                          <div class="col-sm-8 well">
          <p class="item write-bytes32">
            <label> ` +contractFunctions[index].inputs[i].name + ` </label>
            <input id="param-` +i+ `" class="form-control" type="text" placeholder="bytes (example: 0x001110101110100)"/>
          </p>
        </div>`);
                break;
          }
        }
      }



if (!(contractFunctions[index].outputs.length > 0) || (contractFunctions[index].constant!=true)) {
           // alert("Unreadable!");
        }
        //Function with param inputs
        else {
          //alert("Function with inputs");

          var divOutputStr="";
    
          for (var i in contractFunctions[index].outputs) {
            //alert(contractFunctions[index].inputs[i].type);

           switch (contractFunctions[index].outputs[i].type) {
              case "uint256":
                divOutputStr += String(`
                          <div class="col-sm-8 well">
          <p class="item read-unit256">
            <label style="font-size: 19px; font-family: monospace;"> ↳` +contractFunctions[index].outputs[i].name + ` </label>
            <input id="output-` +i+ `" class="form-control" type="text" readonly=""/>
          </p>
        </div>`);
                break;
              case "bytes":
                divOutputStr += String(`
                          <div class="col-sm-8 well">
          <p class="item read-bytes">
            <label style="font-size: 19px; font-family: monospace;"> ↳` +contractFunctions[index].outputs[i].name + ` </label>
            <input id="output-` +i+ `" class="form-control" type="text" readonly=""/>
          </p>
        </div>`);
                break;
              case "string":
                divOutputStr += String(`
                          <div class="col-sm-8 well">
          <p class="item read-string">
            <label style="font-size: 19px; font-family: monospace;"> ↳` +contractFunctions[index].outputs[i].name + ` </label>
            <input id="output-` +i+ `" class="form-control" type="text" readonly=""/>
          </p>
        </div>`);
                break;
              case "bool":
                divOutputStr += String(`
                          <div class="col-sm-8 well">
          <p class="item read-boolean">
            <label style="font-size: 19px; font-family: monospace;"> ↳` +contractFunctions[index].outputs[i].name + ` </label>
            <input id="output-` +i+ `" class="form-control" type="text" readonly=""/>
          </p>
        </div>`);
                break;
              case "address":
                divOutputStr += String(`
                          <div class="col-sm-8 well">
          <p class="item read-address">
            <label style="font-size: 19px; font-family: monospace;"> ↳` +contractFunctions[index].outputs[i].name + ` </label>
            <input id="output-` +i+ `" class="form-control" type="text" readonly=""/>
          </p>
        </div>`);
                break;
              default:
                divOutputStr += String(`
                          <div class="col-sm-8 well">
          <p class="item read-bytes32">
            <label style="font-size: 19px; font-family: monospace;"> ↳` +contractFunctions[index].outputs[i].name + ` </label>
            <input id="output-` +i+ `" class="form-control" type="text" readonly=""/>
          </p>
        </div>`);
                break;
          }
        }
      }

      if (contractFunctions[index].constant) {
        $('#readContractBtnDiv').show();
      }
      else {
        $('#writeContractBtnDiv').show();
      }
        $('#divParam').html(divParamStr);
        $('#divOutput').html(divOutputStr);
        //getContractTxData();
    }


    function readFromContract() {
      var msgCall = getContractTxData();
      var targetContract = $('#customContractAddress').val();

      var rawCallTx = {
      to: targetContract,
      data: msgCall
    };


   /* var privateKey = new Buffer(PrivKey, 'hex');

    txUpdate.sign(privateKey);

    var serializedRegTx = '0x' + txUpdate.serialize().toString('hex');
      var rdataUpdate = {
        raw: JSON.stringify(rawUpdatenameTx),
        signed: serializedRegTx
      } */
     web3.eth.call(rawCallTx, function(err, result) {
        if(err) {
          alert(err);
       }
        else {

            var curFunc = selectedFunction;
            var types = [];
            for (var t in curFunc.outputs) {
                types.push(curFunc.outputs[t].type);
                //alert(types[t]);
            }
            //alert("RESULT:  " + result);
            //alert(types[1]);
            var parsedResult = String(result).substring(2);
            var decodedRes = ethUtil.solidityCoder.decodeParams(types, parsedResult);

            for (var i in curFunc.outputs) {
                //alert(decodedRes[i]);
                $('#output-'+i).val(decodedRes[i]);
            }
        }
      }); 
    }



/*
    function readFromContract() {
        ajaxReq.getEthCall({ to: $scope.contract.address, data: $scope.getTxData() }, function (data) {
            if (!data.error) {
                var curFunc = $scope.contract.functions[$scope.contract.selectedFunc.index];
                var outTypes = curFunc.outputs.map(function (i) {
                    return i.type;
                });
                var decoded = ethUtil.solidityCoder.decodeParams(outTypes, data.data.replace('0x', ''));
                for (var i in decoded) {
                    if (decoded[i] instanceof BigNumber) curFunc.outputs[i].value = decoded[i].toFixed(0);else curFunc.outputs[i].value = decoded[i];
                }
            } else throw data.msg;
        });
    };

    }
*/

    function getContractTxData() {
        var curFunc = selectedFunction;
        var fullFuncName = transformToFullName(curFunc);
        var funcSig = getFunctionSignature(fullFuncName);

        var typeName = extractTypeName(fullFuncName);

        var types = typeName.split(',');
        types = types[0] == "" ? [] : types;
        var values = [];
        for (var i in curFunc.inputs) {
          if(curFunc.inputs[i].type == 'bool') {
            values.push($('#param-'+i+'-true').prop("checked"));
          }
          else {
            values.push($('#param-'+i).val());
          }
         // alert(types[i]);

             // alert(curFunc.inputs[i].value);
           /* if (curFunc.inputs[i].value) {
               // if (curFunc.inputs[i].type.indexOf('[') !== -1 && curFunc.inputs[i].type.indexOf(']') !== -1) values.push(curFunc.inputs[i].value.split(','));else values.push(curFunc.inputs[i].value);
            } else values.push(''); */
        }
        var result = "0x";
        result += funcSig;
        result += ethUtil.solidityCoder.encodeParams(types, values);
        //alert(1);
        //var decodedRes = ethUtil.solidityCoder.decodeParams(types, ethUtil.solidityCoder.encodeParams(types, values));
        //alert(decodedRes);
        return result;
    }




    function dropdownContract() {

      var tmpStr = "";
      var rawAbi = $('#tatAbi').val();
      try {
        $('#contractAbiStatus').html(" ");
        $('#contractAbiNameStatus').html(" ");

        var tAbi = JSON.parse($('#tatAbi').val());
        contractFunctions = [];
        for (var i in tAbi) if (tAbi[i].type == "function") {
          contractFunctions.push(tAbi[i]);
        }
        for (var i in contractFunctions) {
          contractFunctions[i].name;
          tmpStr += '<li ><a class="active" id="li' +contractFunctions[i].name+ '" onclick="funcSelected('+ i +')">' +contractFunctions[i].name+ '</a></li>';
        }
        $('#functionsDropdownList').html(tmpStr);
        $('#readWriteContract').show();
          $('#contractAbiStatus').html('<p class="text-center text-success"><strong> ABI is valid </strong></p>');

          $('#contractAbiNameStatus').html('<p class="text-center text-success"><strong> ABI is valid </strong></p>');
            //$scope.showReadWrite = true;
        } catch (e) {
          $('#readWriteContract').hide();
          $('#contractAbiNameStatus').html('<p class="text-center text-danger"><strong> No valid ABI found! </strong>'+ '<small><br>'+ e +'</small></p>');
          $('#contractAbiStatus').html('<p class="text-center text-danger"><strong> No valid ABI found! </strong>'+ '<small><br>'+ e +'</small></p>');
        }
    }

    function initContract() {
      var rawAbi = $('#tatAbi').val();
      try {
        var tAbi = JSON.parse($('#tatAbi').val());
       // alert(tAbi[4].type);
        contractFunctions = [];
        for (var i in tAbi) if (tAbi[i].type == "function") {
          contractFunctions.push(tAbi[i]);
        }

         // alert(contractFunctions.length);


            //$scope.showReadWrite = true;
        } catch (e) {
            alert(e);
        }
    };







    function dexUpdateName() {
        $("#divUpdateNameValues").show();
        $("#updatenamestatus").hide();
      $("#tarawtxUpdateName").hide();
    }

    function dexUpdateNameSubmit() {

    var addressFrom = $("#accountAddress").html();
    var addressNonce = web3.eth.getTransactionCount(addressFrom);

    var nonce1 = padLeftEven(BNtoHex(new BigNumber(addressNonce)));
    var gasPrice1 = padLeftEven(BNtoHex(new BigNumber(0).plus(20000000000).toDigits(1))); 
    var gasLimit1 = padLeftEven(BNtoHex(new BigNumber(accessGas)));

    var callName = $('#nametoupdatetxt').val();
    var callAddress = $('#updatenameaddress').val();
    var callValue = $('#updatenamevalue').val();



    var dexCallData = contract.updateName.getData(callName, callAddress, callValue);

    var rawUpdatenameTx = {
      nonce: '0x'+nonce1,
      gasPrice: '0x'+gasPrice1,
      gasLimit: '0x'+gasLimit1,
      to: contractAddress,
      value: '0x0',
      data: dexCallData
    };


    var privateKey = new Buffer(PrivKey, 'hex');
    var txUpdate = new Tx(rawUpdatenameTx);

    txUpdate.sign(privateKey);

    var serializedRegTx = '0x' + txUpdate.serialize().toString('hex');
      var rdataUpdate = {
        raw: JSON.stringify(rawUpdatenameTx),
        signed: serializedRegTx
      }


      $("#tarawtxUpdateName").val(rdataUpdate.raw);
      $("#tarawtxUpdateName").show();
      $("#updatenamestatus").show();
      web3.eth.sendRawTransaction(rdataUpdate.signed, function(err, result) {
        if(err) {
 $("#nameUpdateTxStatus").html('<p class="text-center text-success"><strong> ERROR:  ' +err +'</strong></p>');
       }
        else {
          $("#nameUpdateTxStatus").html('<p class="text-center text-success"><strong> Transaction submitted. TX ID:  </strong><a href="http://gastracker.io/tx/'+ result + '">'+ result + '</a></p>');
        }
      });
    }

    function onRegisterNameKeyUp() {
        $("#divregNameCosts").hide();
    }

    function onUpdateNameKeyUp() {
        $("#divUpdateNameValues").hide();
    }

    function dexRegName() {
      var currentBlockNumber = web3.eth.blockNumber;
      //var nameregCost = contract.getName($('#newnameregister').val());
      var askName = contract.getName($('#newnameregister').val());
      //if((askName[0]!=0x0) || (askName[1]!=0x0)) {

      if((askName[3]>currentBlockNumber) || (askName[2]=="-avoid")) {
        $('#nameregvalidate').html('<p class="text-danger"><strong> Can not register this name </strong></p>').fadeIn(1000);
        $('#nameregvalidate').html('<p class="text-danger"><strong> Can not register this name </strong></p>').fadeOut(1500);
      } else {
        $('#nameregvalidate').html('<p class="text-success"><strong> Name is available </strong></p>').fadeIn(1000);
        $('#nameregvalidate').html('<p class="text-success"><strong> Name is available </strong></p>').fadeOut(2000);
      $("#divregNameCosts").show();
    }
    }

    function dexRegNameSubmit() {

    var addressFrom = $("#accountAddress").html();
    var addressNonce = web3.eth.getTransactionCount(addressFrom);

    var nonce1 = padLeftEven(BNtoHex(new BigNumber(addressNonce)));
    var gasPrice1 = padLeftEven(BNtoHex(new BigNumber(0).plus(20000000000).toDigits(1))); 
    var gasLimit1 = padLeftEven(BNtoHex(new BigNumber(210000)));

    var dexCallData = contract.registerName.getData($('#newnameregister').val());
    var rawRegnameTx = {
      nonce: '0x'+nonce1,
      gasPrice: '0x'+gasPrice1,
      gasLimit: '0x'+gasLimit1,
      to: contractAddress,
      value: '0x0',
      data: dexCallData
    };


    var privateKey = new Buffer(PrivKey, 'hex');
    var txReg = new Tx(rawRegnameTx);

    txReg.sign(privateKey);

    var serializedRegTx = '0x' + txReg.serialize().toString('hex');
      var rdataReg = {
        raw: JSON.stringify(rawRegnameTx),
        signed: serializedRegTx
      }

      web3.eth.sendRawTransaction(rdataReg.signed, function(err, result) {
        if(err) {
 $("#regnamestatus").html('<p class="text-center text-success"><strong> ERROR:  ' +err +'</strong></p>');
       }
        else {
          $("#regnamestatus").html('<p class="text-center text-success"><strong> Transaction submitted. TX ID:  </strong><a href="http://gastracker.io/tx/'+ result + '">'+ result + '</a></p>');
        }
      });
    }

    function dexGenTx() {

try{

    if (PrivKey.length != 64) throw "Invalid Private key, try again";
    if (!$.isNumeric($('#sendtxamount').val()) || $('#sendtxamount').val() <= 0) throw "Invalid amount, try again";
        var uri = 'https://mewapi.epool.io';
    //var uri = 'https://api.gastracker.io/web3';
    var web3 = new Web3(new Web3.providers.HttpProvider(uri));
        $("#tarawtx").val("");
        $("#tasignedtx").val("");
        $("#txsendstatus").html('')

    var toAddress = $('#sendtxaddress').val();
    var sendToName = contract.getName(toAddress);
    if (validateEtherAddress(toAddress)) {

      $("#tareceiver").val('You are sending: '+ $('#sendtxamount').val() +' Ether\nTo: '+ $('#sendtxaddress').val());
    } else {

     toAddress=sendToName[1];
     $("#tareceiver").val('You are sending: '+ $('#sendtxamount').val() +' Ether\nTo: "'+ $('#sendtxaddress').val() +'" \nAddress: '+ toAddress);
    }

    if (!validateEtherAddress(toAddress)) throw "Invalid to Address, try again";
    var addressFrom = $("#accountAddress").html();
    var addressNonce = web3.eth.getTransactionCount(addressFrom);

    var nonce = padLeftEven(BNtoHex(new BigNumber(addressNonce)));

    var tmpValue = String(web3.toWei($('#sendtxamount').val(), 'ether'));

    var gasPrice = padLeftEven(BNtoHex(new BigNumber(0).plus(20000000000).toDigits(1))); 
    var gasLimit = padLeftEven(BNtoHex(new BigNumber(22000))); 
    var value = padLeftEven(BNtoHex(new BigNumber(tmpValue)));

    var rawTx = {
      nonce: '0x'+nonce,
      gasPrice: '0x'+gasPrice,
      gasLimit: '0x'+gasLimit,
      to: toAddress,
      value: '0x'+value,
      data: ''
    };
    var privateKey = new Buffer(PrivKey, 'hex');
    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = '0x' + tx.serialize().toString('hex');
      var rdata = {
        raw: JSON.stringify(rawTx),
        signed: serializedTx
      }

      $("#tarawtx").val(rdata.raw);
      $("#tasignedtx").val(rdata.signed);
      $("#divtransactionTAs").show();
      $("#divsendtranaction").show();
      
      $("#confirmAmount").html($('#sendtxamount').val());
      $("#confirmAddress").html(toAddress);
}
   catch (err) {
    $("#txcreatestatus").html('<p class="text-center text-danger"><strong> ' + err + '</strong></p>').fadeIn(50).fadeOut(3000);
    $("#divtransactionTAs").hide();
    $("#divsendtranaction").hide();
  }
  }


    function dexSendTx() {
        web3.eth.sendRawTransaction($("#tasignedtx").val(), function(err, result) {
        $("#txsendstatus").html('<p class="text-center text-success"><strong> Transaction submitted. TX ID:  </strong><a href="http://gastracker.io/tx/'+ result + '">'+ result + '</a></p>');
      });
  }

    function dexGetBalance() {
    var uri = 'https://mewapi.epool.io';
    //var uri = 'https://api.gastracker.io/web3';
    var web3 = new Web3(new Web3.providers.HttpProvider(uri));
    var originalBalance = $("#accountAddress").html();
    web3.eth.getBalance(originalBalance, function(err, result){
                            document.getElementById('accountBalance').innerText = String(web3.fromWei(result, 'ether')) + ' ETC';
                    });
    }

    function onNameKeyUp() {

      var Name = document.getElementById('searchname').value;
          
      clearInterval(clockingFunc);
      clockingFunc = setInterval(function(){
        contract.getName(Name, function(error, result){
          if(!error)
                
                $("#ownerOfId").val(result[0]);
                $("#addressOfId").val(result[1]);
                $("#valueOfId").val(result[2]);
                $("#endblockOfId").val(result[3]);
                //$("#signature").val(result[4]); //NOT YET SUPPORTED BY CONTRACT
                /*
              document.getElementById('ownerOfId').value = result[0];
              document.getElementById('addressOfId').value = result[1];
              document.getElementById('valueOfId').value = result[2];
              document.getElementById('endblockOfId').value = result[3];
              */
          //else
              //console.error(error);
      });
      }, 900);
}

    function onAddressKeyUp() {
      //alert("executed!");
      Name1 = $('#sendtxaddress').val();

      $("#linkstrstatus").hide();
      clearInterval(clockingFunc);
      clockingFunc = setInterval(function(){

        if(!validateEtherAddress(Name1)){
        contract.getName(Name1, function(error, result){
          if(!error)
            if(validateEtherAddress(result[1]) && (result[1]!=0x0) && (Name1!="")){
              $('#addressvalidate').html('<p class="text-success"><strong> Valid address: ' + result[1] +'</strong></p>');
              if((result[2][0]=='-') && (result[2][1]=='L') && (result[2][2]==' ')) {
                var linkStr = String(result[2]).substring(3);
                $("#linkstrstatus").show();
                $("#linkstrstatus").html('<a href="'+ linkStr + '">'+ linkStr + '</a>');
              }

            }
            else {
              $('#addressvalidate').html('<p class="text-danger"><strong> Invalid address </strong></p>');
            }
      });
      }
      else {
        $('#addressvalidate').html('<p class="text-success"><strong> Valid address. </strong></p>');
      }


      }, 1000);
      
    }
    
