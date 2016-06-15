var https = require('https'),
    cheerio = require('cheerio'),
    $;

module.exports = () => {

  var githubTrendingUrl = 'https://github.com/trending';

  https.get(githubTrendingUrl, (response) => {

    var htmlPayload = '';

    response.on('data', (chunk) => {
      htmlPayload += chunk;
    })

    response.on('end', () => {
      var repos;

      $ = cheerio.load(htmlPayload);

      repos =
        $('.repo-list-item').toArray().map((repoListItem) => {
          return {
            name: $('.repo-list-name', repoListItem).text(),
            description: $('.repo-list-description', repoListItem).html(),
            language: $('.repo-list-meta', repoListItem).text()
          }
        }).map((repo) => {

          if(typeof repo.name === 'string'){
            repo.name = repo.name.replace(/^\s+|\s+$|\s+(?=\s)/g, '').replace(' / ', '/');
          }

          if(typeof repo.description == 'string'){
            repo.description = repo.description.replace(/^\s+|\s+$|\s+(?=\s)/g, '');
          }

          if(typeof repo.language === 'string'){
            repo.language = repo.language.split('•')[0].replace(/^\s+|\s+$|\s+(?=\s)/g, '');
          }

          return repo;

        })

        console.log(repos)

      })

  })

}
