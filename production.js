'use strict';

module.exports = (app, port) => {
  // if ssl was included
  /*
  app.enable('trust proxy');

  app.use((req, res, next) => {
    if (req.secure) {
      // request was via https, so do no special handling
      next();
    } else {
      const proxypath = process.env.PROXY_PASS || '';
      // request was via http, so redirect to https
      res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
    }
  });
app.listen(port, () => console.log(`app listen on port ${port}`))
   */

  // No ssl for heroku
  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`listening on ${PORT}`));
};