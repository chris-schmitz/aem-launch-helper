# AEM Helper

## Purpose

AEM Launch Helper is a command line utility that facilitates the launching of an AEM instance.

## Installation

### Adding the jar file

The AEM environment jar file isn't actually included in the project. If you're using this tool you should already have that file.

The jar file should be placed in the `assets/` folder at the root of this project and renamed to the following:

    aem-environment-port.jar

### Project setup
come back and fill this in

## Tasks

### Create a new server environment

Creates a new environment for an AEM instance. Note that this _does not_ start the instance.

    aemhelper create --environment <env> --port <port> --license <license> <location>

- type (dev, author, QA, testing, production)
- port
- license (relative or absolute path to license file)
- location (relative or absolute path)

### Start AEM instance

Starts the AEM environment instance per the given environment string.

    aemhelper start <environment>

    - environment (dev, author, QA, testing, production)

### Stop AEM instance

Stops the AEM environment instance per the given environment string.

    aemhelper  stop <environment>

### Restart AEM instance

Stops and Starts the AEM environment instance per the given environment string.

    aemhelper  stop <environment>


### Slay AEM instance

Stops the AEM instance and deletes the crx-quickstart directory.

**NOTE that this will destroy your instance's data so be sure to back up first**

    aemhelper slay <environment>


## Not sure if we can do this but maybe!

### AEM Status

check system to see if the specific aem instance is running or not (px aux | grep ...)?