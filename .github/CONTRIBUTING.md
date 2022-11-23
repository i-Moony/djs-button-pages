# ✔ Contributing:
### **Important notice:**
**The issue tracker is for bug reports and enhancement suggestions only. If you have a question ask it in Discord DM instead. Discord Tag: _moony#6815_.**

If you wish to contribute to DJS-Button-Pages codebase, feel free to fork and submit a pull request.

ESLint is used to unify code style, so it'll be great for you to set it up in your editor.

# 💭 Setup:
To get ready to work on the codebase it is enough to:
1. Fork & Clone the repository. Switch to the latest branch.
2. Run `npm install`,
3. Run `npm run build` _(It is needed because "Presets" package depends on the main package)_.
4. Code what you seem to like.
5. Run `npm run lint`.
6. If everything is fine, submit a pull request (Make sure that you're following the commit format).

# 🧪 Testing packages locally:
If you want to test changes locally, follow this comprehensive guide:
1. Run `npm link --workspaces` in project's folder.
2. Move to the folder with the future test project.
3. Initialize it using `npm init`.
4. Run `npm link --save djs-button-pages @djs-button-pages/presets`. You should write here only those packages that you want to test. If you don't need `@djs-button-pages/presets`, use: `npm link --save djs-button-pages`, etc.
5. Run `npm install discord.js`.
6. Import package(-s).

### **Important notice:**
Pacakges are using TypeScript to be built. After any change that you'd like to test build packages again.

# 🔰 Adding new packages.
If you'd like to make new package under the `@djs-button-pages` tag use following:
```bash
npm init -w ./packages/<package-name>
```
This will add new package folder under `packages/` with package.json.