# AEM Helper

## Purpose

AEM Launch Helper is a command line utility that facilitates the launching of an AEM instance.

Note that the environment folders and files that are created by this application will be placed in the same directory that you place the project folder. I.e. If you place this project folder at:

    ~/Development/AEMLaunchHelper

The environment folders will be created next to it:

    ~Development:
        AEMLaunchHelper/
        AEMEnvironments/...

![launch helper demo](readmeAttachments/aemhelperDemo.gif)

## Special OS note

Several of the functions use in this project call shell functions, specifically shell functions available in the Mac OS ecosystem. Because of this, the current version of aemhelper is a mac only tool.

That said, we are open for pull requests so if you're a windows dev who wants to use this project please feel free to build windows equevalent features and send over a pull request.


## Installation and Initialization

### Installation

First, install this package by [downloading this package's zip file](https://github.com/chris-schmitz/aem-launch-helper/archive/master.zip) and unzipping it in whatever directory you'd like to set up your AEM instances in.

Note that this tool will create a folder called `AEMEnvironments` directly next to itself and this folder will contain all of the environment instances you create. E.g.

    AEMLaunchHelper/
    AEMEnvironments/
        author/
        publish/

## Add the `aemhelper` command to your path

To get access to the `aemhelper` command, you just need to run the `npm link` command.

    cd AEMLaunchHelper
    npm link

    aemhelper --help


## Initialization

The AEM environment .jar and license files aren't actually included in this tool. If you're using this tool you should already have those files.

The first command you should run with the `aemhelper` tool is the `init command`:

    aemhelper init

This process will:

- Request and copy your AEM jar file and license into the `assets/` directory.
    - This is allows the tool to create new AEM instances.
- Install the `vlt` command line tool found within your AEM jar file.
    - The bin directory used is determined by the `config.json` file's `paths.bin` value.

### Manual asset installation

If you don't want to use the `init` command or if the init command is not working correctly for some reason, you can manually install the jar and license flies:

- Copy your AEM jar file into the `assets` directory.
- Rename your AEM jar file to `aem-environment-port.jar`.
- Copy your AEM license file into the `assets` directory.

In the end, your assets directory should look like this:

    assets/
        extractWorkspace
        icons
        .gitkeep
        aem-environment-port.jar
        license.properties

## Commands

### `aemhelper create`
#### Create a new server environment

Creates a new environment for an AEM instance. Note that this _does not_ start the instance.

    aemhelper create --environment <env> --port [port] --license [license]

- Note that the directory that the environments are created in is determined by the `appSettings.environmentBuildDirectory` in the `appSettings.js` file. By default the environments are created in an `AEMEnvironments` folder next to this project folder.
- Valid environment values: author, testing
- If no port value is provided it will default to 4502
- If you've run the `aemhelper init` process no license value is necessary. If you have not run `aemhelper init` or you would like to use a different license, provide the path to the license file.


### Start AEM instance

Starts the AEM environment instance per the given environment string.

    aemhelper start -e <environment>

    - environment (author, publish)

### Stop AEM instance

Stops the AEM environment instance per the given environment string.

    aemhelper  stop -e <environment>


### Slay AEM instance

Stops the AEM instance and deletes the crx-quickstart directory.

**NOTE that this will destroy your instance's data so be sure to back up first**

    aemhelper slay -e <environment>

### Push to AEM instance

Takes your local File Vault file system and pushes it into your AEM instance.

    aemhelper push

### Pull from AEM instance

Pulls from your AEM instance into your local File Vault file system.

    aemhelper pull

### Watch your local files to sync with AEM instance

Watches your local File Vault file system for changes and pushes those changes into your AEM instance on change.

    aemhelper watch
