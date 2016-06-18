import https from 'https';
import cheerio from 'cheerio';
import mongoose from 'mongoose';
import languages from 'languages';
import RSVP from 'rsvp';

const githubTrendingUrl = 'https://github.com/trending';

var parseReposFromTrendingPage = function(html){
  var $ = cheerio.load(html);

  return $('.repo-list-item')
    .toArray()
    .map(repoListItem => ({
        name: $('.repo-list-name', repoListItem).text(),
        description: $('.repo-list-description', repoListItem).html(),
        language: $('.repo-list-meta', repoListItem).text()
    }))
    .map(repo => {

      if (typeof repo.name === 'string') {
        repo.name = repo.name.replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(' / ', '/');
      }

      if (typeof repo.description == 'string') {
        repo.description = repo.description.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
      }

      if (typeof repo.language === 'string') {
        repo.language = repo.language.split('•')[0].replace(/^\s+|\s+$|\s+(?=\s)/g, '');
      }

      return repo;

    });
}

var getTrendingRepos = function(language) => {
  return new RSVP.Promise(function (resolve, reject) {
    https.get(`${githubTrendingUrl}/${language}`, (response) => {

      var htmlPayload = '';

      response.on('data',
        chunk => {
          htmlPayload += chunk;
        });

      response.on('end',
          () => resolve(parseReposFromTrendingPage(htmlPayload)),
          error => reject(error)
      );
    });
  });
};

var repoExists = function(name){

};

export default () => {
  RSVP

    // Fetch a list of repos for each language's trending page

    .all(Object.keys(languages).map(langKey =>
        getTrendingRepos(langKey)
    )

    // Collapse all the lists into a single list of repos

    .then(trendingRepoLists =>
        trendingRepoLists.reduce((prevList, nextList) =>
          prevList.concat(nextList), []
        )
    )

    // Update the DB

    .then(repos => {

      repos.forEach(repo => {

        // TODO: implement w/ mongoose

      });

    });
}
