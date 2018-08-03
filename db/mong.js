let mongoose = require('mongoose')
    , set = require('../db/db_set')
    , Subj = require('./models/subjects')
    , Sess = require('./models/sessions')

function SubjectAdd(time,agent,info,total){
    
    return new Promise((resolve,reject)=>{
        mongoose.connect(set.subjects.local,{ useNewUrlParser: true },(err)=>{
            if(err) throw err;
            let sub = new Subj({
                time: time,
                user_agent: agent,
                user_info: info,
                time_total: total,
            });

            sub.save()
            resolve(1)
        });
        });

}

function SessionAdd(game,info,data,start,stop){
    return new Promise((resolve,reject)=>{
        mongoose.connect(set.game_session.local,{ useNewUrlParser: true },(err)=>{
            if(err) throw err;

            let sess = new Sess({
                game:game,
                user_info:info,
                data:data,
                start:start,
                stop:stop
            });
    
            sess.save()
            resolve(1)
        });

        });
}
module.exports.SubjectAdd = SubjectAdd;
module.exports.SessionAdd = SessionAdd;