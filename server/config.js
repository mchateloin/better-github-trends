const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/trendsdb',
  port: process.env.PORT || 8000,
  githubTrendingUrl: 'https://github.com/trending',
  githubLanguages: {
    'all': 'All Languages',
    'unknown': 'Unknown',
    'css': 'CSS',
    'html': 'HTML',
    'java': 'Java',
    'javascript': 'JavaScript',
    'php': 'PHP',
    'python': 'Python',
    'bash': 'Shell',
    'swift': 'Swift'
  }
};

export default config;
