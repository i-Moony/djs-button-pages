# ✔ Git Commit Message Convention:

## 🕑 In short:
Message must use this rule:
```
(feature|fix|docs|style|refactor|perform|test) <place>: brief description
```
or for revert commits:
```
revert: (feature|fix|docs|style|refactor|perform|test|chore) <place>: brief description
```

## 📝 Examples:
Appears under "Feature" header:
```
feature PaginationSent: add "delete" method
```
Appears under "Bug Fixes" header:
```
fix ButtonWrapper: assign action correctly
```
Appears under "Performance Improvements" header:
```
perfrom PaginationSent: remove infinite loop
```
Appears under "Revert" header:
```
revert: feature PaginationSent: add "changePageAndUpdate" method

This reverts commit 532eec1353s325a55567b15321e933233f421f02.
```

## 📧 Full message:
```
(type) <place>: brief description
<EMPTY LINE>
full description
<EMPTY LINE>
footer
```

## ❗ Type:
Basic prefixes are: `feature`, `fix`, `docs`, `style`, `refactor`, `perform`, `test`.
Though you can use your own, mind that they should be meaningful.

## 🌍 Place:
Place in the codebase that commit changes. It may be anything, but for example `PaginationSent`, `PaginationWrapper`, `ButtonData`...

## 📜 Brief description:
* Short.
* No dots.
* Imperative verbs, present simple tense.
* No capitalization for the first letter.

## 📕 Full description:
Just write something meaningful that will definetely denote what changes took place.
Remember that all verbs should be used in imperative mood, in present simple tense.

## 📑 Footer:
The footer contains information about **BREAKING CHANGES** and also about GitHub issues that this commit *Closes*.

**BREAKING CHANGES** should start with `BREAKING CHANGE:` and the description of changes on the next line.