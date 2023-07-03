# swiss-docs

- [Table of Contents](#)
  - [Setup](#setup)
  - [Install](#install)
  - [Add to scripts](#add-to-scripts)
  - [Syntax](#syntax)
    - [Values](#values)
      - [Name](#name)
      - [Header depth](#header-depth)
      - [Priority Level](#priority-level)
  - [Definitions](#definitions)
    - [README](#readme)
    - [File level](#file-level)
    - [Comment level](#comment-level)
    - [Aliases](#aliases)
  - [Command line options](#command-line-options)
    - [--src](#src)
    - [--output](#output)
    - [--template](#template)
    - [--header](#header)

Here are the docs

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

#### Name

An optional unique name for identifying what the DOCS comment is for. Used for DOCS-ALIAS

Names may contain letters (upper and lower cases), `-`, `_`, or `.`. They cannot contain numbers or spaces.

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

#### Header depth

A number of `#` indicating what level of header to use for the first line of the comment.

Also set the depth of the item in the table of contents

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

#### Priority Level

A number to prioritise the order that comments are output in the markdown.

Lower numbers are shown first

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

This is sets the default values for the file. Everything after the file level defaults to the the values set in the file level definition.

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

> NOTE: DOCS-ALIAS comments are not included in generated documentation.

> NOTE: Is it suggested that you run `--alias [x]` on generated d.ts files, rather than source code.

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

Default: 'Table of Contents'

<p style="text-align: right" align="right"><a href="#"> [↑ Back to top ↑] </a></p>

Thanks for reading!
