# swiss-docs

<!-- DOCS: TOC START -->

  - [Table of Contents](#)
    - [Command line options](#command-line-options)
      - [--src](#src)
      - [--output](#output)
      - [--template](#template)
      - [--header](#header)

<!-- DOCS: TOC END -->

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
```

## Syntax

### Values

#### Header depth

A number of `#` indicating what level of header to use for the first line of the comment.

Also set the depth of the item in the table of contents

#### Priority Level

A number to prioritise the order that comments are output in the markdown.

Lower numbers are shown first

### Definitions

#### File level

This is sets the default values for the file. Everything after the file level defaults to the the values set in the file level definition.

Multiple file level definitions can be used in the same file, splitting the defaults into sections

```typescript
//<!-- DOCS: ## 100 -->
```

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

<!-- DOCS: MAIN START -->

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

<!-- DOCS: MAIN END -->

Thanks for reading!
