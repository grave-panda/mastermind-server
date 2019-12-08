# mastermind-server
## Deploy/Run:
Use `heroku create mastermind-server` to initialise. Then add a postgres addon from your heroku dashboard. Then, initialise the database by: `cat init.sql | heroku pg:psql postgres-whatever-00000 --app mastermind-server`, replacing postgres-whatever-00000 by the name of your postgres instance. You can find this name by running `heroku addons`. Finally, run `git push heroku master` to start.
