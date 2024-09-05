module.exports = {
  apps: [
    {
      name: 'mastopod',
      script: './node_modules/.bin/moleculer-runner',
      args: '--repl services/*.service.js services/**/*.service.js',
      error_file: './logs/err.log',
      out_file: './logs/out.log'
    }
  ]
};
