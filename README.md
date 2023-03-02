# swiss-docs

<!-- DOCS: TOC START -->

  - [Table of Contents](#swiss-docs)
      - [Setup](#setup)
      - [Install](#install)
      - [Add to scripts](#add-to-scripts)
    - [Command line options](#command-line-options)
      - [--src](#src)
      - [--output](#output)
      - [--template](#template)
      - [--header](#header)
      - [--rootid](#rootid)

<!-- DOCS: TOC END -->

Here are the docs

<!-- DOCS: MAIN START -->

### Setup

### Install
```bash
yarn add -D swiss-docs
```

or

```bash
npm install --save-dev swiss-docs
```

<a href="#swiss-docs" style="text-align: right"> [↑ Back to top ↑] </a>

### Add to scripts
Add a script to your package.json

```json
{
 "scripts": {
  "docs": "swiss-docs -i src -o README.md"
}
```

<a href="#swiss-docs" style="text-align: right"> [↑ Back to top ↑] </a>

## Command line options

### --src
Alias: -s or -i

The source folder to search for documentation

<a href="#swiss-docs" style="text-align: right"> [↑ Back to top ↑] </a>

### --output
Alias: -o

The output file to write the markdown to

<a href="#swiss-docs" style="text-align: right"> [↑ Back to top ↑] </a>

### --template
Alias: -t

An optional template to use for the output markdown

Default: [output]

<a href="#swiss-docs" style="text-align: right"> [↑ Back to top ↑] </a>

### --header
Alias: -h

The name to use at the top of the table of contents

Default: 'Table of Contents'

<a href="#swiss-docs" style="text-align: right"> [↑ Back to top ↑] </a>

### --rootid
Alias: -r

The name of the root id that 'Back to Top' links will use

Default: wont add a 'Back to Top' link

<a href="#swiss-docs" style="text-align: right"> [↑ Back to top ↑] </a>

<!-- DOCS: MAIN END -->

Thanks for reading!
