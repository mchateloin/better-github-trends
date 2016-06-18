import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const repoSchema = new Schema({
  name: { type: 'String', required: true },
  description: { type: 'String', required: true },
  language: { type: 'String', required: true },
  dateDiscovered: {type: 'Date', required: true},
  trendings: { type: 'Array', required: false, default: []}
});

export default mongoose.model('Repo', repoSchema);
