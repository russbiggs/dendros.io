# δενδρος - [dendros.io](https://dendros.io)

dendros is a web application for viewing .rwl tree ring width files in the browser. dendros is a tool to visually explore current or archived tree ring data in the Tucson rwl file format. The application uses browser storage to allow repeated use and storage of files. Files uploaded to the application are not shared with a server, all storage is client side only. 

## Notes

Due to the loose specification on the Tucson rwl format some rwl files may not work if they do not follow the specification quite closely. Feedback and github issues are welcome [here](https://github.com/russbiggs/dendros.io/issues) or on the [rwl](https://github.com/russbiggs/rwl) library repositories with examples of rwl files that do not work.


## Contribution

Contributions are welcome in the form of github issues and pull requests.

### Dependencies

dendros is very light on external dependencies for the application itself. [rwl](https://github.com/russbiggs/rwl) (for rwl parsing) and [idb-keyval](https://github.com/jakearchibald/idb-keyval) (for easier IndexedDB queries) are the only bundle dependencies at this time. Development dependencies include babel and webpack for bundling and transpiling.

uses [yarn](https://yarnpkg.com) for production and development dependencies.

### Running locally

use webpack dev server to build and run locally.

```sh
yarn run start:dev
```
