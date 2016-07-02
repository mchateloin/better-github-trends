import mongoose from 'mongoose';
import assert from 'assert';
import serverConfig from '../../server/config';
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const repoSchema = new Schema({
  name: { type: 'String', required: true },
  description: { type: 'String', required: true },
  language: { type: 'String', required: true },
  dateDiscovered: {type: 'Date', required: true},
  trendings: Object.keys(serverConfig.githubLanguages).reduce((prev, next) => {
    prev[next] = [{
      rank: { type: 'Number', required: true },
      dateFrom: { type: 'Date', required: true },
      dateTo: { type: 'Date', required: true }
    }];
    return prev;
  }, {})
});

export default mongoose.model('Repo', repoSchema);
