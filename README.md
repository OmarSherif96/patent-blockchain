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
{
	"ownerId":"owner4@hsbc.com",
	"verifierId":"verifier3@nbe.com",
	"patentName":"New Patent",
	"patentNumber":"5",
	"patentIndustry":"New Industry",
	"priorArt":"no",
	"details":"This is a new Patent"

}

## Verify Patent 
1) Api Url http://localhost:6001/fabric/client/verifyPatent
2) Example body : 
{
	"patentNumber":"5",
	"verifierId":"verifier3@nbe.com",
	"publisherId":"publisher1@fgb.com",
	"status":"verified",
	"rejectionReason":""
	
}
3) Make sure you write the status "verified" 
4) Patent number, verifier ID & Publisher ID should already exists 
5) Rejection Reason make sure it exists in the JSON body however you can leave it as "" because by default it will be set to null if the patent is verified
### In case you want to reject the patent change the status to "rejected" and any reason you want
Example JSON Body to send 

{
	"patentNumber":"5",
	"verifierId":"verifier3@nbe.com",
	"publisherId":"publisher1@fgb.com",
	"status":"rejected",
	"rejectionReason":"Doesn't meet verification policy"
	
}











