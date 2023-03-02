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

<p style="text-align: right" align="right"><a href="#swiss-docs"> [↑ Back to top ↑] </a></p>

### Add to scripts
Add a script to your package.json

```json
{
 "scripts": {
  "docs": "swiss-docs -i src -o README.md"
}
```

<p style="text-align: right" align="right"><a href="#swiss-docs"> [↑ Back to top ↑] </a></p>

## Command line options

### --src
Alias: -s or -i

The source folder to search for documentation

<p style="text-align: right" align="right"><a href="#swiss-docs"> [↑ Back to top ↑] </a></p>

### --output
Alias: -o

The output file to write the markdown to

<p style="text-align: right" align="right"><a href="#swiss-docs"> [↑ Back to top ↑] </a></p>

### --template
Alias: -t

An optional template to use for the output markdown

Default: [output]

<p style="text-align: right" align="right"><a href="#swiss-docs"> [↑ Back to top ↑] </a></p>

### --header
Alias: -h

The name to use at the top of the table of contents

Default: 'Table of Contents'

<p style="text-align: right" align="right"><a href="#swiss-docs"> [↑ Back to top ↑] </a></p>

### --rootid
Alias: -r

The name of the root id that 'Back to Top' links will use

Default: wont add a 'Back to Top' link

<p style="text-align: right" align="right"><a href="#swiss-docs"> [↑ Back to top ↑] </a></p>

<!-- DOCS: MAIN END -->

Thanks for reading!
