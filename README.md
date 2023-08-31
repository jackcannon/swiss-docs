# swiss-docs

- [swiss-docs](#swiss-docs)
    - [Setup](#setup)
    - [Install](#install)
    - [Add to scripts](#add-to-scripts)
  - [Syntax](#syntax)
    - [Values](#values)
      - [Name](#name)
      - [Header depth](#header-depth)
        - [Subsection](#subsection)
      - [Priority Level](#priority-level)
      - [Allow JSDoc Updates](#allow-jsdoc-updates)
    - [Definitions](#definitions)
      - [README](#readme)
      - [File level](#file-level)
      - [Comment level](#comment-level)
      - [Aliases](#aliases)
  - [Command line options](#command-line-options)
    - [--src](#--src)
    - [--output](#--output)
    - [--template](#--template)
    - [--header](#--header)
    - [--jsdoc](#--jsdoc)
      - [Problems with some JSDoc comments not being updated](#problems-with-some-jsdoc-comments-not-being-updated)

`swiss-docs` is a tool for extracting and updating certain JSDoc comments from a repo, and generating a structured, formatted README/markdown document.

The principle is that documentation for a given function/item should not need to be duplicated/maintained in multiple locations, but in one place: in the code, alongside the item itself.

By adding a small amount of meta tags and other small comments, the code becomes self documenting, with room for expansion, examples and more.

### Setup

### Install

```bash
yarn add -D swiss-docs
```

or

```bash
npm install --save-dev swiss-docs
```

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### Add to scripts

Add a script to your package.json

```json
{
  "scripts": {
    "docs": "swiss-docs -i src -o README.md"
  }
}
```

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

## Syntax

### Values

The following values can be combined in a single DOCS meta tag:

```typescript
/**<!-- DOCS: something ###! 10 -->
 * Something
 */
```

#### Name

An optional unique name for identifying what the DOCS comment is for. Used for DOCS-ALIAS

Names may contain letters (upper and lower cases), numbers, `-`, `_`, or `.`. They cannot contain spaces, and cannot start with a number.

```typescript
/**<!-- DOCS: something -->
 * Something
 */
```

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

#### Header depth

A number of `#` indicating what level of header to use for the first line of the comment.

Also set the depth of the item in the table of contents

```typescript
/**<!-- DOCS: ### -->
 * Something
 */
```

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

##### Subsection

A subsection is a segment that has it's own table of contents. Any immediately following segments (after prioritisation) are shown in a mini table of contents under this segment's section of the README, and those 'child' sections are omitted from any Table of Contents that the subsection is shown in.

Subsections may have subsections.

This is a way of reducing the size of the main README table of contents, and dividing it into smaller TOCs throughout the README.

You can indicate that this header is a 'subsection' by adding a `!` after the last `#` (e.g. `###!`).

```typescript
/**<!-- DOCS: ###! -->
 * Something
 */
```

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

#### Priority Level

A number to prioritise the order that comments are output in the markdown.

Lower numbers are shown first

```typescript
/**<!-- DOCS: 20 -->
 * Shown 2nd
 */
/**<!-- DOCS: 10 -->
 * Shown 1st
 */
```

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

#### Allow JSDoc Updates

Adding a single `@` (with spacing either side) in the meta tag will indicate that this comment is okay to be updated by the `--jsdoc` process.

```typescript
/**<!-- DOCS: @ -->
 * someFunc
 *
 * You can run --jsdoc, and I'll update
 */
const someFunc = (param: number): number => 1;
```

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### Definitions

#### README

In the README, wrap where you want the table of contents to be with these comments:

```markdown
<!-- DOCS: TOC START -->

<!-- DOCS: TOC END -->
```

Wrap where you want the generated content to be with these comments:

```markdown
<!-- DOCS: TOC START -->

<!-- DOCS: TOC END -->
```

Note: anything in these sections will be removed and replaced by the swiss-docs script.

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

#### File level

This sets the default values for the file. Everything after the file level defaults to the the values set in the file level definition.

Multiple file level definitions can be used in the same file, splitting the defaults into sections

```typescript
//<!-- DOCS: ## 100 -->
```

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

#### Comment level

A standard documentation comment. The meta tag must be present to be picked up by the library

First line of the comment should be the header/title of the section. The rest is standard markdown

```typescript
/**<!-- DOCS: ## 100 -->
 * Title
 *
 * - `A list item`
 *
 * Some description
 */
```

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

#### Aliases

Sometimes multiple sections of code need the same JSDOC comment. Rather than duplicating the comment, and managing 2 versions of the comment, you can use aliases to copy comments in the generated code.

Example:

```typescript
// file: code.ts

/**<!-- DOCS: example 2 ## -->
 * exampleFunc
 *
 * Something
 */
export const exampleFunc = () => {};

/**<!-- DOCS-ALIAS: example -->*/
export const egFunc = () => {};
```

Running tsc normally will give this definition file:

```typescript
// file: code.d.ts

/**<!-- DOCS: example 2 ## -->
 * exampleFunc
 *
 * Something
 */
export declare const exampleFunc: () => void;
/**<!-- DOCS-ALIAS: example -->*/
export declare const egFunc: () => void;
```

Adding `--alias code.d.ts` to the swiss-docs will replace any DOCS-ALIAS comments in `code.d.ts` with their corresponding DOCS comments:

```typescript
// file: code.d.ts

/**<!-- DOCS: example 2 ## -->
 * exampleFunc
 *
 * Something
 */
export declare const exampleFunc: () => void;
/**<!-- DOCS-ALIAS: example -->
 * exampleFunc
 *
 * Something
 */
export declare const egFunc: () => void;
```

> WARNING: DOCS-ALIAS comments are not included in generated documentation.

> WARNING: Is it suggested that you run `--alias [x]` on generated d.ts files, rather than source code.

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

## Command line options

### --src

Alias: -s or -i

The source folder to search for documentation

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### --output

Alias: -o

The output file to write the markdown to

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### --template

Alias: -t

An optional template to use for the output markdown

Default: [output]

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### --header

Alias: -h

The name to use at the top of the table of contents

Default: false

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

### --jsdoc

Alias: -j

Update the JSDoc @ tags in the src files before running the docs.

> WARNING: this will make changes to the original source files

> WARNING: As each file is transpiled and processed by an external library, this can be very slow

#### Problems with some JSDoc comments not being updated

To add/update the JSDoc tags, each file is transpiled with the `ts-to-jsdoc` library (a custom fork called [`@jackcannon/ts-to-jsdoc`](https://www.npmjs.com/package/@jackcannon/ts-to-jsdoc)), and the result scanned to obtain updated comments to replace the originals with.

This library only seems to handle top-level functions, so the files are pre-processed before the transpile stage to remove any lines that take JSDoc-able sections out of the scope of the library (notably namespaces). These removable sections are indicated by comments in the code.

So this file:

```typescript
'line 1';

// SWISS-DOCS-JSDOC-REMOVE-START
'REMOVE ME';
// SWISS-DOCS-JSDOC-REMOVE-END

'line 2';

// SWISS-DOCS-JSDOC-REMOVE-NEXT-LINE
'REMOVE ME';

'line 3';

'REMOVE ME'; // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE

'line 4';

'REMOVE ME';
// SWISS-DOCS-JSDOC-REMOVE-PREV-LINE

'line 5';

export namespace Example {
  // SWISS-DOCS-JSDOC-REMOVE-PREV-LINE
  /**
   * A JSDoc comment
   */
  export const aFunc = (param: string): number => 1;
} // SWISS-DOCS-JSDOC-REMOVE-THIS-LINE
```

gets passed to ts-to-jsdoc as:

```typescript
'line 1';

'line 2';

'line 3';

'line 4';

'line 5';

/**
 * A JSDoc comment
 */
export const aFunc = (param: string): number => 1;
```

Default: false

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

Thanks for reading!
