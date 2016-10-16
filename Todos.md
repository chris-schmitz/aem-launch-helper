# Todos

- Refactor subtools to match patterns in the rest of the project:
    - x stop
    - push
- Add `init` subtool
    - Creates ENV folder
    - Asks for base jar and moves in place
    - Asks for license and moves in place
    - asks for username and password and creates the auth.xml(?)
    - extracts vlt tool(?)
- Replace manual checks for proper parameters with commander regex arguments
- Check for `vlt` in the push/pull scripts and error out if it's not present
- Add "all" option into all subtools for interating with all envs (see stop subtool)
