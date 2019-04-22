

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
        let emptyList = [];
        await ctx.stub.putState('owners',Buffer.from(JSON.stringify([{owner1:"Own1",owner1ID:"Own1ID"},{owner2:"Own2",owner2ID:"Own2ID"}])));
        await ctx.stub.putState('verifiers',Buffer.from(JSON.stringify([{verifier1:"Ver1",verifier1ID:"Ver1ID"},{verifier:"Ver2",verifier2ID:"Ver2ID"}])));
        await ctx.stub.putState('publishers',Buffer.from(JSON.stringify([{publisher1:"Pub1",publisher1ID:"Pub1ID"},{publisher2:"Pub2",publisher2ID:"Pub2ID"}])));
        await ctx.stub.putState('auditors',Buffer.from(JSON.stringify([{auditor1:"Aud1",auditor1ID:"Aud1ID"},{auditor2:"Aud2",auditor2ID:"Aud2ID"}])));

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
        //add publisherID to 'publishers' key
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
        
    // async CreatePatent(ctx,ownersIds,verifierId,publisherId,auditorId,patentNumber,patentIndustry,priorArt,details){
        
    //     ownersIds.forEach(ownerId => {
    //     let ownerData = await ctx.stub.getState(ownerId);
    //     let owner;
    //     if (ownerData) {
    //     owner= JSON.parse(ownerData.toString());
    //     if (owner.type !== 'owner') {
    //     throw new Error('owner not identified');
    //     }
    //     } else {
    //     throw new Error('owner not found');
    //     }
    //     });

    //     let verifierData = await ctx.stub.getState(verifierId);
    //     let verifier;
    //     if (verifierData) {
    //     verifier= JSON.parse(verifierData.toString());
    //     if (verifier.type !== 'verifier') {
    //     throw new Error('verifier not identified');
    //     }
    //     } else {
    //     throw new Error('verifier not found');
    //     }


    //     let publisherData = await ctx.stub.getState(publisherId);
    //     let publisher;
    //     if (publisherData) {
    //     publisher= JSON.parse(publisherData.toString());
    //     if (publisher.type !== 'publisher') {
    //     throw new Error('publisher not identified');
    //     }
    //     } else {
    //     throw new Error('publisher not found');
    //     }
        

    //     let auditorData = await ctx.stub.getState(auditorId);
    //     let auditor;
    //     if (auditorData) {
    //     auditor= JSON.parse(auditorData.toString());
    //     if (auditor.type !== 'auditor') {
    //     throw new Error('auditor not identified');
    //     }
    //     } else {
    //     throw new Error('auditor not found');
    //     }


    //     let patent = {
    //         patentNumber:patentNumber,
    //         patentIndustry:patentIndustry,
    //         priorArt:priorArt,
    //         details:details,
    //         status:JSON.stringify(patentStatus.Created),
    //         ownersIds:ownersIds
    //     }

    //     owners.forEach(owner=>{
    //     owner.patents.push(patentNumber);
    //     await ctx.stub.putState(ownerId, Buffer.from(JSON.stringify(owner)));
    //     })

    //     verifier.patents.push(patentNumber);
    //     await ctx.stub.putState(verifierId, Buffer.from(JSON.stringify(verifier)));

    //     await ctx.stub.putState(patentNumber, Buffer.from(JSON.stringify(patent)));

    //     return JSON.stringify(patent);
    // }  
    // async VerifyPatent(ctx,patentNumber,ownwersIds,verifierId){

    //     //Get data json
    //     let data = await ctx.stub.getState(patentNumber);
    //     let patent;
    //     if (data) {
    //         patent = JSON.parse(data.toString());
    //     } else {
    //         throw new Error('patent not found');
    //     }

    //     // verify ownersIds
    //     ownersIds.forEach(ownerId=>{
    //     let ownerData = await ctx.stub.getState(ownerId);
    //     let owner;
    //     if (ownerData) {
    //         owner = JSON.parse(ownerData.toString());
    //         if (owner.type !== 'owner') {
    //             throw new Error('owner not identified');
    //         }
    //     } else {
    //         throw new Error('Owner not found');
    //     }
    //     })
        
    //     let verifierData = await ctx.stub.getState(verifierId);
    //     let verifier;
    //     if (verifierData) {
    //     verifier = JSON.parse(verifierData.toString());
    //     if (verifier.type !== 'verifier') {
    //     throw new Error('verifier not identified');
    //     }
    //     } else {
    //     throw new Error('verifier not found');
    //     }


    //     if (patent.status == JSON.stringify(patentStatus.Created)) {
    //         patent.status = JSON.stringify(patentStatus.Verified);
    //         await ctx.stub.putState(patentNumber, Buffer.from(JSON.stringify(patent)));
            
    //         //add patent to verifier
    //         verifier.patents.push(patentNumber);
    //         await ctx.stub.putState(verifierId, Buffer.from(JSON.stringify(verifier)));
            
    //         return JSON.stringify(patent);
    //         } 
    //         else {
    //         throw new Error('patent not created');
    //         }
    //     }

        // get the state from key
        async GetState(ctx, key) {
        let data = await ctx.stub.getState(key);
        let jsonData = JSON.parse(data.toString());
        return JSON.stringify(jsonData);
    }
}

module.exports = Patent;