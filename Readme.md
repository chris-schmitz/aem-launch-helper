# AEM Helper

*Project in progress*

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

The `exec` calls within the project that limit it to mac only are found in:

- `lib/FileSystemTools.js`
    - `FileSystemTools.prototype.openJarFile`
    - `FileSystemTools.prototype.killProcess`
    - `FileSystemTools.prototype.destroyEnvironment`
- `bin/aemhelper-start`
    - In the generation function passed into `co` (the forward slash is *nix specific):

            yield fst.openJarFile(`${targetPath}/aem-${program.environment}-*.jar`)

- `bin/aemhelper-stop`
    - The `exec` function called here is using a *nix specific command:

            exec('ps x', appSettings.maxBuffer, (err, stdout, stderr) => {...


## Installation and Initialization

### Installation

First, install this package by [downloading this package's zip file](https://github.com/chris-schmitz/aem-launch-helper/archive/master.zip) and unzipping it in whatever directory you'd like to set up your AEM instances in.

Note that this tool will create a folder called `AEMEnvironments` directly next to itself and this folder will contain all of the environment instances you create. E.g.

    AEMLaunchHelper/
    AEMEnvironments/
        author/
        publish/

### Initialization

The AEM environment .jar and license files aren't actually included in this tool. If you're using this tool you should already have those file.

To copy the .jar and license files into the tool's structure so they can be used in the various commands below, run the aemhelper command:

    aemhelper init

During this initialization process you will be asked for the paths of both the .jar file and the license file. At the moment the tool does not support path tab completion so it's a good idea to have those paths ready before running `aemhelper init`.

The .jar and license file will be copied into the `AEMLaunchHelper/assets/` directory.

## Add the `aemhelper` command to your path

To get access to the `aemhelper` command, you just need to run the `npm link` command.

    cd AEMLaunchHelper
    npm link

    aemhelper --help

## Tasks

### Create a new server environment

Creates a new environment for an AEM instance. Note that this _does not_ start the instance.

    aemhelper create --environment <env> --port <port> --license <license>

- type (dev, author, QA, testing, production)
- port
- license (relative or absolute path to license file)

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

### Watch your local files to sync with AEM instance

Watches your local File Vault file system for changes and pushes those changes into your AEM instance on change.

    aemhelper watch
