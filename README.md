# Blokmap

A useful map with al bloklocations (= study locations) in Ghent.

We usually use data from [Stad Gent](https://stad.gent/studenten/studeren/bloklocaties) and mails people send to us.

## Dev

You can easily run the site locally by spawning a simple static file server in the `src` directory. For example with `python3 -m http.server` or any other one-liner in [this big list](https://gist.github.com/willurd/5720255).

This package uses [jsonlint](https://github.com/zaach/jsonlint) to check the validity of the json file.

Test validity locally by installing the npm package with `npm install -g jsonlint` and then running `jsonlint src/data.json`.
