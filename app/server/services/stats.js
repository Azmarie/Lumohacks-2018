var _ = require('underscore');
var async = require('async');
var User = require('../models/User');

// In memory stats.
var stats = {};
function calculateStats(){
  console.log('Calculating stats...');
  var newStats = {
    lastUpdated: 0,

    total: 0,
    demo: {
      gender: {
        M: 0,
        F: 0,
        O: 0,
        N: 0
      },
      schools: {},
      year: {
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
      },
      cschool: {
        na: 0,
        sfu: 0,
        ubc: 0,
        uv: 0,
        uw: 0,
        o: 0
      },
      major: {
        cs: 0,
        eng: 0,
        hs: 0,
        des: 0,
        bus: 0,
        o: 0
      }
    },

    teams: {},
    verified: 0,
    submitted: 0,
    admitted: 0,
    confirmed: 0,
    confirmedMit: 0,
    declined: 0,

    confirmedFemale: 0,
    confirmedMale: 0,
    confirmedOther: 0,
    confirmedNone: 0,

    shirtSizes: {
      'S': 0,
      'M': 0,
      'L': 0,
      'XL': 0,
    },

    dietaryRestrictions: {},

    hostNeededFri: 0,
    hostNeededSat: 0,
    hostNeededUnique: 0,

    hostNeededFemale: 0,
    hostNeededMale: 0,
    hostNeededOther: 0,
    hostNeededNone: 0,

    reimbursementTotal: 0,
    reimbursementMissing: 0,

    wantsHardware: 0,

    checkedIn: 0
  };

  User
    .find({})
    .exec(function(err, users){
      if (err || !users){
        throw err;
      }

      newStats.total = users.length;

      async.each(users, function(user, callback){

        // Grab the email extension
        var email = user.email.split('@')[1];

        // Add to the gender
        newStats.demo.gender[user.profile.gender] += 1;

        // Count verified
        newStats.verified += user.verified ? 1 : 0;

        // Count submitted
        newStats.submitted += user.status.completedProfile ? 1 : 0;

        // Count accepted
        newStats.admitted += user.status.admitted ? 1 : 0;

        // Count confirmed
        newStats.confirmed += user.status.confirmed ? 1 : 0;

        // Count confirmed that are mit
        newStats.confirmedMit += user.status.confirmed && email === "mit.edu" ? 1 : 0;

        newStats.confirmedFemale += user.status.confirmed && user.profile.gender == "F" ? 1 : 0;
        newStats.confirmedMale += user.status.confirmed && user.profile.gender == "M" ? 1 : 0;
        newStats.confirmedOther += user.status.confirmed && user.profile.gender == "O" ? 1 : 0;
        newStats.confirmedNone += user.status.confirmed && user.profile.gender == "N" ? 1 : 0;

        // Count declined
        newStats.declined += user.status.declined ? 1 : 0;

        // Count the number of people who need reimbursements
        newStats.reimbursementTotal += user.confirmation.needsReimbursement ? 1 : 0;

        // Count the number of people who still need to be reimbursed
        newStats.reimbursementMissing += user.confirmation.needsReimbursement &&
          !user.status.reimbursementGiven ? 1 : 0;

        // Count the number of people who want hardware
        newStats.wantsHardware += user.confirmation.wantsHardware ? 1 : 0;

        // Count schools
        if (!newStats.demo.schools[email]){
          newStats.demo.schools[email] = {
            submitted: 0,
            admitted: 0,
            confirmed: 0,
            declined: 0,
          };
        }
        newStats.demo.schools[email].submitted += user.status.completedProfile ? 1 : 0;
        newStats.demo.schools[email].admitted += user.status.admitted ? 1 : 0;
        newStats.demo.schools[email].confirmed += user.status.confirmed ? 1 : 0;
        newStats.demo.schools[email].declined += user.status.declined ? 1 : 0;

        // Count graduation years
        if (user.profile.year){
          newStats.demo.year[user.profile.year] += 1;
        }
        // console.log("!!! FOOBAR !!!");
        // var a = user.profile;
        // console.log(a);
        // console.log(a.major);


        // Grab the team name if there is one
        // if (user.teamCode && user.teamCode.length > 0){
        //   if (!newStats.teams[user.teamCode]){
        //     newStats.teams[user.teamCode] = [];
        //   }
        //   newStats.teams[user.teamCode].push(user.profile.name);
        // }

        // Count shirt sizes
        if (user.confirmation.shirtSize in newStats.shirtSizes){
          newStats.shirtSizes[user.confirmation.shirtSize] += 1;
        }

        // Host needed counts
        newStats.hostNeededFri += user.confirmation.hostNeededFri ? 1 : 0;
        newStats.hostNeededSat += user.confirmation.hostNeededSat ? 1 : 0;
        newStats.hostNeededUnique += user.confirmation.hostNeededFri || user.confirmation.hostNeededSat ? 1 : 0;

        newStats.hostNeededFemale
          += (user.confirmation.hostNeededFri || user.confirmation.hostNeededSat) && user.profile.gender == "F" ? 1 : 0;
        newStats.hostNeededMale
          += (user.confirmation.hostNeededFri || user.confirmation.hostNeededSat) && user.profile.gender == "M" ? 1 : 0;
        newStats.hostNeededOther
          += (user.confirmation.hostNeededFri || user.confirmation.hostNeededSat) && user.profile.gender == "O" ? 1 : 0;
        newStats.hostNeededNone
          += (user.confirmation.hostNeededFri || user.confirmation.hostNeededSat) && user.profile.gender == "N" ? 1 : 0;

        // Dietary restrictions
        if (user.confirmation.dietaryRestrictions){
          user.confirmation.dietaryRestrictions.forEach(function(restriction){
            if (!newStats.dietaryRestrictions[restriction]){
              newStats.dietaryRestrictions[restriction] = 0;
            }
            newStats.dietaryRestrictions[restriction] += 1;
          });
        }

        // University
        if (user.profile.Cschool === 'SFU') {
          newStats.demo.cschool.sfu++;
        } else if (user.profile.Cschool === 'UBC') {
          newStats.demo.cschool.ubc++;
        } else if (user.profile.Cschool === 'UV') {
          newStats.demo.cschool.uv++;
        } else if (user.profile.Cschool === 'UW') {
          newStats.demo.cschool.uw++;
        } else if (user.profile.Cschool === 'NA') {
          newStats.demo.cschool.na++;
        }
        else {
          newStats.demo.cschool.o++;
        }

        // Major

        if (user.profile.major === 'CS') {
          newStats.demo.major.cs++;
        } else if (user.profile.major === 'ENG') {
          newStats.demo.major.eng++;
        } else if (user.profile.major === 'DES') {
          newStats.demo.major.des++;
        } else if (user.profile.major === 'HS') {
          newStats.demo.major.hs++;
        } else if (user.profile.major === 'BUS') {
          newStats.demo.major.bus++;
        } else {
          newStats.demo.major.o++;
        }

        // Count checked in
        newStats.checkedIn += user.status.checkedIn ? 1 : 0;

        callback(); // let async know we've finished
      }, function() {
        // Transform dietary restrictions into a series of objects
        var restrictions = [];
        _.keys(newStats.dietaryRestrictions)
          .forEach(function(key){
            restrictions.push({
              name: key,
              count: newStats.dietaryRestrictions[key],
            });
          });
        newStats.dietaryRestrictions = restrictions;

        // Transform schools into an array of objects
        var schools = [];
        _.keys(newStats.demo.schools)
          .forEach(function(key){
            schools.push({
              email: key,
              count: newStats.demo.schools[key].submitted,
              stats: newStats.demo.schools[key]
            });
          });
        newStats.demo.schools = schools;

        // Likewise, transform the teams into an array of objects
        // var teams = [];
        // _.keys(newStats.teams)
        //   .forEach(function(key){
        //     teams.push({
        //       name: key,
        //       users: newStats.teams[key]
        //     });
        //   });
        // newStats.teams = teams;

        console.log('Stats updated!');
        newStats.lastUpdated = new Date();
        stats = newStats;
      });
    });

}

// Calculate once every five minutes.
calculateStats();
setInterval(calculateStats, 300000);

var Stats = {};

Stats.getUserStats = function(){
  return stats;
};

module.exports = Stats;
