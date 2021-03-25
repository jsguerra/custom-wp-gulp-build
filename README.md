# WordPress Gulp Build
> Automate WordPress theme or plugin development using Gulp 4 with Babel intergration to be able to use ECMAscript ES6+

## Fork this repository and rename to new project name.

---

## Requirements
This setup requires Local environment running in the background.

---

### Basic Instructions
1. After Local has been started and synced
2. Clone repo to local machine's project app folder
3. Open terminal and run:
```
  npm i
```
4. Update package config section and save
5. In terminal change directory to cloned repo
6. To start local dev run the following command in Terminal:
```
  npm run local
```
7. To build production files run the following command in Terminal:
```
  npm run build
```
8. Add **bitbucket-pipelines.yml** file, use the template below and update as necessary.
9. Add files and commits to repo and push

#### Configuration Explained in package.json
```json
{
  "config": {
    "name": "Your Name",
    "sitename": "sitename",
    "localserverpath": "/public/wp-content/themes/",
    "productionserverpath": "/wp-content/themes/",
    "themename": "themename",
    "siteurl": "http://sitename.wpengine.com/"
  }
}
```
### Definitions
The following items must be updated for each new project

1. **name:** this is your name
2. **sitename:** the name of the project (no spaces)
3. **themename:** the name of the theme or plugin you are developing
4. **siteurl:** the site url in WP Engine, replace sitename

If developing a plugin change **localserverpath** and **productionserverpath** folder from **themes** to **plugins**

---

### Bitbucket-pipelines.yml File
```
pipelines:
  branches:
    master:
      - step:
          name: Push to Production
          deployment: production
          script:
            - git fetch --depth=10000
            - git push git@git.wpengine.com:production/YOUR_INSTALL_NAME.git master
            - echo "Completed"
    staging:
      - step:
          name: Push to Staging
          deployment: staging
          script:
            - git fetch --depth=10000
            - git push git@git.wpengine.com:staging/YOUR_INSTALL_NAME.git staging
            - echo "Completed"
```

In order to use the yml file, both Bitbucket and WPEngine have to be configured with public/private keys to communicate. See Confluence for further instructions.

---

### Directory Overview
```
app/
├── public
└── Project Name/
    ├── wp-content/production theme files & folders
    ├── src/
    │   ├── fonts/
    │   ├── js/
    │   ├── images/
    │   ├── scss/
    │   └── theme files & folders
    |
    ├── .browserlistrc
    ├── .gitignore
    ├── bitbucket-pipelines.yml
    ├── gulpfile.babel.js
    ├── package-lock.json
    ├── package.json
    └── README.md
```