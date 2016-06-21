import mongoose from 'mongoose';
import serverConfig from '../../server/config';
const Schema = mongoose.Schema;

const repoSchema = new Schema({
  name: { type: 'String', required: true },
  description: { type: 'String', required: true },
  language: { type: 'String', required: true },
  dateDiscovered: {type: 'Date', required: true},
  trendings: Object.keys(serverConfig.githubLanguages).reduce((prev, next) => {
    prev[next] = { type: 'Array', required: false, default: []};
    return prev;
  }, {})
});

repoSchema.statics.findByName = function(repoName){
  return new Promise((resolve, reject) => {
    this.find({ name: new RegExp(repoName, 'i') }, function(err, repos){
      if(err){
        reject(err);
      } else if(repos.length === 0){
        resolve(null);
      } else {
        resolve(repos[0]);
      }
    })
  });
};

export default mongoose.model('Repo', repoSchema);
