

const {Contract} = require('fabric-contract-api');

const patentStatus = {
    Created: {code: 1, text: 'Patent Request Created'},
    Verified: {code: 2, text: 'Patent Request Verified'},
    Rejected: {code: 3, text: 'Patent Request Rejected'},
    Audited: {code: 4, text: 'Patent Request Audited'},
    Published: {code: 5, text: 'Patent Request Published'}
}

class Patent extends Contract {

    async instantiate(ctx){
        let owners=[]
        let verifiers=[]
        let publishers=[]
        let auditors=[]
        let patents=[]
        await ctx.stub.putState('patents',Buffer.from(JSON.stringify(patents)));
        await ctx.stub.putState('owners',Buffer.from(JSON.stringify(owners)));
        await ctx.stub.putState('verifiers',Buffer.from(JSON.stringify(verifiers)));
        await ctx.stub.putState('publishers',Buffer.from(JSON.stringify(publishers)));
        await ctx.stub.putState('auditors',Buffer.from(JSON.stringify(auditors)));

    }

    async RegisterOwner(ctx,ownerId,industryName){
        let owner = {
            id: ownerId,
            type: 'owner',
            industryName: industryName,
            patents: [],
        }
        await ctx.stub.putState(ownerId, Buffer.from(JSON.stringify(owner)));
        //add ownerID to 'owners' key
        let data = await ctx.stub.getState('owners');
        if (data) {
            let owners = JSON.parse(data.toString());
            owners.push(ownerId);
            await ctx.stub.putState('owners', Buffer.from(JSON.stringify(owners)));
        } else {
            throw new Error('owners not found');
        }

        // return owner object
        return JSON.stringify(owner);
    }
    
    async RegisterVerifier(ctx,verifierId,industryName){
        let verifier = {
        id: verifierId,
        type: 'verifier',
        industryName: industryName,
        patents: [],
        }
        await ctx.stub.putState(verifierId, Buffer.from(JSON.stringify(verifier)));
        //add verifierId to 'verifiers' key
        let data = await ctx.stub.getState('verifiers');
        if (data) {
        let verifiers = JSON.parse(data.toString());
        verifiers.push(verifierId);
        await ctx.stub.putState('verifiers', Buffer.from(JSON.stringify(verifiers)));
        } else {
        throw new Error('verifiers not found');
        }
        
        // return verifier object
        return JSON.stringify(verifier);
        }

    async RegisterPublisher(ctx,publisherId,industryName){
        let publisher = {
        id: publisherId,
        type: 'publisher',
        industryName: industryName,
        patents: [],
        }
        await ctx.stub.putState(publisherId, Buffer.from(JSON.stringify(publisher)));
        //add publisherId to 'publishers' key
        let data = await ctx.stub.getState('publishers');
        if (data) {
        let publishers = JSON.parse(data.toString());
        publishers.push(publisherId);
        await ctx.stub.putState('publishers', Buffer.from(JSON.stringify(publishers)));
        } else {
        throw new Error('publishers not found');
        }
        
        // return publisher object
        return JSON.stringify(publisher);
        }

    async RegisterAuditor(ctx,auditorId,industryName){
        let auditor = {
        id: auditorId,
        type: 'auditor',
        industryName: industryName,
        patents: [],
        }
        await ctx.stub.putState(auditorId, Buffer.from(JSON.stringify(auditor)));
        //add auditorID to 'auditors' key
        let data = await ctx.stub.getState('auditors');
        if (data) {
        let auditors = JSON.parse(data.toString());
        auditors.push(auditorId);
        await ctx.stub.putState('auditors', Buffer.from(JSON.stringify(auditors)));
        } else {
        throw new Error('auditors not found');
        }
        
        // return auditor object
        return JSON.stringify(auditor);
        }    
        
    async CreatePatent(ctx,ownerId,verifierId,patentName,patentNumber,patentIndustry,priorArt,details){
        
        
        let ownerData = await ctx.stub.getState(ownerId);
        let owner;
        if (ownerData) {
        owner= JSON.parse(ownerData.toString());
        if (owner.type !== 'owner') {
        throw new Error('owner not identified');
        }
        } else {
        throw new Error('owner not found');
        }
        

        let verifierData = await ctx.stub.getState(verifierId);
        let verifier;
        if (verifierData) {
        verifier= JSON.parse(verifierData.toString());
        if (verifier.type !== 'verifier') {
        throw new Error('verifier not identified');
        }
        } else {
        throw new Error('verifier not found');
        }

        let patent = {
            ownerId:ownerId,
            verifierId:verifierId,
            publisherId:null,
            patentName:patentName,
            patentNumber:patentNumber,
            patentIndustry:patentIndustry,
            priorArt:priorArt,
            details:details,
            rejectionReason:null,
            price:null,
            publishDate:null,
            status:JSON.stringify(patentStatus.Created),
            
        }

        
        owner.patents.push(patentNumber);
        await ctx.stub.putState(ownerId, Buffer.from(JSON.stringify(owner)));
        

        
        verifier.patents.push(patentNumber);
        await ctx.stub.putState(verifierId, Buffer.from(JSON.stringify(verifier)));
        
        

        await ctx.stub.putState(patentNumber, Buffer.from(JSON.stringify(patent)));

        return JSON.stringify(patent);
    }  
    async VerifyPatent(ctx,patentNumber,verifierId,publisherId,status,rejectionReason){

        //Get data json
        let data = await ctx.stub.getState(patentNumber);
        let patent;
        if (data) {
            patent = JSON.parse(data.toString());
        } else {
            throw new Error('patent not found');
        }

       
        
        let verifierData = await ctx.stub.getState(verifierId);
        let verifier;
        if (verifierData) {
        verifier = JSON.parse(verifierData.toString());
        if (verifier.type !== 'verifier') {
        throw new Error('verifier not identified');
        }
        } else {
        throw new Error('verifier not found');
        }

        let publisherData = await ctx.stub.getState(publisherId);
        let publisher;
        if (publisherData) {
            publisher = JSON.parse(publisherData.toString());
        if (publisher.type !== 'publisher') {
        throw new Error('publisher not identified');
        }
        } else {
        throw new Error('publisher not found');
        }


        if (status === "verified") {
        //set patent status and add publisher ID to patent   
        patent.status = JSON.stringify(patentStatus.Verified);
        rejectionReason=null;
        patent.rejectionReason = rejectionReason;
        patent.publisherId = JSON.stringify(publisherId)
        await ctx.stub.putState(patentNumber, Buffer.from(JSON.stringify(patent)));

        
        
        //add patent to publisher
        publisher.patents.push(patentNumber);
        await ctx.stub.putState(publisherId, Buffer.from(JSON.stringify(publisher)));
        
        //remove patent from verifier
        let index = verifier.patents.indexOf(patentNumber)
        if (index > -1) {
            verifier.patents.splice(index,1)
         }
        await ctx.stub.putState(verifierId, Buffer.from(JSON.stringify(verifier)));

        return JSON.stringify(patent);
        } 
        else if(status ==="rejected"){
        patent.status = JSON.stringify(patentStatus.Rejected);
        patent.rejectionReason = JSON.stringify(rejectionReason)
        await ctx.stub.putState(patentNumber, Buffer.from(JSON.stringify(patent)));
        
        //remove patent from verifier
        let index = verifier.patents.indexOf(patentNumber)
        if (index > -1) {
            verifier.patents.splice(index,1)
         }
        await ctx.stub.putState(verifierId, Buffer.from(JSON.stringify(verifier)));
        
        return JSON.stringify(patent);
        }
        else {
        throw new Error('patent not created');
        }
        }

        async PublishPatent(ctx,patentNumber,publisherId,verifierId,rejectionReason,status,date,price){
        
        let data = await ctx.stub.getState(patentNumber);
        let patent;
        if (data) {
            patent = JSON.parse(data.toString());
        } else {
            throw new Error('patent not found');
        }

        let publisherData = await ctx.stub.getState(publisherId);
        let publisher;
        if (publisherData) {
            publisher = JSON.parse(publisherData.toString());
        if (publisher.type !== 'publisher') {
        throw new Error('publisher not identified');
        }
        } else {
        throw new Error('publisher not found');
        }

        let verifierData = await ctx.stub.getState(verifierId);
        let verifier;
        if (verifierData) {
            verifier = JSON.parse(verifierData.toString());
        if (verifier.type !== 'verifier') {
        throw new Error('verifier not identified');
        }
        } else {
        throw new Error('verifier not found');
        }
        

        if (status === "published"){
            //set patent as published
            patent.status = JSON.stringify(patentStatus.Published);
            patent.price = JSON.stringify(price);
            patent.date = JSON.stringify(date);
            rejectionReason=null;
            patent.rejectionReason = rejectionReason;
            await ctx.stub.putState(patentNumber, Buffer.from(JSON.stringify(patent)));

            //remove patent from publisher
            let index = publisher.patents.indexOf(patentNumber)
            if (index > -1) {
                publisher.patents.splice(index,1)
             }
            await ctx.stub.putState(publisherId, Buffer.from(JSON.stringify(publisher)));
            return JSON.stringify(patent);

        }

        else if(status==="rejected"){
            //rejecting a patent
            price = null;
            date = null;
            patent.price = price;
            patent.date = date;
            patent.status = JSON.stringify(patentStatus.Rejected);
            patent.rejectionReason = JSON.stringify(rejectionReason);
            await ctx.stub.putState(patentNumber, Buffer.from(JSON.stringify(patent)));

            //return the patent to the verifier
            verifier.patents.push(patentNumber);
            await ctx.stub.putState(verifierId, Buffer.from(JSON.stringify(verifier)));

            //remove patent from publisher
            let index = publisher.patents.indexOf(patentNumber)
            if (index > -1) {
                publisher.patents.splice(index,1)
             }
            await ctx.stub.putState(publisherId, Buffer.from(JSON.stringify(publisher)));


            return JSON.stringify(patent);
        }
        
        else {
            throw new Error('patent not created');
            }
        }


        // get the state from key
        async GetState(ctx, key) {
        let data = await ctx.stub.getState(key);
        let jsonData = JSON.parse(data.toString());
        return JSON.stringify(jsonData);
    }
}

module.exports = Patent;
