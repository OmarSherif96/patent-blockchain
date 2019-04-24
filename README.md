## Steps to run the project 

# Installing softwares 

1) Install VSCode
2) Install IBM Blockchain Extension Platform
3) Install node version >=8
4) Install npm version >=5
5) Postman

# Packaging and installing your chaincode
1) Open "contract" folder from the project using vscode
2) Open IBM blockchain extension
3) Package the smart contract
4) Install chaincode on your peer
5) Instantiate the chaincode on the channel
6) Enter optional function "instantiate" 
7) Skip arguments options by pressing enter

# Running the project
1) In your terminal go to patent-blockchain/web-app
2) write npm install
3) write npm start , the application is running on port 6001


# Populating your blockchain with dummy data 
1) Open any browser localhost:6001/
2) You will find Admin tab in the topbar then select "preload network"
3) You should receieve "Autoload Successful" on your browser

# Calling apis from postman
## Get Blockchain
1) Open postman and copy this in the url section http://localhost:6001/fabric/getBlockchain , this should return the history of transactions and gets updated after every new transaction

## Create Patent
1) Write this url in postman http://localhost:6001/fabric/client/createPatent
2) Write this in the body to create a patent,
   make sure the owner and verifier IDs already exists in the blockchain
   <br />
{
	"ownerId":"owner4@hsbc.com",<br />
	"verifierId":"verifier3@nbe.com",<br />
	"patentName":"New Patent",<br />
	"patentNumber":"5",<br />
	"patentIndustry":"New Industry",<br />
	"priorArt":"no",<br />
	"details":"This is a new Patent"<br />

}

## Verify Patent 
1) Api Url http://localhost:6001/fabric/client/verifyPatent
2) Example body : <br />
{
	"patentNumber":"5",<br />
	"verifierId":"verifier3@nbe.com",<br />
	"publisherId":"publisher1@fgb.com",<br />
	"status":"verified",<br />
	"rejectionReason":""<br />
	
}<br />

3) Make sure you write the status "verified" 
4) Patent number, verifier ID & Publisher ID should already exists 
5) Rejection Reason make sure it exists in the JSON body however you can leave it as "" because by default it will be set to null if the patent is verified
### In case you want to reject the patent change the status to "rejected" and any  rejection reason you want
Example JSON Body to send <br />

{
	"patentNumber":"5",<br />
	"verifierId":"verifier3@nbe.com",<br />
	"publisherId":"publisher1@fgb.com",<br />
	"status":"rejected",<br />
	"rejectionReason":"Doesn't meet verification policy"<br />
	
}

## Publish patent
1) 1) Api Url http://localhost:6001/fabric/client/publishPatent
2) Example body : <br />
{
	"patentNumber":"5",<br />
	"publisherId":"publisher1@fgb.com",<br />
	"verifierId":"verifier3@nbe.com",<br />
	"rejectionReason":"",<br />
	"status":"published",<br />
	"date":"23/1/2019",<br />
	"price":"10"
}<br />

3) Make sure to make status "published" and enter patent number, verifier ID & publisher ID that exist
4) you can enter the date & price you want
5) Rejection Reason make sure it exists in the JSON body however you can leave it as "" because by default it will be set to null if the patent is published
### In case you want to reject the patent change the status to "rejected" and any  rejection reason you want
Example JSON Body to send <br />

{
	"patentNumber":"5",<br />
	"publisherId":"publisher1@fgb.com",<br />
	"verifierId":"verifier3@nbe.com",<br />
	"rejectionReason":"Doesn't meet publish requirements",<br />
	"status":"rejected",<br />
	"date":"",<br />
	"price":""
	
}<br />
1) Make sure status is "rejected"
2) Make sure date and price exists in the JSON body however you can leave it "" or any message because by default they will be set to null










