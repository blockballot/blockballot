const db = require('./index.js');

const createPoll = (orgId, pollOptions) => {
  return db.Poll.create({ 
    orgId: orgId,
    pollName: pollOptions.pollName,
    pollTimeStart: pollOptions.pollStart,
    pollTimeEnd: pollOptions.pollEnd,
    pollHash: pollOptions.pollAddress
  })
}

const createOption = (pollId, optionName) => {
  return db.Option.create({
    optionName: optionName,
    pollId: pollId
  });
}

const saveVoterID = (voteID, pollId) => {
  return db.VoteKey.create({
    voterUniqueId: voteID,
    pollId: pollId
  })
}

exports.createPoll = createPoll;
exports.createOption = createOption;
exports.saveVoterID = saveVoterID;