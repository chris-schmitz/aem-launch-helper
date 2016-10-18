# Todos

- Refactor subtools to match patterns in the rest of the project:
    - [x] stop
    - [ ] push
- Add `init` subtool
    - [x] Creates ENV folder
    - [x] Asks for base jar and moves in place
    - [x] Asks for license and moves in place
    - [?] asks for username and password and creates the auth.xml(?)
    - [ ] extracts vlt tool(?)
- Check for `vlt` in the push/pull scripts and error out if it's not present
- Add "all" option into all subtools for interating with all envs (see stop subtool)
- Review the [completion.js](https://docs.npmjs.com/cli/completion) tool for allowing tab completion in prompts
- Determine if `usr/local/bin` is the best bin dir to use for the vlt tools
