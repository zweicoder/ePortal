# ePortal
![ePortal](/assets/unstableportal.jpg)
A Summoning portal for eDimension files. Sync files from courses on eDimension into your local folders.

Built on [~~Revenant~~](https://github.com/skewedlines/Revenant) and [request](https://www.npmjs.com/package/request) as an experiment and practice with Node.js.

## Usage

### Command line
#### Installation

```bash
$ npm install -g eportal
```

#### Usage

```bash
$ cd path/to/output/files
$ eportal <username> <password> [directory]
```
`[directory]` is optional  and defaults to the folder specified in `settings.js`

### Clone the Repository

Install Dependencies

```bash
$ npm install
# Do your stuff...
$ npm link
$ eportal <username> <password> [directory]
```

## TODO
- Modularize / natify
- Resync feature