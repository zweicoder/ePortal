# ePortal
A Summoning portal for files on eDimension. Sync files from courses on eDimension into your local folders.

Built on [~~Revenant~~](https://github.com/skewedlines/Revenant) and [request](https://www.npmjs.com/package/request) as an experiment and practice with Node.js.

## Usage

### Command line
#### Installation

```bash
$ npm install -g eportal
```

#### Usage

```bash
$ eportal <username> <password> <directory>
```

Depending on how `settings.js` is configured, ePortal will save the relevant data to the correct directory.

#### Clone the Repository

Install Dependencies

```bash
$ npm install
```

Change the parameters in `settings.js`, then run `node Summoner.js`

## TODO
- Modularize / natify
- Put more options of `settings.js` in the CLI

