# Todos

- [x] Refactor create subtool to use the asset license and jar if they exist
- [x] Refactor all console logs to use the logAndNotify module
- [ ] Revisit some of the error throwing in the bin files. When adding the notifier in the os notification is coming through with the markings for the console coloring
- [ ] Figure out what's going on with this line in `aemhelper-stop`

        .filter(processIdMatch => processIdMatch !== null && processIdMatch.length >= 2 )
        throws the error `TypeError: Cannot read property 'length' of null`

- [ ] Add docblock to everything
- [ ] Refactor notifier module to be a class vs related functions.
- [x] Refactor subtools to match patterns in the rest of the project:
    - [x] stop
    - [x] push
- [x] Add `init` subtool
    - [x] Creates ENV folder
    - [x] Asks for base jar and moves in place
    - [x] Asks for license and moves in place
    - [?] asks for username and password and creates the auth.xml(?)
    - [x] extracts vlt tool(?)
- [x] Check for `vlt` in the push/pull scripts and error out if it's not present


## Someday maybe
- [ ] Add "all" option into all subtools for interating with all envs (see stop subtool)
- [ ] At this point I'm just counting on the fact that this is going to be a mac only utility for a while. At some point if there is a demand for it, go back and make it os independent
- [ ] Review FileSystemTools and consider converting some of the promises to sync function calls if it makes sense to do so
