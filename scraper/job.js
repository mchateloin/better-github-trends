import https from 'https';
import cheerio from 'cheerio';
import mongoose from 'mongoose';
import serverConfig from '../server/config';
import Repo from '../server/models/repo';

export default function(){
  return Promise

    // Fetch a list of repos for each language's trending page
    .all(Object.keys(serverConfig.githubLanguages).map(langKey =>
        getTrendingRepos(langKey)
    ))

    // Collapse all the lists into a single list of repos
    .then(trendingRepoLists =>
      trendingRepoLists.reduce((prevList, nextList) =>
          prevList.concat(nextList), []
      )
    )

    // Update each repo in the database
    .then(repos => Promise.all(repos.map(repo => {
      return saveRepo(repo)
    })))


    // Wait a fixed period of time to repeat this whole operation.
    .then(() => {
      return setTimeout(autoUpdateDB, serverConfig.dbUpdateInterval);
    })
}

function saveRepo(repo){
  return Repo
      .findOne({name: repo.name}).exec()
      .then(result => {


        if(!result){
          console.log(`Repository '${repo.name}' does not exist. Creating a new record.`);

          var repoModel = new Repo({
            name: repo.name,
            description: repo.description,
            dateDiscovered: Date.now(),
            language: repo.language,
            trendings: {}
          });

          repoModel.trendings[repo.trendingPage] = [{
            rank: repo.rank,
            dateFrom: Date.now(),
            dateTo: Date.now()
          }];

          return repoModel.save();

        } else {
          // Do an update
        }

      }, err => console.log(err))

    .catch(reason => console.log(reason));

}

function getTrendingRepos(language) {
  return new Promise(function (resolve, reject) {
    https.get(`${serverConfig.githubTrendingUrl}/${language}`, (response) => {

      var htmlPayload = '';

      response.on('data',
          chunk => {
          htmlPayload += chunk;
        });

      response.on('end',
          () => resolve(parseReposFromTrendingPage(htmlPayload, language)),
          error => reject(error)
      );
    });
  });
}

function parseReposFromTrendingPage (html, trendingPage){
  var $ = cheerio.load(html);

  return $('.repo-list-item')
    .toArray()
    .map(repoListItem => ({
        name: $('.repo-list-name', repoListItem).text(),
        description: $('.repo-list-description', repoListItem).html(),
        language: $('.repo-list-meta', repoListItem).text()
    }))
    .map((repo, rank) => {

      if (typeof repo.name === 'string') {
        repo.name = repo.name.replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(' / ', '/');
      }

      if (typeof repo.description == 'string') {
        repo.description = repo.description.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
      }

      if (typeof repo.language === 'string') {
        repo.language = repo.language.split('•')[0].replace(/^\s+|\s+$|\s+(?=\s)/g, '');
      }

      repo.rank = rank + 1;
      repo.trendingPage = trendingPage || 'all';

      console.log(repo);

      return repo;

    });
}
