/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 /**
 * This file is used to automatically populate the network with Order assets and members
 * The opening section loads node modules required for this set of nodejs services
 * to work. This module also uses services created specifically for this tutorial, 
 * in the Z2B_Services.js.
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Bring Fabric SDK network class
const { FileSystemWallet, Gateway } = require('fabric-network');

// A wallet stores a collection of identities for use
let walletDir = path.join(path.dirname(require.main.filename),'controller/restapi/features/fabric/_idwallet');
const wallet = new FileSystemWallet(walletDir);

const ccpPath = path.resolve(__dirname, 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const financeCoID = 'easymoney@easymoneyinc.com';
const svc = require('./Z2B_Services');

/**
 * itemTable are used by the server to reduce load time requests
 * for member secrets and item information
 */
let itemTable = new Array();

/**
 * autoLoad reads the memberList.json file from the Startup folder and adds members,
 * executes the identity process, and then loads orders
 *
 * @param {express.req} req - the inbound request object from the client
 * @param {express.res} res - the outbound response object for communicating back to client
 * @param {express.next} next - an express service to enable post processing prior to responding to the client
 * saves a table of members and a table of items
 * @function
 */
exports.autoLoad = async function autoLoad(req, res, next) {

    console.log('autoload');

    // get the autoload file
    let newFile = path.join(path.dirname(require.main.filename),'startup','memberList.json');
    let startupFile = JSON.parse(fs.readFileSync(newFile));
    console.log(startupFile);        

    // Main try/catch block
    try {

        // A gateway defines the peers used to access Fabric networks
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'User1@org1.example.com', discovery: { enabled: false } });

        // Get addressability to network
        const network = await gateway.getNetwork('mychannel');

        // Get addressability to  contract
        const contract = await network.getContract('patent');
        console.log("get list of owners, verifiers, publishers");
        //get list of buyers, sellers, providers, shippers, financeCos
        const responseBuyer = await contract.evaluateTransaction('GetState', "owners");
        let owners = JSON.parse(JSON.parse(responseBuyer.toString()));
                
        const responseSeller = await contract.evaluateTransaction('GetState', "verifiers");
        let verifiers = JSON.parse(JSON.parse(responseSeller.toString()));
 
        const responseProvider = await contract.evaluateTransaction('GetState', "publishers");
        let publishers = JSON.parse(JSON.parse(responseProvider.toString()));
        console.log("done getting ow, ver, pub");
 

        //iterate through the list of members in the memberList.json file        
        for (let member of startupFile.members) {

            console.log('\nmember.id: ' + member.id);
            console.log('member.type: ' + member.type);
            console.log('member.industryName: ' + member.industryName);
            console.log('member.pw: ' + member.pw);

            var transaction = 'Register' + member.type;
            console.log('transaction: ' + transaction);            

            for (let owner of owners) { 
                if (owner == member.id) {
                    res.send({'error': 'member id already exists'});
                }
            }
            for (let verifier of verifiers) { 
                if (verifier == member.id) {
                    res.send({'error': 'member id already exists'});
                }
            }
            for (let publisher of publishers) { 
                if (publisher == member.id) {
                    res.send({'error': 'member id already exists'});
                }
            }
                        
            //register a buyer, seller, provider, shipper, financeCo
            const response = await contract.submitTransaction(transaction, member.id, member.industryName);
            console.log('transaction response: ')
            console.log(JSON.parse(response.toString()));  
                                            
            console.log('Next');                

        } 

        let allPatents = new Array();

        console.log('Get all patents'); 
        for (let owner of owners) { 
            const ownerResponse = await contract.evaluateTransaction('GetState', owner);
            var _ownerjsn = JSON.parse(JSON.parse(ownerResponse.toString()));       
            
            for (let patentNumber of _ownerjsn.patents) {                 
                allPatents.push(patentNumber);            
            }                           
        }

        console.log('Go through all patents'); 
        for (let patent of startupFile.assets) {

            console.log('\npatent.number: ' + patent.patentNumber);
            console.log('patent.patentName '+ patent.patentName)
            console.log('patent.priorArt: ' + patent.priorArt);
            console.log('patent.industry: ' + patent.industry);
            console.log('patent.details: ' + patent.details);
            console.log('patent.owner: ' + patent.owner);
            console.log('patent.verifier: ' + patent.verifier);
            
       

            for (let patentNumber of allPatents) { 
                if (patentNumber == patent.patentNumber) {
                    res.send({'error': 'patent already exists'});
                }
            }
            console.log("passed for");            

            const createPatentResponse = await contract.submitTransaction('CreatePatent',
            patent.owner, patent.verifier,patent.patentName, patent.patentNumber, patent.priorArt,
            patent.industry, patent.details);
            console.log('createPatentResponse: ');
            console.log(JSON.parse(createPatentResponse.toString()));

            console.log('Next');
                      
        }
        
        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        console.log('AutoLoad Complete');
        await gateway.disconnect();
        res.send({'result': 'Success'});

    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);
        res.send({'error': error.message});
    }

};

    

