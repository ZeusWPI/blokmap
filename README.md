# Blokmap

A useful map that lists all the public study locations in Ghent.

We usually use data from [Stad Gent](https://stad.gent/studenten/studeren/bloklocaties), [Stad Kortrijk](http://www.kortrijkstudentenstad.be/aanbod/bloklocaties/) and emails sent by people..

## Development

You can easily run the site locally by spawning a simple static file server in the `src` directory. For example by using the following command, or by using any other one-liner from [this big list](https://gist.github.com/willurd/5720255).

```
(cd src/; python3 -m http.server)
```

You can also validate the JSON with `(cd src/; python -m json.tool data.json > /dev/null)`. If there are no errors, there will be no output.
